#!/usr/bin/env python3
"""
Paper34 — rapport Search Console en ligne de commande.

Aucune dépendance : requêtes HTTP brutes, jeton fourni par gcloud. Le but est
qu'un rapport se lise sans ouvrir de navigateur, et qu'il soit archivé en JSON
pour permettre les comparaisons d'un mois sur l'autre — l'API Google n'expose
que 16 mois glissants, sans archive l'historique se perd.

    python3 scripts/rapport-gsc.py                # le client, 28 jours
    python3 scripts/rapport-gsc.py 90             # le client, 90 jours
    python3 scripts/rapport-gsc.py 28 autre.fr    # consulter un autre client
"""

import datetime as dt
import json
import os
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

DOMAINE_PAR_DEFAUT = "guinguette-bessan.fr"     # posé par installer-rapport-gsc.sh
DOMAINE = DOMAINE_PAR_DEFAUT           # surchargeable en 2e argument
PROJET = "chrome-energy-479809-e1"     # projet Google portant le quota d'API
API = "https://searchconsole.googleapis.com/webmasters/v3"
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVES = os.path.join(RACINE, "data")

# gcloud refuse une liste de portées qui n'inclut pas cloud-platform : elle
# est obligatoire, même quand on ne s'en sert pas.
AIDE_AUTH = (
    "Pas d'accès Search Console. À lancer une seule fois (ouvre le navigateur,\n"
    "puis plus jamais ensuite) :\n\n"
    "  gcloud auth application-default login --scopes=openid,\\\n"
    "https://www.googleapis.com/auth/cloud-platform,\\\n"
    "https://www.googleapis.com/auth/webmasters\n"
)


def obtenir_jeton():
    """Jeton d'accès via les identifiants par défaut de gcloud (ADC)."""
    try:
        return subprocess.run(
            ["gcloud", "auth", "application-default", "print-access-token"],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        sys.exit(AIDE_AUTH)


JETON = None


def appel(chemin, corps=None):
    url = "%s/sites/%s/%s" % (API, urllib.parse.quote(PROPRIETE, safe=""), chemin)
    donnees = json.dumps(corps).encode() if corps is not None else None
    requete = urllib.request.Request(
        url, data=donnees,
        headers={
            "Authorization": "Bearer " + JETON,
            "Content-Type": "application/json",
            # Les identifiants locaux (ADC) n'ont pas de projet de facturation
            # attaché : sans cet en-tête l'API répond 403. On le passe ici
            # plutôt que de modifier la config gcloud de la machine.
            "x-goog-user-project": PROJET,
        },
        method="POST" if corps is not None else "GET",
    )
    try:
        with urllib.request.urlopen(requete) as reponse:
            return json.load(reponse)
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:400]
        if e.code in (401, 403):
            sys.exit(
                "Refusé (%d). Le compte connecté n'a pas accès à %s,\n"
                "ou la portée « webmasters » manque au jeton.\n\n%s\n%s"
                % (e.code, PROPRIETE, AIDE_AUTH, detail)
            )
        sys.exit("Erreur %d sur %s :\n%s" % (e.code, chemin, detail))


def recherche(debut, fin, dimensions, limite=25):
    return appel("searchAnalytics/query", {
        "startDate": debut, "endDate": fin,
        "dimensions": dimensions,
        "rowLimit": limite,
    }).get("rows", [])


def tableau(titre, lignes, largeur=46):
    print("\n" + titre)
    print("-" * 74)
    if not lignes:
        print("  (aucune donnée)")
        return
    print("  %-*s %6s %7s %6s %6s" % (largeur, "", "clics", "impr.", "CTR", "pos."))
    for l in lignes:
        cle = " · ".join(l["keys"])
        if len(cle) > largeur:
            cle = cle[:largeur - 1] + "…"
        print("  %-*s %6.0f %7.0f %5.1f%% %6.1f" % (
            largeur, cle, l["clicks"], l["impressions"],
            l["ctr"] * 100, l["position"],
        ))


def main():
    jours = int(sys.argv[1]) if len(sys.argv) > 1 else 28
    # Google publie avec deux à trois jours de retard : demander « hier »
    # renverrait du vide et laisserait croire à une chute de trafic.
    fin = dt.date.today() - dt.timedelta(days=3)
    debut = fin - dt.timedelta(days=jours)
    d, f = debut.isoformat(), fin.isoformat()

    print("\n  %s — Search Console · %s → %s (%d jours)"
          % (PROPRIETE.replace("sc-domain:", "").upper(), d, f, jours))
    print("=" * 74)

    total = recherche(d, f, [], 1)
    if total:
        t = total[0]
        print("\n  %.0f clics · %.0f impressions · CTR %.1f%% · position moyenne %.1f"
              % (t["clicks"], t["impressions"], t["ctr"] * 100, t["position"]))
    else:
        print("\n  Aucune donnée sur la période — normal si le site vient d'être indexé.")

    requetes = recherche(d, f, ["query"], 25)
    pages = recherche(d, f, ["page"], 15)
    appareils = recherche(d, f, ["device"], 5)
    pays = recherche(d, f, ["country"], 5)

    tableau("REQUÊTES — ce que les gens tapent pour arriver sur le site", requetes)
    tableau("PAGES", pages)
    tableau("APPAREILS", appareils, largeur=20)
    tableau("PAYS", pays, largeur=20)

    sitemaps = appel("sitemaps").get("sitemap", [])
    print("\nSITEMAPS")
    print("-" * 74)
    if not sitemaps:
        print("  (aucun sitemap soumis)")
    for s in sitemaps:
        contenu = (s.get("contents") or [{}])[0]
        print("  %s\n    lu le %s · %s URL soumises · %s indexées · erreurs : %s" % (
            s.get("path", "?"),
            s.get("lastDownloaded", "?")[:10],
            contenu.get("submitted", "?"),
            contenu.get("indexed", "—"),
            s.get("errors", 0),
        ))

    # Un client = un dossier. Le script accepte n'importe quel domaine pour
    # une consultation ponctuelle, mais n'archive que le sien : un instantané
    # d'Infini Mouv rangé chez Opium finirait par tromper une lecture future.
    if DOMAINE != DOMAINE_PAR_DEFAUT:
        print("\n  Consultation seule — pas d'archive : %s n'est pas le client"
              "\n  de ce dossier. Lancer le script depuis son propre dossier"
              "\n  pour tenir son historique.\n" % DOMAINE)
        return

    os.makedirs(ARCHIVES, exist_ok=True)
    archive = os.path.join(ARCHIVES, "gsc-%s.json" % fin.strftime("%Y-%m"))
    with open(archive, "w", encoding="utf-8") as fic:
        json.dump({
            "domaine": DOMAINE,
            "periode": {"debut": d, "fin": f, "jours": jours},
            "total": total[0] if total else None,
            "requetes": requetes,
            "pages": pages,
            "appareils": appareils,
            "pays": pays,
            "sitemaps": sitemaps,
        }, fic, ensure_ascii=False, indent=2)
    print("\n  Instantané archivé : data/%s\n" % os.path.basename(archive))


if __name__ == "__main__":
    if len(sys.argv) > 2:
        DOMAINE = sys.argv[2]
    PROPRIETE = "sc-domain:" + DOMAINE
    JETON = obtenir_jeton()
    main()

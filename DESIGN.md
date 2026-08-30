# DESIGN.md — La Guinguette de Bessan · Bessan (34)

> DA rétro-formalisée le 30/08/2026 (mise à niveau standards studio) à partir du site
> en production — la DA est déjà validée par le client, ce document sert de référence
> anti-dérive pour toutes les évolutions futures.

**Secteur** : restaurant saisonnier de bord de rivière (guinguette)
**Personnalité en 3 mots** : naturel, feutré, convivial
**Références** : identité issue du logo existant (arbre + mobilier guinguette) et de la
vidéo du lieu — la DA prolonge le réel : on est déjà sous les platanes, au bord de l'eau.

---

## 1. Tokens couleurs

| Nom | Hex | Variable | Rôle (argumenté) |
|-----|-----|----------|------------------|
| Vert platane | `#2C381E` | `vert` | Le sol unique du site : fond continu de toutes les sections. C'est la frondaison — on ne quitte jamais l'ombre de l'arbre. |
| Vert nuit | `#1e2614` | `vert-dark` | Creux du fond (dégradés de section très doux, CTA de filtres inactifs) — de la profondeur, jamais une rupture. |
| Vert feuille | `#3d4d2a` | `vert-light` | Surfaces de contraste léger (placeholder, hover). |
| Crème guinguette | `#FFEFD6` | `creme` | L'unique voix du site : 100 % du texte, bordures, filets — presque toujours en opacité réduite (`/70`, `/40`, `/25`…). En aplat plein uniquement sur la décision d'action : CTA principal, pill de filtre actif, bandeau d'annonce. |
| Crème foncée | `#F5DFC0` | `creme-dark` | Hover du CTA principal, rien d'autre. |
| Rouge joute | `#CD1719` | `rouge` | Hérité du logo — actuellement **en sommeil** (aucun usage rendu). Réserve pour urgence/alerte éventuelle ; ne pas l'introduire en décoratif. |

Règle : pas de couleur « décision » chromatique — la décision se joue en **inversion**
(texte vert sur aplat crème). Tout le reste est de la matière crème translucide sur vert.

## 2. Typographie

- **Fonctionnelle** : Outfit (variable 300–700) — corps, nav, cartes, prix, boutons.
  Auto-hébergée (`site/fonts/outfit-variable.woff2`), licence OFL. Vérifiée le 30/08/2026.
- **Display** : Playfair Display (variable 400–700 + italique) — droit d'apparaître
  UNIQUEMENT : titres de sections (h2/h3/h4 de la carte), sous-titre du hero (italique),
  liens du menu mobile plein écran. Jamais dans le corps, jamais sur un bouton.
  Auto-hébergée, licence OFL.
- Tailles : corps `text-base`+, descriptions de plats `text-sm`, `text-xs` réservé aux
  mentions très secondaires (appellations viticoles, encarts suppléments, légal).
- Grands titres : `text-4xl → text-6xl` responsifs, letter-spacing négatif (-2px).

## 3. Matière

- **Rayons** : cartes/encarts `rounded-2xl` (16px), petits encarts `rounded-xl` (12px),
  boutons et pills `rounded-full`.
- **Ombres** : aucune. L'élévation se fait par bordures crème translucides
  (`border-creme/5` à `/25`) et fonds `bg-creme/[0.03–0.06]`.
- **Espacements** : sections `py-24 md:py-32 lg:py-40`, items de carte `py-5`.
- **Grain** : bruit SVG plein écran, opacité 0.018 — la matière papier du site.

## 4. Animation

- **Tempo général** : lent et feutré — reveals 0.8–0.9s `power2/power3.out`,
  transitions UI 0.3s, accordions 0.5s `cubic-bezier(0.22,1,0.36,1)`.
- **Au scroll (GSAP + Lenis)** : reveal fade + translateY(40px) par élément (start 88%),
  parallaxe/fondu du contenu hero, progress bar scrubbée, nav qui prend son dégradé
  après le hero.
- **Ne bouge jamais** : les prix, le contenu des accordions une fois ouverts, le footer.
- **Effet signature du site** : le **double marquee photos** — deux rangées de la galerie
  qui défilent en boucle infinie en sens opposés (90 s / 100 s), pause au survol, fondu
  latéral en masque. Un seul effet signature ; ne pas en ajouter d'autre.
- **UI d'état (Motion)** : sans objet (site statique, pas de React).
- **Harnais** : pas de WebGL. Vidéo hero coupée hors viewport (IntersectionObserver)
  et figée en `prefers-reduced-motion` ; tous les tweens GSAP et Lenis désactivés en
  `prefers-reduced-motion` (fallback natif).

## 5. Interdits de ce projet

- **Un seul sol** : le fond vert est continu du hero au footer — jamais d'alternance de
  fonds de section. Les ruptures sont des filets crème (`section-divider`) et des titres.
  (Choix assumé, dérogatoire à la règle studio d'alternance des fonds.)
- Le crème n'apparaît en aplat que sur une action (CTA, pill active, bandeau d'annonce).
- Aucune ombre portée, aucun dégradé décoratif saturé (seuls des dégradés du vert vers
  lui-même, quasi imperceptibles).
- Le rouge du logo ne sert jamais de décoration.
- Pas de photos en dur dans les sections hors galerie/esprit — la vidéo et le marquee
  portent l'image du lieu.
- Toujours : pas d'esthétique template gratuit, un seul moteur d'animation par élément.

---
*Validé par Benjamin le : [à valider — rétro-formalisation du 30/08/2026]*

var Paper34FX=(()=>{var z=Object.defineProperty;var Fe=Object.getOwnPropertyDescriptor;var _e=Object.getOwnPropertyNames;var Ae=Object.prototype.hasOwnProperty;var Le=(m,h)=>{for(var D in h)z(m,D,{get:h[D],enumerable:!0})},Ue=(m,h,D,w)=>{if(h&&typeof h=="object"||typeof h=="function")for(let L of _e(h))!Ae.call(m,L)&&L!==D&&z(m,L,{get:()=>h[L],enumerable:!(w=Fe(h,L))||w.enumerable});return m};var Be=m=>Ue(z({},"__esModule",{value:!0}),m);var Pe={};Le(Pe,{createSplashCursor:()=>we});function we(m,h={}){const{colors:D,densityDissipation:w=3.5,velocityDissipation:L=2,pressure:Q=.1,curl:Z=3,splatRadius:ee=.2,splatForce:te=6e3,hover:re=!0}=h;let P=!0;const v=document.createElement("canvas");v.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;",m.appendChild(v);const p={SIM_RESOLUTION:128,DYE_RESOLUTION:1024,DENSITY_DISSIPATION:w,VELOCITY_DISSIPATION:L,PRESSURE:Q,PRESSURE_ITERATIONS:20,CURL:Z,SPLAT_RADIUS:ee,SPLAT_FORCE:te,SHADING:!0,COLOR_UPDATE_SPEED:10},U=D&&D.length>0?D:[{r:0,g:.45,b:.9},{r:.1,g:.6,b:1},{r:.6,g:.4,b:1},{r:0,g:.3,b:.7}],B=[{id:-1,texcoordX:0,texcoordY:0,prevTexcoordX:0,prevTexcoordY:0,deltaX:0,deltaY:0,down:!1,moved:!1,color:U[0]}];function ie(t){const r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1};let i=t.getContext("webgl2",r);const o=!!i;if(o||(i=t.getContext("webgl",r)||t.getContext("experimental-webgl",r)),!i)return null;let n=null,s=null;o?(i.getExtension("EXT_color_buffer_float"),s=i.getExtension("OES_texture_float_linear")):(n=i.getExtension("OES_texture_half_float"),s=i.getExtension("OES_texture_half_float_linear")),i.clearColor(0,0,0,0);const c=o?i.HALF_FLOAT:n==null?void 0:n.HALF_FLOAT_OES;let d,f,A;if(o){const x=i;d=F(x,x.RGBA16F,x.RGBA,c),f=F(x,x.RG16F,x.RG,c),A=F(x,x.R16F,x.RED,c)}else d=F(i,i.RGBA,i.RGBA,c),f=F(i,i.RGBA,i.RGBA,c),A=F(i,i.RGBA,i.RGBA,c);return{gl:i,ext:{formatRGBA:d,formatRG:f,formatR:A,halfFloatTexType:c,supportLinearFiltering:s}}}function F(t,r,i,o){if(!oe(t,r,i,o)){const n=t;switch(r){case n.R16F:return F(t,n.RG16F,n.RG,o);case n.RG16F:return F(t,n.RGBA16F,n.RGBA,o);default:return null}}return{internalFormat:r,format:i}}function oe(t,r,i,o){const n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,r,4,4,0,i,o,null);const s=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,s),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,n,0),t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE}const N=ie(v);if(!N)return;const{gl:e,ext:y}=N,Ce="HALF_FLOAT"in e;function g(t,r,i=""){const o=i+r,n=e.createShader(t);return e.shaderSource(n,o),e.compileShader(n),e.getShaderParameter(n,e.COMPILE_STATUS)||console.warn(e.getShaderInfoLog(n)),n}function R(t,r){const i=e.createProgram();return e.attachShader(i,t),e.attachShader(i,r),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)||console.warn(e.getProgramInfoLog(i)),i}function E(t){const r={},i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;o++){const n=e.getActiveUniform(t,o);r[n.name]=e.getUniformLocation(t,n.name)}return r}const b=g(e.VERTEX_SHADER,`
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
      `),ne=g(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        gl_FragColor = texture2D(uTexture, vUv);
      }
      `),ae=g(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
      `),ue=g(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
      `),ce=g(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
      `),se=g(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      ${y.supportLinearFiltering?"":`
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      `}
      void main () {
      ${y.supportLinearFiltering?`
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        `:`
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
        `}
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
      `),le=g(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
      `),ve=g(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
      `),fe=g(e.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        velocity = min(max(velocity, -1000.0), 1000.0);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
      `),me=g(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
      `),de=g(e.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
      `),l={copy:R(b,ne),clear:R(b,ae),display:R(b,ue),splat:R(b,ce),advection:R(b,se),divergence:R(b,le),curl:R(b,ve),vorticity:R(b,fe),pressure:R(b,me),gradientSubtract:R(b,de)},a={copy:E(l.copy),clear:E(l.clear),display:E(l.display),splat:E(l.splat),advection:E(l.advection),divergence:E(l.divergence),curl:E(l.curl),vorticity:E(l.vorticity),pressure:E(l.pressure),gradientSubtract:E(l.gradientSubtract)},xe=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,xe),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),e.STATIC_DRAW);const he=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,he),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),e.STATIC_DRAW),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.enableVertexAttribArray(0);function T(t){t===null?(e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.bindFramebuffer(e.FRAMEBUFFER,null)):(e.viewport(0,0,t.width,t.height),e.bindFramebuffer(e.FRAMEBUFFER,t.fbo)),e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0)}function C(t,r,i,o,n,s){e.activeTexture(e.TEXTURE0);const c=e.createTexture();e.bindTexture(e.TEXTURE_2D,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,s),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,i,t,r,0,o,n,null);const d=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,d),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,c,0),e.viewport(0,0,t,r),e.clear(e.COLOR_BUFFER_BIT);const f=1/t,A=1/r;return{texture:c,fbo:d,width:t,height:r,texelSizeX:f,texelSizeY:A,attach(x){return e.activeTexture(e.TEXTURE0+x),e.bindTexture(e.TEXTURE_2D,c),x}}}function X(t,r,i,o,n,s){let c=C(t,r,i,o,n,s),d=C(t,r,i,o,n,s);return{width:t,height:r,texelSizeX:1/t,texelSizeY:1/r,get read(){return c},set read(f){c=f},get write(){return d},set write(f){d=f},swap(){const f=c;c=d,d=f}}}function Y(t){let r=e.drawingBufferWidth/e.drawingBufferHeight;r<1&&(r=1/r);const i=Math.round(t),o=Math.round(t*r);return e.drawingBufferWidth>e.drawingBufferHeight?{width:o,height:i}:{width:i,height:o}}let S,u,G,I,_;function W(){const t=Y(p.SIM_RESOLUTION),r=Y(p.DYE_RESOLUTION),i=y.halfFloatTexType,o=y.formatRGBA,n=y.formatRG,s=y.formatR,c=y.supportLinearFiltering?e.LINEAR:e.NEAREST;e.disable(e.BLEND),S=X(r.width,r.height,o.internalFormat,o.format,i,c),u=X(t.width,t.height,n.internalFormat,n.format,i,c),G=C(t.width,t.height,s.internalFormat,s.format,i,e.NEAREST),I=C(t.width,t.height,s.internalFormat,s.format,i,e.NEAREST),_=X(t.width,t.height,s.internalFormat,s.format,i,e.NEAREST)}function V(){const t=window.devicePixelRatio||1,r=m.clientWidth,i=m.clientHeight,o=Math.floor(r*t),n=Math.floor(i*t);return v.width!==o||v.height!==n?(v.width=o,v.height=n,!0):!1}V(),W();function H(t,r,i,o,n){e.useProgram(l.splat),e.uniform1i(a.splat.uTarget,u.read.attach(0)),e.uniform1f(a.splat.aspectRatio,v.width/v.height),e.uniform2f(a.splat.point,t,r),e.uniform3f(a.splat.color,i,o,0),e.uniform1f(a.splat.radius,pe(p.SPLAT_RADIUS/100)),T(u.write),u.swap(),e.uniform1i(a.splat.uTarget,S.read.attach(0)),e.uniform3f(a.splat.color,n.r,n.g,n.b),T(S.write),S.swap()}function pe(t){const r=v.width/v.height;return r>1&&(t*=r),t}function ge(t){const r=t.deltaX*p.SPLAT_FORCE,i=t.deltaY*p.SPLAT_FORCE;H(t.texcoordX,t.texcoordY,r,i,t.color)}function Te(){B.forEach(t=>{t.moved&&(t.moved=!1,ge(t))})}function Re(t){e.disable(e.BLEND),e.useProgram(l.curl),e.uniform2f(a.curl.texelSize,u.texelSizeX,u.texelSizeY),e.uniform1i(a.curl.uVelocity,u.read.attach(0)),T(I),e.useProgram(l.vorticity),e.uniform2f(a.vorticity.texelSize,u.texelSizeX,u.texelSizeY),e.uniform1i(a.vorticity.uVelocity,u.read.attach(0)),e.uniform1i(a.vorticity.uCurl,I.attach(1)),e.uniform1f(a.vorticity.curl,p.CURL),e.uniform1f(a.vorticity.dt,t),T(u.write),u.swap(),e.useProgram(l.divergence),e.uniform2f(a.divergence.texelSize,u.texelSizeX,u.texelSizeY),e.uniform1i(a.divergence.uVelocity,u.read.attach(0)),T(G),e.useProgram(l.clear),e.uniform1i(a.clear.uTexture,_.read.attach(0)),e.uniform1f(a.clear.value,p.PRESSURE),T(_.write),_.swap(),e.useProgram(l.pressure),e.uniform2f(a.pressure.texelSize,u.texelSizeX,u.texelSizeY),e.uniform1i(a.pressure.uDivergence,G.attach(0));for(let i=0;i<p.PRESSURE_ITERATIONS;i++)e.uniform1i(a.pressure.uPressure,_.read.attach(1)),T(_.write),_.swap();e.useProgram(l.gradientSubtract),e.uniform2f(a.gradientSubtract.texelSize,u.texelSizeX,u.texelSizeY),e.uniform1i(a.gradientSubtract.uPressure,_.read.attach(0)),e.uniform1i(a.gradientSubtract.uVelocity,u.read.attach(1)),T(u.write),u.swap(),e.useProgram(l.advection),e.uniform2f(a.advection.texelSize,u.texelSizeX,u.texelSizeY),y.supportLinearFiltering||e.uniform2f(a.advection.dyeTexelSize,u.texelSizeX,u.texelSizeY);const r=u.read.attach(0);e.uniform1i(a.advection.uVelocity,r),e.uniform1i(a.advection.uSource,r),e.uniform1f(a.advection.dt,t),e.uniform1f(a.advection.dissipation,p.VELOCITY_DISSIPATION),T(u.write),u.swap(),y.supportLinearFiltering||e.uniform2f(a.advection.dyeTexelSize,S.texelSizeX,S.texelSizeY),e.uniform1i(a.advection.uVelocity,u.read.attach(0)),e.uniform1i(a.advection.uSource,S.read.attach(1)),e.uniform1f(a.advection.dissipation,p.DENSITY_DISSIPATION),T(S.write),S.swap()}function Ee(){e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.useProgram(l.display),e.uniform1i(a.display.uTexture,S.read.attach(0)),T(null)}let k=performance.now(),$=0;function q(){const t=performance.now();let r=(t-k)/1e3;r=Math.min(r,.016666),k=t,V()&&W(),Te(),Re(r),Ee(),$=requestAnimationFrame(q)}q();function O(){const t=U[Math.floor(Math.random()*U.length)];return{r:t.r*.15,g:t.g*.15,b:t.b*.15}}function M(t,r,i){const o=m.getBoundingClientRect();t.prevTexcoordX=t.texcoordX,t.prevTexcoordY=t.texcoordY,t.texcoordX=(r-o.left)/o.width,t.texcoordY=1-(i-o.top)/o.height,t.deltaX=be(t.texcoordX-t.prevTexcoordX),t.deltaY=Se(t.texcoordY-t.prevTexcoordY),t.moved=Math.abs(t.deltaX)>0||Math.abs(t.deltaY)>0}function be(t){const r=v.width/v.height;return r<1&&(t*=r),t}function Se(t){const r=v.width/v.height;return r>1&&(t/=r),t}const K=t=>{if(P!==!1)if(re){const r=B[0];(!r.color||r.color===U[0])&&(r.color=O()),M(r,t.clientX,t.clientY)}else{const r=B[0];if(!r.down)return;M(r,t.clientX,t.clientY)}},j=t=>{if(P===!1)return;const r=t.touches[0];if(!r)return;const i=B[0];(!i.color||i.color===U[0])&&(i.color=O()),M(i,r.clientX,r.clientY)},J=t=>{if(P===!1)return;const r=t.touches[0];if(!r)return;const i=B[0];i.color=O();const o=m.getBoundingClientRect();i.texcoordX=(r.clientX-o.left)/o.width,i.texcoordY=1-(r.clientY-o.top)/o.height,i.prevTexcoordX=i.texcoordX,i.prevTexcoordY=i.texcoordY};window.addEventListener("mousemove",K),window.addEventListener("touchmove",j,{passive:!0}),window.addEventListener("touchstart",J,{passive:!0});function ye(t,r,i=1){const o=m.getBoundingClientRect();if(o.width===0||o.height===0)return;const n=(t-o.left)/o.width,s=1-(r-o.top)/o.height,c=14,d=p.SPLAT_FORCE*.55*i;for(let f=0;f<c;f++){const A=f/c*Math.PI*2;H(n,s,Math.cos(A)*d,Math.sin(A)*d,O())}}function De(){cancelAnimationFrame($),window.removeEventListener("mousemove",K),window.removeEventListener("touchmove",j),window.removeEventListener("touchstart",J);const t=e.getExtension("WEBGL_lose_context");t&&t.loseContext(),v.parentNode&&v.parentNode.removeChild(v)}return{splashAt:ye,setEmitting:t=>{P=t},destroy:De}}return Be(Pe);})();

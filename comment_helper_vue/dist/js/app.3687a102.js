(function(){"use strict";var e={4282:function(e,t,n){var r=n(9242),o=n(3396),i=(0,o.aZ)({__name:"App",setup(e){const t=()=>{const e=document.documentElement;e.style.setProperty("--app-height",`${window.innerHeight}px`)};return window.addEventListener("resize",t),t(),(e,t)=>{const n=(0,o.up)("router-view");return(0,o.wg)(),(0,o.j4)(n)}}});const u=i;var a=u,c=n(2483);function s(e,t){const n=(0,o.up)("router-view");return(0,o.wg)(),(0,o.j4)(n)}var f=n(89);const l={},d=(0,f.Z)(l,[["render",s]]);var p=d;const h=[{path:"/",name:"Index",component:()=>n.e(576).then(n.bind(n,6607))},{path:"/:pathMatch(.*)*",name:"NotFound",component:p}],m=(0,c.p7)({history:(0,c.PO)("/comment_helper/"),routes:h});var v=m,g=n(630),b=n(9600);const y=(0,r.ri)(a);(0,g.z)(y),y.use(v),y.provide("http",b.Z),y.mount("#app")},630:function(e,t,n){n.d(t,{z:function(){return i}});var r=n(1857);const o=(0,r.WB)();function i(e){e.use(o)}},9600:function(e,t,n){var r=n(6265),o=n.n(r);const i=o().create({baseURL:{VUE_APP_ENV:"production",VUE_APP_BASE_URL:"/",VUE_APP_APPID:"1494465264176752",NODE_ENV:"production",BASE_URL:"/comment_helper/"}.VUE_APP_API_URL,headers:{"Content-type":"application/json"}});function u(e,t={}){return new Promise(((n,r)=>{i.get(e,{params:t}).then((e=>{n(e.data)})).catch((e=>{r(e)}))}))}function a(e,t={}){return new Promise(((n,r)=>{i.post(e,t).then((e=>{n(e.data)}),(e=>{r(e)}))}))}function c(e,t={}){return new Promise(((n,r)=>{i.put(e,t).then((e=>{n(e.data)}),(e=>{r(e)}))}))}i.interceptors.request.use((e=>{const t=localStorage.getItem("token");return e.headers.Authorization=`Bearer ${t}`,e}),(e=>Promise.reject(e))),i.interceptors.response.use((e=>{switch(e.status){case 200:return Promise.resolve(e);default:console.log(e.status)}}),(e=>{if(e&&e.response)switch(e.response.status){case 400:console.error(e.response),alert(JSON.stringify(e.response.data.errors));break;case 401:console.error(e);break;default:return console.error("攔截錯誤請求",e.response.status),Promise.reject(e)}}));const s={get:e=>u(e.url,e.params),post:e=>a(e.url,e.params),put:e=>c(e.url,e.params)};t["Z"]=s}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={id:r,loaded:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}n.m=e,function(){var e=[];n.O=function(t,r,o,i){if(!r){var u=1/0;for(f=0;f<e.length;f++){r=e[f][0],o=e[f][1],i=e[f][2];for(var a=!0,c=0;c<r.length;c++)(!1&i||u>=i)&&Object.keys(n.O).every((function(e){return n.O[e](r[c])}))?r.splice(c--,1):(a=!1,i<u&&(u=i));if(a){e.splice(f--,1);var s=o();void 0!==s&&(t=s)}}return t}i=i||0;for(var f=e.length;f>0&&e[f-1][2]>i;f--)e[f]=e[f-1];e[f]=[r,o,i]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,r){return n.f[r](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/live.4261e308.js"}}(),function(){n.miniCssF=function(e){return"css/live.bd7e91fc.css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="vite-webpack-ts:";n.l=function(r,o,i,u){if(e[r])e[r].push(o);else{var a,c;if(void 0!==i)for(var s=document.getElementsByTagName("script"),f=0;f<s.length;f++){var l=s[f];if(l.getAttribute("src")==r||l.getAttribute("data-webpack")==t+i){a=l;break}}a||(c=!0,a=document.createElement("script"),a.charset="utf-8",a.timeout=120,n.nc&&a.setAttribute("nonce",n.nc),a.setAttribute("data-webpack",t+i),a.src=r),e[r]=[o];var d=function(t,n){a.onerror=a.onload=null,clearTimeout(p);var o=e[r];if(delete e[r],a.parentNode&&a.parentNode.removeChild(a),o&&o.forEach((function(e){return e(n)})),t)return t(n)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=d.bind(null,a.onerror),a.onload=d.bind(null,a.onload),c&&document.head.appendChild(a)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){n.p="/comment_helper/"}(),function(){var e=function(e,t,n,r){var o=document.createElement("link");o.rel="stylesheet",o.type="text/css";var i=function(i){if(o.onerror=o.onload=null,"load"===i.type)n();else{var u=i&&("load"===i.type?"missing":i.type),a=i&&i.target&&i.target.href||t,c=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");c.code="CSS_CHUNK_LOAD_FAILED",c.type=u,c.request=a,o.parentNode.removeChild(o),r(c)}};return o.onerror=o.onload=i,o.href=t,document.head.appendChild(o),o},t=function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=n[r],i=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(i===e||i===t))return o}var u=document.getElementsByTagName("style");for(r=0;r<u.length;r++){o=u[r],i=o.getAttribute("data-href");if(i===e||i===t)return o}},r=function(r){return new Promise((function(o,i){var u=n.miniCssF(r),a=n.p+u;if(t(u,a))return o();e(r,a,o,i)}))},o={143:0};n.f.miniCss=function(e,t){var n={576:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=r(e).then((function(){o[e]=0}),(function(t){throw delete o[e],t})))}}(),function(){var e={143:0};n.f.j=function(t,r){var o=n.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else{var i=new Promise((function(n,r){o=e[t]=[n,r]}));r.push(o[2]=i);var u=n.p+n.u(t),a=new Error,c=function(r){if(n.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var i=r&&("load"===r.type?"missing":r.type),u=r&&r.target&&r.target.src;a.message="Loading chunk "+t+" failed.\n("+i+": "+u+")",a.name="ChunkLoadError",a.type=i,a.request=u,o[1](a)}};n.l(u,c,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o,i,u=r[0],a=r[1],c=r[2],s=0;if(u.some((function(t){return 0!==e[t]}))){for(o in a)n.o(a,o)&&(n.m[o]=a[o]);if(c)var f=c(n)}for(t&&t(r);s<u.length;s++)i=u[s],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(f)},r=self["webpackChunkvite_webpack_ts"]=self["webpackChunkvite_webpack_ts"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(4282)}));r=n.O(r)})();
//# sourceMappingURL=app.3687a102.js.map
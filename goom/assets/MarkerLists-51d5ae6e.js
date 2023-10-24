import{r as p,b as j,j as e,d as g,c as y,e as M}from"./index-c41bd997.js";import{F as N,M as k,a as F}from"./MarkerHeader-8f892ecb.js";import{u as D,b as L,c as S}from"./index.esm-59e8243b.js";import{B as w}from"./index-24599694.js";import{D as v,a as f,b as C,c as b,d as E,I as z,e as B}from"./MapUploader-52825a2b.js";import{b as H}from"./utils-9cc37e62.js";import{u as T}from"./useLocalStorageState-97738e33.js";import"./index.esm-bd80ea48.js";import"./iconBase-41eeea96.js";import"./index.esm-8d8b5a29.js";const _="_layer_1014l_1",A={layer:_};function I({layerName:a,layerId:t}){const[m,c]=p.useState(""),{mymaps:s,defaultMap:o}=j(n=>n.maps),d=D(),i=H(o),u=()=>{const n=i.data.find(l=>l.id===t);n.name=m;const r=s.map(l=>l.id===o.id?i:l);d(g(r)),d(y(i))},x=()=>{i.data=i.data.filter(r=>r.id!==t);const n=s.map(r=>r.id===o.id?i:r);d(g(n)),d(y(i))};return e.jsxs(v,{children:[e.jsx(f,{children:e.jsx(N,{size:24})}),e.jsxs(C,{className:"modalContent",children:[e.jsx(b,{children:e.jsx(E,{children:"編輯圖層"})}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-500 -mb-3",children:"圖層名稱"}),e.jsx(z,{id:"layerName",defaultValue:a,onChange:n=>c(n.target.value),className:"w-full"})]}),e.jsxs(B,{className:"w-full flex flex-row flex-nowrap items-center",children:[e.jsx(f,{asChild:!0,children:e.jsx(w,{className:"w-[90px] shrink-0 mr-8 text-red-700 hover:text-red-500",variant:"ghost",size:"sm",onClick:x,children:"刪除圖層"})}),e.jsx(f,{asChild:!0,children:e.jsx(w,{className:"grow shrink-0",type:"submit",onClick:u,children:"儲存"})})]})]})]})}function O({layerId:a,name:t,children:m}){const{isEditMode:c,defaultMap:s}=j(r=>r.maps),[o,d]=T([],"showedLayer"),[i,u]=p.useState(o.includes(a)),x=s.data.find(r=>r.id===a).markers.length||0,n=r=>{u(h=>!h);const l=JSON.parse(localStorage.getItem("showedLayer"));l.includes(a)?d(l.filter(h=>h!==a)):d([...l,a])};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:A.layer,children:[i===!0?e.jsx(L,{size:24,fill:"#73D0FA"}):e.jsx(S,{size:24,fill:"#73D0FA"}),e.jsx("p",{className:"grow",onClick:n,children:`${t} (${x})`}),c&&e.jsx(I,{layerId:a,layerName:t})]}),i===!0&&e.jsx("ul",{children:m})]})}function W(){const{defaultMap:a}=j(s=>s.maps),[t,m]=p.useState(a),c=M();return p.useEffect(()=>{m(a)},[a]),p.useEffect(()=>{a.data||c("/mapSelect")},[a,c]),e.jsx(e.Fragment,{children:t&&e.jsxs(e.Fragment,{children:[e.jsx(k,{name:t.name}),e.jsx("div",{style:{height:"100%",overflow:"auto",paddingTop:"3.5rem",paddingBottom:"4.5rem"},children:t.data&&t.data.map(s=>e.jsx(O,{name:s.name,layerId:s.id,mapId:t.id,children:s.markers.length>0&&s.markers.map(o=>e.jsx(F,{item:o,layerId:s.id},o.id))},s.id))})]})})}export{W as default};

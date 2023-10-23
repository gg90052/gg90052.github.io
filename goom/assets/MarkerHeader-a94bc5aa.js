import{j as e,r as h,b as k,d as g,c as N,f as C,e as S,g as w}from"./index-6c0598c9.js";import{F as D,a as E}from"./index.esm-01351097.js";import{M as I,a as L,b as z}from"./index.esm-4fa7f36f.js";import{s as G,b,d as H,c as T,e as B}from"./utils-b6f9727e.js";import{c as P,B as v}from"./index-5e941856.js";import{D as _,a as j,b as J,c as O,d as R,I as U,e as V,M as $}from"./MapUploader-bf923a7c.js";import{G as A}from"./iconBase-c6ff7d69.js";import{u as M,d as W,e as q}from"./index.esm-b4c6d15f.js";function K({description:s}){return e.jsx("div",{className:"p-4 min-h-[30px] whitespace-nowrap",dangerouslySetInnerHTML:{__html:s}})}function Q({iconId:s,src:n,size:l=24}){const d=JSON.parse(localStorage.getItem("icons"))||{},p=s?d[G(s)]:n||"defaultMarker.png";return e.jsx("div",{className:`w-[${l}] aspect-auto overflow-hidden`,children:e.jsx("img",{className:"w-full",src:p,alt:""})})}function X(s){return A({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}},{tag:"path",attr:{d:"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"}}]})(s)}const F=h.forwardRef(({className:s,...n},l)=>e.jsx("textarea",{className:P("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",s),ref:l,...n}));F.displayName="Textarea";function Y({marker:s,layerId:n}){const[l,d]=h.useState(s.name),[p,f]=h.useState(s.description),{mymaps:c,defaultMap:x}=k(i=>i.maps),t=M(),o=b(x),m=()=>{o.data.forEach(a=>{a.id===n&&a.markers.forEach(r=>{r.id===s.id&&(r.name=l,r.description=p)})});const i=c.map(a=>a.id===x.id?o:a);t(g(i)),t(N(o))},u=()=>{o.data.forEach(a=>{a.markers=a.markers.filter(r=>r.id!==s.id)});const i=c.map(a=>a.id===x.id?o:a);t(g(i)),t(N(o))};return e.jsxs(_,{children:[e.jsx(j,{children:e.jsx(X,{size:24})}),e.jsxs(J,{className:"modalContent moreUp",children:[e.jsx(O,{children:e.jsx(R,{children:"編輯標記"})}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-500 -mb-3",children:"地點名稱"}),e.jsx(U,{defaultValue:l,onChange:i=>d(i.target.value),className:"w-full mb-4"}),e.jsx("label",{className:"text-sm text-slate-500 -mb-3",children:"地點備註"}),e.jsx(F,{defaultValue:p,onChange:i=>f(i.target.value),className:"w-full h-24"})]}),e.jsxs(V,{className:"w-full flex flex-row flex-nowrap items-center",children:[e.jsx(j,{asChild:!0,children:e.jsx(v,{className:"w-[90px] shrink-0 mr-8 text-red-700 hover:text-red-500",variant:"ghost",size:"sm",onClick:u,children:"刪除標記"})}),e.jsx(j,{asChild:!0,children:e.jsx(v,{className:"grow shrink-0",type:"submit",onClick:m,children:"儲存"})})]})]})]})}function le({item:s,layerId:n,readonly:l=!1}){const[d,p]=h.useState(!1),f=H(s),c=T(s),x=M(),{favorites:t,isEditMode:o}=k(a=>a.maps),m=t.find(a=>a.id===s.id),u=a=>{p(r=>!r)},i=a=>{a.stopPropagation();let r="";m?r=t.filter(y=>y.id!==s.id):r=[...t,s],x(C(r)),localStorage.setItem("favorites",JSON.stringify(r))};return e.jsxs("li",{className:"list-none",children:[e.jsxs("div",{className:"min-h-[3rem] flex justify-between items-center px-2 py-2 border-b",children:[e.jsx("div",{className:"w-6 h-6 shrink-0 mr-2",onClick:i,children:m?e.jsx(I,{size:24,fill:"#f00"}):e.jsx(L,{size:24,fill:"#f00"})}),e.jsx("div",{className:"w-6 h-6 shrink-0 mr-2",children:e.jsx(Q,{iconId:s.icon})}),e.jsxs("p",{className:"text-md mr-4 grow",onClick:u,children:[s.name,s.description&&e.jsx(z,{className:`inline-block transition-transform ${d?"":"-rotate-90"}`,size:24})]}),e.jsx("div",{className:"flex shrink-0 justify-end mr-2 space-x-3",children:!l&&o?e.jsx(Y,{marker:s,layerId:n}):e.jsxs(e.Fragment,{children:[e.jsx("a",{href:f,className:"ml-2",target:"_blank",rel:"noreferrer",children:e.jsx(D,{size:24,fill:"#666"})}),e.jsx("a",{href:c,className:"ml-2",target:"_blank",rel:"noreferrer",children:e.jsx(E,{size:24,fill:"#666"})})]})})]}),s.description&&d&&e.jsx(K,{description:s.description})]})}function oe({name:s,addLayer:n=!0}){const{mymaps:l,defaultMap:d,isEditMode:p}=k(t=>t.maps),f=S(),c=M(),x=()=>{const t=b(d),o=B();t.data=[...t.data,o];const m=l.filter(u=>u.id!==d.id);c(g([...m,t])),c(N(t))};return e.jsx("header",{className:"h-14 flex px-4 items-center gap-4 justify-between bg-slate-100 fixed top-0 left-0 w-full z-40",children:n?e.jsxs(e.Fragment,{children:[e.jsxs(v,{variant:"outline",onClick:()=>f("/mapSelect"),children:[e.jsx(W,{className:"mr-2 h-4 w-4"}),s]}),e.jsx("div",{className:"flex",children:p?e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx($,{}),e.jsx(q,{onClick:x,size:24,fill:"#F1D272"}),e.jsx("p",{className:"text-blue-500",onClick:()=>c(w(!1)),children:"完成"})]}):e.jsx("p",{className:"text-blue-500",onClick:()=>c(w(!0)),children:"編輯"})})]}):e.jsx("p",{children:s})})}export{X as F,oe as M,le as a};

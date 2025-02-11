import{r as D,b as M,j as e,c as l}from"./index-7b68dda0.js";import{B as d}from"./supabaseClient-70d7a384.js";import{D as k,a as i,b as E,c as S,d as T,f as z,C as F,I as B,e as H}from"./ReadmeBtn-c6a0f065.js";import{F as I}from"./MarkerItem-32b6676b.js";import{u as m}from"./useLocalStorageState-f53ad56c.js";import{b as R}from"./utils-801818cf.js";import{u as V}from"./iconBase-f4ea7500.js";import{u as q}from"./useDispatch-abce09a0.js";import"./index.esm-b26da27d.js";import"./index.esm-4efc026b.js";import"./index.esm-95178a99.js";import"./index.esm-425945e5.js";import"./Icon-b82fb089.js";function $({open:p,layerName:u,layerId:t,className:f,onClose:r}){const{t:s}=V(),[h,x]=D.useState(""),{mymaps:y,showMapID:g}=M(a=>a.maps),j=y.find(a=>a.id===g),[N,w]=m("-1","defaultLayer"),[n,L]=m([],"showedLayer"),c=q(),o=R(j),b=()=>{const a=o.data.find(C=>C.id===t);a.name=h,c(l(o)),r()},v=()=>{o.data=o.data.filter(a=>a.id!==t),c(l(o)),t===N&&w("-1"),n.includes(t)&&L(n.filter(a=>a!==t)),r()};return e.jsxs(k,{open:p,children:[e.jsx(i,{children:e.jsx("div",{className:"w-6 h-6",children:e.jsx(I,{size:24,"data-cy":"triggerEditLayerModal",className:f})})}),e.jsxs(E,{className:"modalContent","data-cy":"editLayerModal","aria-describedby":void 0,children:[e.jsx(S,{children:e.jsx(T,{children:s("common.edit")+s("common.layer")})}),e.jsxs(z,{onClick:r,className:"absolute z-50 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[e.jsx(F,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Close"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-500 -mb-3",children:s("common.layer")+s("common.name")}),e.jsx(B,{id:"layerName","data-cy":"layerNameInput",defaultValue:u,onChange:a=>x(a.target.value),className:"w-full"})]}),e.jsxs(H,{className:"w-full flex flex-row flex-nowrap items-center",children:[e.jsx(i,{asChild:!0,children:e.jsx(d,{className:"w-[90px] shrink-0 mr-8 text-red-700 hover:text-red-500",variant:"ghost","data-cy":"deleteLayer",size:"sm",onClick:v,children:s("common.delete")+s("common.layer")})}),e.jsx(i,{asChild:!0,children:e.jsx(d,{className:"grow shrink-0","data-cy":"saveLayer",type:"submit",onClick:b,children:s("common.save")})})]})]})]})}export{$ as default};

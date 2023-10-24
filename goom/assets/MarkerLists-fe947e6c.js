import{r as x,b as h,j as e,d as M,c as N,e as k,f as y}from"./index-1657ebe9.js";import{F as C,M as L}from"./MarkerItem-c6759608.js";import{b as D,c as S,d as b,e as E}from"./index.esm-3aa1bde2.js";import{s as z}from"./MarkerLayer.module-d174b900.js";import{B as w}from"./index-07df55c6.js";import{D as B,a as g,b as H,c as I,d as R,e as T}from"./dialog-6ed33fca.js";import{I as A}from"./input-9ee12b4f.js";import{b as F,c as O}from"./utils-5a962f8c.js";import{u as v}from"./useDispatch-64a4e322.js";import{u as $}from"./useLocalStorageState-dc2a999b.js";import{M as J,R as P}from"./ReadmeBtn-d1f79dec.js";import"./index.esm-a864e17e.js";import"./iconBase-d18ce707.js";import"./index.esm-10ac20de.js";import"./index.esm-9e87fe6a.js";function U({layerName:a,layerId:t}){const[p,o]=x.useState(""),{mymaps:c,defaultMap:s}=h(n=>n.maps),r=v(),i=F(s),d=()=>{const n=i.data.find(m=>m.id===t);n.name=p;const l=c.map(m=>m.id===s.id?i:m);r(M(l)),r(N(i))},u=()=>{i.data=i.data.filter(l=>l.id!==t);const n=c.map(l=>l.id===s.id?i:l);r(M(n)),r(N(i))};return e.jsxs(B,{children:[e.jsx(g,{children:e.jsx(C,{size:24})}),e.jsxs(H,{className:"modalContent",children:[e.jsx(I,{children:e.jsx(R,{children:"編輯圖層"})}),e.jsxs("div",{children:[e.jsx("label",{className:"text-sm text-slate-500 -mb-3",children:"圖層名稱"}),e.jsx(A,{id:"layerName",defaultValue:a,onChange:n=>o(n.target.value),className:"w-full"})]}),e.jsxs(T,{className:"w-full flex flex-row flex-nowrap items-center",children:[e.jsx(g,{asChild:!0,children:e.jsx(w,{className:"w-[90px] shrink-0 mr-8 text-red-700 hover:text-red-500",variant:"ghost",size:"sm",onClick:u,children:"刪除圖層"})}),e.jsx(g,{asChild:!0,children:e.jsx(w,{className:"grow shrink-0",type:"submit",onClick:d,children:"儲存"})})]})]})]})}function V({layerId:a,name:t,children:p}){var l;const{isEditMode:o,defaultMap:c}=h(m=>m.maps),[s,r]=$([],"showedLayer"),[i,d]=x.useState(s.includes(a)),u=((l=c.data.find(m=>m.id===a))==null?void 0:l.markers.length)||0,n=m=>{d(j=>!j);const f=JSON.parse(localStorage.getItem("showedLayer"));f.includes(a)?r(f.filter(j=>j!==a)):r([...f,a])};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:z.layer,children:[i===!0?e.jsx(D,{size:24,fill:"#73D0FA"}):e.jsx(S,{size:24,fill:"#73D0FA"}),e.jsx("p",{className:"grow",onClick:n,children:`${t} (${u})`}),o&&e.jsx(U,{layerId:a,layerName:t})]}),i===!0&&e.jsx("ul",{children:p})]})}function q({name:a,addLayer:t=!0}){const{mymaps:p,defaultMap:o,isEditMode:c}=h(d=>d.maps),s=k(),r=v(),i=()=>{const d=F(o),u=O();d.data=[...d.data,u];const n=p.filter(l=>l.id!==o.id);r(M([...n,d])),r(N(d))};return e.jsx("header",{className:"h-14 flex px-4 items-center gap-4 justify-between bg-slate-100 fixed top-0 left-0 w-full z-40",children:t?e.jsxs(e.Fragment,{children:[e.jsxs(w,{variant:"outline",onClick:()=>s("/mapSelect"),children:[e.jsx(b,{className:"mr-2 h-4 w-4"}),a]}),e.jsx("div",{className:"flex",children:c?e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(J,{}),e.jsx(E,{onClick:i,size:24,fill:"#F1D272"}),e.jsx("p",{className:"text-blue-500",onClick:()=>r(y(!1)),children:"完成"})]}):e.jsx("p",{className:"text-blue-500",onClick:()=>r(y(!0)),children:"編輯"})})]}):e.jsx("p",{children:a})})}function le(){var c;const{defaultMap:a}=h(s=>s.maps),[t,p]=x.useState(a),o=k();return x.useEffect(()=>{p(a)},[a]),x.useEffect(()=>{a.data||o("/mapSelect")},[a,o]),e.jsxs(e.Fragment,{children:[e.jsx(q,{name:t.name}),((c=t==null?void 0:t.data)==null?void 0:c.length)>0?e.jsx(e.Fragment,{children:e.jsx("div",{style:{height:"100%",overflow:"auto",paddingTop:"3.5rem",paddingBottom:"4.5rem"},children:t.data&&t.data.map(s=>e.jsx(V,{name:s.name,layerId:s.id,mapId:t.id,children:s.markers.length>0&&s.markers.map(r=>e.jsx(L,{item:r,layerId:s.id},r.id))},s.id))})}):e.jsx("div",{className:"p-4 pt-16",children:e.jsx(P,{})})]})}export{le as default};

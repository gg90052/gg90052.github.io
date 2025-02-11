import{r as i,j as e,i as z,b as B,f as y,c as v,h as E}from"./index-7b68dda0.js";import{G as F,u as j}from"./iconBase-f4ea7500.js";import{e as P,f as H}from"./utils-801818cf.js";import{O as M,c as p,C as N,a as U,T as C,D,R as V,b as q,P as G,B as $,s as b}from"./supabaseClient-70d7a384.js";import{u as A}from"./useDispatch-abce09a0.js";import{a as K}from"./index.esm-b26da27d.js";function Q(a){return F({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"m12 18 4-5h-3V2h-2v11H8z"}},{tag:"path",attr:{d:"M19 9h-4v2h4v9H5v-9h4V9H5c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-9c0-1.103-.897-2-2-2z"}}]})(a)}function W(a,t){if(a==null)return{};var s={},n=Object.keys(a),o,r;for(r=0;r<n.length;r++)o=n[r],!(t.indexOf(o)>=0)&&(s[o]=a[o]);return s}var Z=["color"],J=i.forwardRef(function(a,t){var s=a.color,n=s===void 0?"currentColor":s,o=W(a,Z);return i.createElement("svg",Object.assign({width:"15",height:"15",viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg"},o,{ref:t}),i.createElement("path",{d:"M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",fill:n,fillRule:"evenodd",clipRule:"evenodd"}))});const X=V,pa=q,Y=G,ua=U,R=i.forwardRef(({className:a,...t},s)=>e.jsx(M,{ref:s,className:p("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...t}));R.displayName=M.displayName;const I=i.forwardRef(({className:a,children:t,...s},n)=>e.jsxs(Y,{children:[e.jsx(R,{}),e.jsxs(N,{ref:n,className:p("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",a),...s,children:[t,e.jsxs(U,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[e.jsx(J,{className:"h-4 w-4"}),e.jsx("span",{className:"sr-only",children:"Close"})]})]})]}));I.displayName=N.displayName;const O=({className:a,...t})=>e.jsx("div",{className:p("flex flex-col space-y-1.5 text-center sm:text-left",a),...t});O.displayName="DialogHeader";const L=({className:a,...t})=>e.jsx("div",{className:p("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...t});L.displayName="DialogFooter";const k=i.forwardRef(({className:a,...t},s)=>e.jsx(C,{ref:s,className:p("text-lg font-semibold leading-none tracking-tight",a),...t}));k.displayName=C.displayName;const aa=i.forwardRef(({className:a,...t},s)=>e.jsx(D,{ref:s,className:p("text-sm text-muted-foreground",a),...t}));aa.displayName=D.displayName;const S=i.forwardRef(({className:a,type:t,...s},n)=>e.jsx("input",{type:t,className:p("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",a),ref:n,...s}));S.displayName="Input";function ea({afterSave:a,setModalOpen:t}){const[s,n]=z(),[o,r]=i.useState(s.get("mid")||s.get("uuid")||""),[g]=i.useState(s.get("name")||""),{t:c}=j(),f=()=>{if(o===""){alert(c("mapUpload.emptyUrl"));return}else if((!o.includes("mid=")||!o.includes("google.com/maps/")||!o.includes("uuid="))&&o.includes("https://")){alert(c("mapUpload.urlError"));return}const d=o.indexOf("mid=")>0?o.indexOf("mid=")+4:0,x=o.indexOf("&",d)>0?o.indexOf("&",d):o.length,l=o.substring(d,x);r(""),t(!1),a(l,g),n({})};return e.jsx(e.Fragment,{children:e.jsxs(I,{className:"modalContent","data-cy":"importMapModal",onInteractOutside:d=>d.preventDefault(),"aria-describedby":void 0,children:[e.jsx(O,{children:e.jsx(k,{children:c("mapUpload.importMap")})}),e.jsxs(e.Fragment,{children:[e.jsx("a",{className:"text-blue-500",href:"https://gg90052.github.io/blog/goom/",target:"_blank",rel:"noreferrer",children:c("mapUpload.howto")}),e.jsx(S,{type:"text",placeholder:c("mapUpload.emptyUrl"),defaultValue:o,onChange:d=>r(d.target.value),"data-cy":"mapURL"})]}),e.jsx(L,{className:"sm:justify-between gap-2 sm:gap-0",children:e.jsx($,{type:"submit",onClick:f,"data-cy":"saveImportMap",children:c("mapUpload.importMap")})})]})})}async function ma(a,t){if(await _(a.uuid))return{isUpdate:!0,data:await sa(a)};{const n=await ta(a,t);return{isUpdate:!1,data:{uuid:n.id,name:n.map.name,data:n.map.data,id:n.map.id,owner:n.owner}}}}async function ta(a,t){const{data:s}=await b.from("custom_map").insert([{map:a,owner:t.id}]).select().single();return s}async function sa(a){const{data:t}=await b.from("custom_map").update({map:a}).eq("id",a.uuid).select().single();return t}async function _(a){if(!a)return null;let{data:t}=await b.from("custom_map").select("*").eq("id",a).single();return t}const oa=i.forwardRef(({type:a="import",importAsNewMap:t=!1,size:s=24},n)=>{const[o,r]=i.useState(!1),{mymaps:g,showMapID:c}=B(l=>l.maps),f=A(),d=y(),x=async(l,h)=>{let u;if(P(l)){const m=await _(l);u={...m.map,owner:m.owner,uuid:m.id}}else u=await H(l,h);if(t===!0)f(v(u)),f(E(u.id)),d("/");else{u.data.forEach(w=>{w.mid=l});const m=g.find(w=>w.id===c),T={...m,data:[...m.data,...u.data]};f(v(T))}};return e.jsxs("div",{className:a==="full"?"w-full h-full absolute":"",children:[a==="import"&&e.jsx(Q,{size:s,ref:n,onClick:()=>r(!0)}),a==="full"&&e.jsx("div",{className:"w-full h-full",ref:n,onClick:()=>r(!0)}),e.jsx(X,{open:o,onOpenChange:r,children:e.jsx(ea,{afterSave:(l,h)=>x(l,h),setModalOpen:r})})]})});oa.displayName="MapUploader";function fa(){const a=y(),{t}=j();return e.jsx("button",{className:"w-full h-12 border-2 border-blue-500 text-blue-500 mb-4",children:e.jsxs("div",{className:"flex justify-center relative",onClick:()=>a("/how-to-use"),children:[e.jsx(K,{size:24}),e.jsx("p",{className:"text-center ml-2",children:t("index.howtouse")})]})})}export{Q as B,J as C,X as D,S as I,oa as M,fa as R,pa as a,I as b,O as c,k as d,L as e,ua as f,ma as g,_ as s};

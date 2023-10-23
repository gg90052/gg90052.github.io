import{r as s,j as e,k as B}from"./index-4c075a41.js";import{i as H,j as D,d as z,_ as c,$ as F,k as _,l as G,a as I,m as L,n as V,e as q,b as v,g as J,h as K,f as Q,c as d,o as y}from"./index-f121b3b6.js";import{u as U}from"./useLocalStorageState-4ccd4d89.js";import{G as W}from"./iconBase-028412ba.js";import{g as X}from"./utils-43f99088.js";const Y="AlertDialog",[Z,ye]=H(Y,[D]),n=D(),ee=a=>{const{__scopeAlertDialog:t,...o}=a,r=n(t);return s.createElement(J,c({},r,o,{modal:!0}))},ae=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,...r}=a,l=n(o);return s.createElement(K,c({},l,r,{ref:t}))}),te=a=>{const{__scopeAlertDialog:t,...o}=a,r=n(t);return s.createElement(Q,c({},r,o))},oe=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,...r}=a,l=n(o);return s.createElement(F,c({},l,r,{ref:t}))}),R="AlertDialogContent",[se,re]=Z(R),le=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,children:r,...l}=a,i=n(o),f=s.useRef(null),O=_(t,f),A=s.useRef(null);return s.createElement(G,{contentName:R,titleName:ce,docsSlug:"alert-dialog"},s.createElement(se,{scope:o,cancelRef:A},s.createElement(I,c({role:"alertdialog"},i,l,{ref:O,onOpenAutoFocus:L(l.onOpenAutoFocus,p=>{var $;p.preventDefault(),($=A.current)===null||$===void 0||$.focus({preventScroll:!0})}),onPointerDownOutside:p=>p.preventDefault(),onInteractOutside:p=>p.preventDefault()}),s.createElement(V,null,r),!1)))}),ce="AlertDialogTitle",m=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,...r}=a,l=n(o);return s.createElement(z,c({},l,r,{ref:t}))}),ne=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,...r}=a,l=n(o);return s.createElement(q,c({},l,r,{ref:t}))}),de=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,...r}=a,l=n(o);return s.createElement(v,c({},l,r,{ref:t}))}),ie="AlertDialogCancel",fe=s.forwardRef((a,t)=>{const{__scopeAlertDialog:o,...r}=a,{cancelRef:l}=re(ie,o),i=n(o),f=_(t,l);return s.createElement(v,c({},i,r,{ref:f}))}),pe=ee,xe=ae,$e=te,E=oe,S=le,k=de,C=fe,M=m,P=ne;function x({name:a,value:t,link:o="",clickEvent:r,color:l}){const i=()=>{o&&window.open(o,"_blank","rel=noopener noreferrer"),r&&r()},f={red:"bg-[#F36166] text-white",purple:"bg-[#BB7BE4] text-white",green:"bg-[#51C861] text-white",blue:"bg-[#00B2F7] text-white"};return e.jsxs("div",{className:`h-24 rounded-2xl w-full flex flex-col-reverse justify-between items-start px-4 py-3 ${f[l]}`,onClick:i,children:[e.jsx("p",{children:a}),t&&e.jsx("p",{className:"text-lg self-center bg-[rgba(0,0,0,.3)] rounded-2xl px-3",children:t})]})}const j=pe,N=xe,me=$e,T=s.forwardRef(({className:a,...t},o)=>e.jsx(E,{className:d("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...t,ref:o}));T.displayName=E.displayName;const g=s.forwardRef(({className:a,...t},o)=>e.jsxs(me,{children:[e.jsx(T,{}),e.jsx(S,{ref:o,className:d("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",a),...t})]}));g.displayName=S.displayName;const b=({className:a,...t})=>e.jsx("div",{className:d("flex flex-col space-y-2 text-center sm:text-left",a),...t});b.displayName="AlertDialogHeader";const u=({className:a,...t})=>e.jsx("div",{className:d("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",a),...t});u.displayName="AlertDialogFooter";const ge=s.forwardRef(({className:a,...t},o)=>e.jsx(M,{ref:o,className:d("text-lg font-semibold",a),...t}));ge.displayName=M.displayName;const be=s.forwardRef(({className:a,...t},o)=>e.jsx(P,{ref:o,className:d("text-sm text-muted-foreground",a),...t}));be.displayName=P.displayName;const w=s.forwardRef(({className:a,...t},o)=>e.jsx(k,{ref:o,className:d(y(),a),...t}));w.displayName=k.displayName;const h=s.forwardRef(({className:a,...t},o)=>e.jsx(C,{ref:o,className:d(y({variant:"outline"}),"mt-2 sm:mt-0",a),...t}));h.displayName=C.displayName;function ue(a){return W({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M20.25 12a.75.75 0 01-.75.75H6.31l5.47 5.47a.75.75 0 11-1.06 1.06l-6.75-6.75a.75.75 0 010-1.06l6.75-6.75a.75.75 0 111.06 1.06l-5.47 5.47H19.5a.75.75 0 01.75.75z",clipRule:"evenodd"}}]})(a)}function we({showBack:a=!0}){return e.jsxs("div",{className:"w-full h-12 bg-slate-100 flex items-center justify-between p-4",children:[a?e.jsxs(B,{className:"text-blue-500 w-12 flex-shrink-0 whitespace-nowrap",to:"/setting",children:[e.jsx(ue,{size:24,color:"#3b82f6",className:"inline-block -mt-[3px]"})," ","設定"]}):e.jsx("div",{className:"w-12 flex-shrink-0"}),e.jsx("p",{className:"text-xl flex-grow text-center",children:"設定"}),e.jsx("div",{className:"w-12 flex-shrink-0"})]})}function he(){return s.useEffect(()=>{window.addAds()},[]),e.jsx("div",{className:"adsItem w-full p-8 h-[250px] bg-white",children:e.jsx("ins",{className:"adsbygoogle block","data-ad-client":"ca-pub-2578812574511816","data-ad-slot":"9476358781","data-ad-format":"auto","data-full-width-responsive":"true"})})}const Ae={google:"Google Map",apple:"Apple Map"};function Re(){const[a,t]=U("google","defaultApp"),o=s.useRef();async function r(l){try{await navigator.clipboard.writeText(l),alert(`已複製網址：
`+l+`
請直接至瀏覽器貼上使用`)}catch(i){console.error(i)}}return e.jsxs("div",{className:"w-full h-[100dvh]",children:[e.jsx(we,{showBack:!1}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 p-4",children:[e.jsx(x,{name:"操作教學",color:"blue",clickEvent:()=>{r("https://www.google.com/maps/d/")}}),e.jsxs(j,{children:[e.jsx(N,{children:e.jsx(x,{name:"地圖App",value:Ae[a],color:"purple"})}),e.jsxs(g,{className:"w-[80%] max-w-xs",children:[e.jsx(b,{children:e.jsx(m,{children:"選擇預設開啟的地圖 App"})}),e.jsxs("select",{ref:o,defaultValue:a,className:"border h-8 shadow-sm",children:[e.jsx("option",{value:"google",children:"Google Map"}),X()&&e.jsx("option",{value:"apple",children:"Apple Map"})]}),e.jsxs(u,{className:"flex flex-nowrap flex-row items-center justify-center",children:[e.jsx(h,{className:"mt-0 mr-2",children:"取消"}),e.jsx(w,{onClick:()=>{t(o.current.value)},children:"確定"})]})]})]}),e.jsx(x,{name:"複製 Google MyMap 網址",color:"green",clickEvent:()=>{r("https://www.google.com/maps/d/")}}),e.jsxs(j,{children:[e.jsx(N,{children:e.jsx(x,{name:"清除所有資料",color:"red"})}),e.jsxs(g,{className:"w-[60%]",children:[e.jsx(b,{children:e.jsx(m,{children:"是否清空所有本機資料？"})}),e.jsxs(u,{className:"flex flex-nowrap flex-row items-center justify-center",children:[e.jsx(h,{className:"mt-0 mr-2",children:"取消"}),e.jsx(w,{className:"text-red-500 border-none bg-transparent hover:bg-red-500 hover:text-white shadow-none",onClick:()=>{localStorage.clear(),window.location.reload()},children:"刪除"})]})]})]})]}),e.jsx(he,{})]})}export{Re as default};

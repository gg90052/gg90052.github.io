import{b as s,f as m,r as n,j as t}from"./index-f433997a.js";import{M as p}from"./MarkerItem-c1b8b39f.js";import{C as l}from"./CommonHeader-f6af52bc.js";import{u as f}from"./jszip.min-25157898.js";import"./index.esm-558cdf52.js";import"./index.esm-67d1cb07.js";import"./index.esm-2c713c8b.js";import"./utils-2d860b5a.js";import"./Icon-e13f9d7d.js";import"./button-c80087dc.js";import"./dialog-7aee5936.js";import"./input-938f7d21.js";import"./useDispatch-b8c750aa.js";import"./LogoIcon-41f98bcf.js";function F(){const{t:r}=f(),{favorites:a,defaultMap:o}=s(e=>e.maps),i=m();return n.useEffect(()=>{o.data||i("/mapSelect")},[o,i]),t.jsxs("div",{children:[t.jsx(l,{name:r("favorite.favorite"),fixed:!0}),a.length>0?t.jsx(t.Fragment,{children:t.jsx("div",{style:{height:"100%",overflow:"auto",paddingTop:"3.5rem",paddingBottom:"4.5rem"},children:a.map(e=>t.jsx(p,{item:e,readonly:!0},e.id))})}):t.jsx("div",{className:"w-full h-[100dvh] flex justify-center items-center flex-col relative",children:t.jsx("p",{className:"-mt-4 text-xl",children:r("favorite.noData")})})]})}export{F as default};

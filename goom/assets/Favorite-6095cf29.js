import{b as s,g as m,r as n,j as t}from"./index-39f272bc.js";import{M as p}from"./MarkerItem-a4952b08.js";import{C as l}from"./CommonHeader-da7b102e.js";import{u as d}from"./jszip.min-0cdc25e6.js";import"./index.esm-2239ff26.js";import"./index.esm-e8eb3cb1.js";import"./index.esm-c8e41c56.js";import"./utils-81600d0f.js";import"./Icon-9f2d27ef.js";import"./index-a3ebf8f6.js";import"./dialog-8968a5a2.js";import"./input-5b659442.js";import"./useDispatch-e6fe4a6e.js";import"./LogoIcon-a5f92d7d.js";function F(){const{t:r}=d(),{favorites:a,defaultMap:o}=s(e=>e.maps),i=m();return n.useEffect(()=>{o.data||i("/mapSelect")},[o,i]),t.jsxs("div",{children:[t.jsx(l,{name:r("favorite.favorite"),fixed:!0}),a.length>0?t.jsx(t.Fragment,{children:t.jsx("div",{style:{height:"100%",overflow:"auto",paddingTop:"3.5rem",paddingBottom:"4.5rem"},children:a.map(e=>t.jsx(p,{item:e,readonly:!0},e.id))})}):t.jsx("div",{className:"w-full h-[100dvh] flex justify-center items-center flex-col relative",children:t.jsx("p",{className:"-mt-4 text-xl",children:r("favorite.noData")})})]})}export{F as default};

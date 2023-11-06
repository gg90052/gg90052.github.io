import{j as s,r as i}from"./index-3d749199.js";import{s as c}from"./MarkerLayer.module-d174b900.js";import{b as m,c as n}from"./index.esm-0c034076.js";import{C as x}from"./CommonHeader-cae9d4bb.js";import{a as d,M as h,b as j}from"./index.esm-bdcca742.js";import{c as p,F as w}from"./index.esm-cd9b8d17.js";import"./iconBase-7949b42f.js";import"./LogoIcon-dac16378.js";function N(){return s.jsxs("div",{className:"p-4",children:[s.jsx("h1",{className:"text-2xl mb-2 text-slate-700",children:"如何下載地圖？"}),s.jsxs("p",{className:"my-2",children:["1. 打開"," ",s.jsx("a",{href:"https://www.google.com/maps/d/",target:"_blank",className:"text-blue-500",rel:"noreferrer",children:"Google 我的地圖"})," ","網站，找到你要匯入GOOM的地圖"]}),s.jsx("p",{className:"my-2",children:"2. 點擊『圖例』按鈕，打開圖例清單"}),s.jsx("div",{className:"w-full max-w-xs",children:s.jsx("img",{src:"howto/howToDownloadMap1.png",alt:""})}),s.jsx("p",{className:"my-2",children:"3. 點擊圖例清單上方的『分享』"}),s.jsx("div",{className:"w-full max-w-xs",children:s.jsx("img",{src:"howto/howToDownloadMap2.png",alt:""})}),s.jsx("p",{className:"my-2",children:"4. 將『知道這個連結的人都可以查看』勾選起來，接著就可以複製底下的地圖網址"}),s.jsx("div",{className:"w-full max-w-xs",children:s.jsx("img",{src:"howto/howToDownloadMap3.png",alt:""})}),s.jsx("p",{className:"my-2",children:"5. 回到GOOM，點擊下方清單按鈕，點擊『匯入地圖』，輸入剛剛複製好的網址以及地圖名稱，就可以匯入地圖了"}),s.jsx("div",{className:"w-full max-w-xs",children:s.jsx("img",{src:"howto/howToDownloadMap4.png",alt:""})})]})}function l({name:a,children:r,defaultOpen:t=!1}){const[e,o]=i.useState(t);return s.jsxs(s.Fragment,{children:[s.jsxs("div",{className:c.layer,children:[e===!0?s.jsx(m,{size:24,fill:"#73D0FA"}):s.jsx(n,{size:24,fill:"#73D0FA"}),s.jsx("p",{className:"grow",onClick:()=>o(!e),children:a})]}),e===!0&&s.jsx("ul",{children:r})]})}function f(){return s.jsxs("div",{className:"p-4",children:[s.jsx("h1",{className:"text-2xl mb-2 text-slate-700",children:"按鈕功能說明"}),s.jsx("p",{className:"my-2",children:"將KMZ檔匯入以後會出現類似下圖的地圖列表，介面會因為你的地圖設定稍有不同"}),s.jsx("div",{className:"w-full max-w-xs mx-auto",children:s.jsx("img",{src:"howto/howToUseBtn1.png",alt:""})}),s.jsx("div",{className:"mt-4 bg-slate-100",children:s.jsx("img",{src:"howto/howToUseBtn2.png",alt:""})}),s.jsx("p",{className:"my-2",children:"上方地圖名稱的按鈕，點擊後可以選擇其他地圖"}),s.jsxs("div",{className:"flex bg-slate-100 h-10 items-center pl-4",children:[s.jsx(d,{size:24,fill:"#f00"}),s.jsx(h,{size:24,fill:"#f00"})]}),s.jsx("p",{className:"my-2",children:"愛心按鈕：可以新增/取消該地點在我的最愛列表中"}),s.jsx("div",{className:"flex bg-slate-100 h-10 items-center pl-4",children:s.jsx(j,{className:"-rotate-90",size:24})}),s.jsx("p",{className:"my-2",children:"如果在該地點有輸入備註的話，地點名稱的右邊會出現指示的箭頭，點擊地點名稱可以顯示備註內容"}),s.jsx("div",{className:"flex bg-slate-100 h-10 items-center pl-4",children:s.jsx(p,{size:24,fill:"#666"})}),s.jsx("p",{className:"my-2",children:"搜尋地點按鈕：可直接開啟指定的地圖軟體並使用地點名稱進行搜尋"}),s.jsx("div",{className:"flex bg-slate-100 h-10 items-center pl-4",children:s.jsx(w,{size:24,fill:"#666"})}),s.jsx("p",{className:"my-2",children:"開啟座標按鈕：可直接開啟指定的地圖軟體並鎖定該地點的GPS座標"}),s.jsx("p",{className:"my-2 border-t pt-2",children:"兩個按鈕的差異在於，部分地點可能沒有google地標，或是地點名稱較為特殊，搜尋地點名稱可能會找不到，這時候就可以使用開啟座標按鈕"})]})}function u(){return s.jsxs("div",{className:"p-4",children:[s.jsx("h1",{className:"text-2xl mb-2 text-slate-700",children:"如何把網頁加入到主畫面？"}),s.jsx("p",{className:"my-2",children:"在 iOS 中，你可以將網頁加入到主畫面，就像是一般的 App 一樣，這樣你就可以直接點擊圖示開啟網頁，而不需要每次都要開啟瀏覽器再輸入網址"}),s.jsx("div",{className:"w-full max-w-xs mx-auto",children:s.jsx("video",{src:"howto/installPWA_ios.mp4",muted:!0,autoPlay:!0,controls:!0,playsInline:!0})})]})}function A(){return s.jsxs("div",{className:"pb-24",children:[s.jsx(x,{name:"操作說明"}),s.jsx(l,{name:"Q1. 按鈕功能說明？",children:s.jsx(f,{})}),s.jsx(l,{name:"Q2. 如何把網頁加入到主畫面？",children:s.jsx(u,{})}),s.jsx(l,{name:"Q3. 如何下載地圖？",defaultOpen:!0,children:s.jsx(N,{})})]})}export{A as default};

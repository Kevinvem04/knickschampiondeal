import{j as e,r as i}from"./index-VuZlPWkg.js";import{c as W,S as J,k as Q}from"./StripeEmbeddedCheckout-0ufgV4x_.js";const j="/assets/image_2-CDC3HTF9.png",X="/assets/image_2-CDC3HTF9.png",G="/assets/image_4-PJu3GNOD.png",V="/assets/image_10-ma1wCYBk.avif",Z="/assets/image_11-DO5zLF-f.avif",ee="/assets/image_12-BNsYYZj9.avif",ae="pk_live_51SKit9HRlwatDM20YlTlhHbFBRL4ib1Y0sgIlSiAcAUNgSfuxAyNmLBRNyl2B2mckZMc8yUEgzdQ8a0trtXiLcht00eC2Rpcua";function ne(){return ae.startsWith("pk_test_")?e.jsxs("div",{className:"w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800",children:["Todos os pagamentos no preview estão em modo de teste."," ",e.jsx("a",{href:"https://docs.lovable.dev/features/payments#test-and-live-environments",target:"_blank",rel:"noopener noreferrer",className:"underline font-medium",children:"Saiba mais"})]}):null}const ie="knicks_brunson_jersey_icon_one_time",u=[{id:"hoodie",n:"Knicks 2026 Champions Hoodie",p:89.9,img:V,priceId:"knicks_champions_hoodie_onetime"},{id:"snapback",n:"Knicks Finals Snapback Cap",p:39.9,img:Z,priceId:"knicks_finals_snapback_onetime"},{id:"tshirt",n:"Knicks Champions T-Shirt",p:34.9,img:ee,priceId:"knicks_champions_tshirt_onetime"},{id:"mvp",n:"Knicks NBA Finals MVP 2026 Shirt",p:44.9,img:W,priceId:"knicks_mvp_shirt_onetime"}],S=149.9,A=59.9,se=["S","M","L","XL","2XL","3XL"],I=[j,X,G,j],d=v=>`$${v.toFixed(2)}`;function ce(){const[v,N]=i.useState(0),[l,B]=i.useState(!1),[r,C]=i.useState(null),[s,w]=i.useState(1),[y,F]=i.useState(0),[O,D]=i.useState(!1),[R,L]=i.useState({details:!0,fit:!1,ship:!1}),[k,M]=i.useState(900),[T,_]=i.useState(!1),p=i.useRef(null),[x,z]=i.useState({x:50,y:50,on:!1}),[Y,h]=i.useState(!1),[o,P]=i.useState({}),b=s+Object.values(o).reduce((a,n)=>a+n,0),c=u.reduce((a,n)=>a+(o[n.id]||0)*n.p,0);i.useEffect(()=>{try{const a=localStorage.getItem("knicks_quiz_result");if(a){const n=JSON.parse(a);!(n.timestamp&&Date.now()-n.timestamp>900*1e3)&&n.discount&&N(Number(n.discount))}else{const n=parseFloat(localStorage.getItem("knicks_discount")||"0");n>0&&N(n)}}catch{}},[]),i.useEffect(()=>{const a=setInterval(()=>{M(n=>n<=1?(clearInterval(a),B(!0),0):n-1)},1e3);return()=>clearInterval(a)},[]),i.useEffect(()=>{const a=()=>{if(!p.current)return;const n=p.current.getBoundingClientRect();_(n.bottom<0)};return window.addEventListener("scroll",a),()=>window.removeEventListener("scroll",a)},[]);const t=A,K=S-A,q=String(Math.floor(k/60)).padStart(2,"0"),U=String(k%60).padStart(2,"0"),m=!!r&&!l,f=i.useMemo(()=>{const a=[{priceId:ie,quantity:s,size:r??void 0,name:"Knicks Jersey 2026",price:t}];for(const n of u){const g=o[n.id]||0;g>0&&a.push({priceId:n.priceId,quantity:g,name:n.n,price:n.p})}return a},[o,s,r,t]),$=i.useMemo(()=>JSON.stringify(f),[f]),E=()=>{m&&h(!0)},H=a=>{P(n=>({...n,[a]:n[a]?0:1}))};return e.jsxs("div",{className:"nba-page",children:[e.jsx("style",{children:te}),e.jsx(ne,{}),Y&&e.jsx("div",{onClick:()=>h(!1),style:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:9999,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"40px 16px",overflowY:"auto"},children:e.jsxs("div",{onClick:a=>a.stopPropagation(),style:{background:"#fff",borderRadius:12,maxWidth:720,width:"100%",padding:16,position:"relative"},children:[e.jsx("button",{onClick:()=>h(!1),style:{position:"absolute",top:12,right:12,background:"transparent",border:"none",fontSize:24,cursor:"pointer",color:"#333",zIndex:2},"aria-label":"Fechar",children:"×"}),e.jsx(J,{items:f,estimatedTotal:t*s+c},$)]})}),e.jsxs("header",{className:"nba-header",children:[e.jsx("div",{className:"nba-teamshop",children:e.jsxs("div",{className:"nba-teamshop-inner",children:[e.jsxs("div",{className:"nba-teamshop-left",children:[e.jsx("div",{className:"knicks-logo",children:e.jsx("img",{src:Q,alt:"New York Knicks"})}),e.jsx("span",{className:"ts-dot","aria-hidden":!0,children:"•"}),e.jsxs("div",{className:"teamshop-text",children:[e.jsx("div",{className:"ts-title",children:"TEAM SHOP"}),e.jsxs("div",{className:"ts-sub",children:["A ",e.jsx("span",{className:"fanatics",children:"≈ Fanatics"})," Experience"]})]})]}),e.jsx("div",{className:"nba-teamshop-center"}),e.jsxs("div",{className:"nba-teamshop-right",children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"28",height:"28",fill:"none",stroke:"currentColor",strokeWidth:"1.6","aria-hidden":!0,children:[e.jsx("circle",{cx:"12",cy:"8",r:"4"}),e.jsx("path",{d:"M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"})]}),e.jsxs("span",{className:"nba-cart","aria-label":`Cart with ${b} items`,children:[e.jsxs("svg",{viewBox:"0 0 24 24",width:"30",height:"30",fill:"none",stroke:"currentColor",strokeWidth:"1.6","aria-hidden":!0,children:[e.jsx("path",{d:"M3 5h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H7"}),e.jsx("circle",{cx:"10",cy:"22",r:"1.2"}),e.jsx("circle",{cx:"19",cy:"22",r:"1.2"})]}),e.jsx("span",{className:"nba-cart-badge",children:b})]})]})]})}),e.jsx("div",{className:"nba-orangenav",children:e.jsxs("div",{className:"nba-orangenav-inner",children:[e.jsx("a",{href:"#",children:"Men"}),e.jsx("a",{href:"#",children:"Women"}),e.jsx("a",{href:"#",children:"Kids"}),e.jsx("a",{href:"#",children:"More"}),e.jsx("span",{className:"search-ico","aria-hidden":!0,children:"🔍"})]})}),e.jsx("div",{className:"nba-quizstrip",children:"QUIZ DISCOUNT UNLOCKED"})]}),e.jsxs("div",{className:"nba-container",children:[e.jsxs("nav",{className:"nba-crumb","aria-label":"breadcrumb",children:[e.jsx("a",{href:"#",children:"Home"}),e.jsx("span",{children:"›"}),e.jsx("a",{href:"#",children:"New York Knicks"}),e.jsx("span",{children:"›"}),e.jsx("a",{href:"#",children:"Jerseys"}),e.jsx("span",{children:"›"}),e.jsx("span",{className:"current",children:"Brunson 2026 Finals Jersey"})]}),e.jsxs("div",{className:"nba-main",children:[e.jsxs("div",{className:"nba-gallery",children:[e.jsxs("div",{className:"nba-img-main",onMouseMove:a=>{const n=a.currentTarget.getBoundingClientRect();z({x:(a.clientX-n.left)/n.width*100,y:(a.clientY-n.top)/n.height*100,on:!0})},onMouseLeave:()=>z(a=>({...a,on:!1})),children:[e.jsx("span",{className:"nba-finals-badge",children:"NBA FINALS 2026 CHAMPION"}),e.jsx("img",{src:I[y],alt:"New York Knicks 2026 NBA Finals Jersey",className:"nba-img",style:x.on?{transform:"scale(1.8)",transformOrigin:`${x.x}% ${x.y}%`}:void 0})]}),e.jsx("div",{className:"nba-thumbs",children:I.map((a,n)=>e.jsx("button",{className:`nba-thumb ${y===n?"active":""}`,onClick:()=>F(n),"aria-label":`Image ${n+1}`,children:e.jsx("img",{src:a,alt:""})},n))})]}),e.jsxs("div",{className:"nba-panel",ref:p,children:[e.jsx("span",{className:"nba-edicao-badge",children:"🏆 COMMEMORATIVE EDITION — 2026 KNICKS CHAMPIONS"}),e.jsx("h1",{className:"nba-title",children:"UNISEX NEW YORK KNICKS JALEN BRUNSON NIKE BLUE 2026 NBA FINALS PATCH SWINGMAN JERSEY — ICON EDITION"}),e.jsxs("a",{href:"#reviews",className:"nba-rating",children:[e.jsx("span",{className:"stars",children:"★★★★★"})," 4.8 ",e.jsx("span",{className:"muted",children:"(1,247 reviews)"})]}),e.jsxs("div",{className:"nba-price-box",children:[e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"nba-price-row",children:[e.jsx("span",{className:"muted",children:"Original price:"}),e.jsx("span",{className:"strike",children:d(S)})]}),e.jsxs("div",{className:"nba-price-row",children:[e.jsx("span",{className:"muted",children:"Your quiz discount:"}),e.jsxs("span",{className:"green-bold",children:["-",d(K)]})]}),e.jsx("div",{className:"nba-price-divider"})]}),e.jsxs("div",{className:"nba-price-final-row",children:[e.jsx("span",{className:"label-final",children:"YOUR PRICE:"}),e.jsx("span",{className:"price-final",children:d(t)})]}),e.jsx("p",{className:"nba-quiz-note",children:"🏆 Discount earned in the Fan Quiz"})]}),e.jsxs("div",{className:"nba-section",children:[e.jsxs("div",{className:"nba-section-head",children:[e.jsx("span",{children:"SELECT SIZE:"}),e.jsx("a",{href:"#",className:"nba-size-guide",children:"Size Guide ↗"})]}),e.jsx("div",{className:"nba-sizes",children:se.map(a=>e.jsx("button",{className:`nba-size ${r===a?"selected":""}`,onClick:()=>C(a),children:a},a))})]}),r&&e.jsxs("div",{className:"nba-section",children:[e.jsx("div",{className:"nba-section-head",children:e.jsx("span",{children:"QUANTITY:"})}),e.jsxs("div",{className:"nba-qty",children:[e.jsx("button",{onClick:()=>w(a=>Math.max(1,a-1)),children:"−"}),e.jsx("span",{children:s}),e.jsx("button",{onClick:()=>w(a=>a+1),children:"+"})]})]}),e.jsx("button",{className:"nba-btn nba-btn-buy",disabled:!m,onClick:E,children:c>0?`BUY ALL — $${(t*s+c).toFixed(2)}`:"BUY NOW"}),e.jsx("div",{className:`nba-countdown ${l?"expired":""}`,children:l?e.jsxs("p",{children:["Offer expired — ",e.jsx("a",{href:"/",children:"retake the quiz"})," for a new discount"]}):e.jsxs(e.Fragment,{children:["⏱ Offer expires in: ",e.jsxs("strong",{children:["00h : ",q,"m : ",U,"s"]})]})}),e.jsxs("div",{className:"nba-wish",children:[e.jsxs("button",{onClick:()=>D(a=>!a),children:[O?"♥":"♡"," Add to wishlist"]}),e.jsx("button",{children:"↗ Share"})]}),e.jsxs("ul",{className:"nba-trust",children:[e.jsx("li",{children:"🚚 Free shipping on orders over $49,90"}),e.jsx("li",{children:"🔄 Free 30-day returns"}),e.jsx("li",{children:"🔒 100% secure payment"}),e.jsx("li",{children:"✅ Official NBA / Nike product"})]})]})]}),e.jsx("section",{className:"nba-accordions",children:[{id:"details",label:"Product details",body:["Official Nike Swingman Jersey","Embroidered 2026 NBA Finals commemorative patch","Dri-FIT technology for temperature control","100% recycled polyester","Champions patch on the right shoulder","Name and number in tackle twill","Imported"]},{id:"fit",label:"Size & fit",body:["Regular unisex fit","Reference: size M fits S to M","Check the size guide if in doubt"]},{id:"ship",label:"Shipping & returns",body:["Free shipping on orders over $49,90","Delivery in 3-5 business days","Free returns within 30 days","Official product — authenticity guaranteed"]}].map(a=>e.jsxs("div",{className:`nba-acc ${R[a.id]?"open":""}`,children:[e.jsxs("button",{className:"nba-acc-head",onClick:()=>L(n=>({...n,[a.id]:!n[a.id]})),children:[a.label,e.jsx("span",{className:"chev",children:"⌄"})]}),e.jsx("div",{className:"nba-acc-body",children:e.jsx("ul",{children:a.body.map(n=>e.jsx("li",{children:n},n))})})]},a.id))})]}),e.jsx("section",{id:"reviews",className:"nba-reviews",children:e.jsxs("div",{className:"nba-container",children:[e.jsxs("div",{className:"nba-reviews-head",children:[e.jsxs("div",{className:"nba-reviews-summary",children:[e.jsx("div",{className:"big",children:"4.8"}),e.jsx("div",{className:"stars",children:"★★★★★"}),e.jsx("div",{className:"muted",children:"out of 5 stars"}),e.jsx("div",{className:"muted",children:"1,247 reviews"})]}),e.jsx("div",{className:"nba-bars",children:[[5,76],[4,18],[3,4],[2,1],[1,1]].map(([a,n])=>e.jsxs("div",{className:"bar-row",children:[e.jsxs("span",{children:[a," stars"]}),e.jsx("div",{className:"bar",children:e.jsx("div",{style:{width:`${n}%`}})}),e.jsxs("span",{children:[n,"%"]})]},a))})]}),e.jsx("div",{className:"nba-review-cards",children:[{n:"Michael R.",c:"Brooklyn, NY",d:"2 days ago",t:"Incredible quality!",b:"Jersey arrived perfect, the championship patch looks amazing."},{n:"Sarah K.",c:"Manhattan, NY",d:"5 days ago",t:"Dream come true",b:"Waited so long for this title — the jersey lives up to the moment."},{n:"James L.",c:"Queens, NY",d:"1 week ago",t:"Excellent fabric",b:"Very lightweight, perfect fit. Highly recommend."}].map(a=>e.jsxs("article",{className:"nba-review",children:[e.jsx("div",{className:"stars",children:"★★★★★"}),e.jsxs("h3",{children:['"',a.t,'"']}),e.jsxs("div",{className:"meta",children:[a.n," · ",a.c," · ",a.d]}),e.jsxs("p",{children:['"',a.b,'"']}),e.jsx("div",{className:"verified",children:"✓ Verified purchase"})]},a.n))})]})}),e.jsx("section",{className:"nba-related",children:e.jsxs("div",{className:"nba-container",children:[e.jsx("h2",{children:"YOU MAY ALSO LIKE"}),e.jsx("p",{className:"nba-related-hint",children:"Add items to buy together in a single checkout"}),e.jsx("div",{className:"nba-related-grid",children:u.map(a=>{const n=(o[a.id]||0)>0;return e.jsxs("div",{className:`nba-related-card ${n?"selected":""}`,children:[e.jsx("div",{className:"img",children:e.jsx("img",{src:a.img,alt:a.n})}),e.jsx("div",{className:"name",children:a.n}),e.jsx("div",{className:"price",children:d(a.p)}),e.jsx("button",{className:n?"added":"",onClick:()=>H(a.id),children:n?"✓ Added":"Add to order"})]},a.id)})})]})}),e.jsx("footer",{className:"nba-footer",children:e.jsxs("div",{className:"nba-container",children:[e.jsxs("div",{className:"nba-footer-grid",children:[e.jsx("div",{className:"nba-footer-logo",children:"NBA"}),e.jsxs("div",{children:[e.jsx("h4",{children:"My Account"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Orders"}),e.jsx("li",{children:"Wishlist"}),e.jsx("li",{children:"Addresses"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"Help"}),e.jsxs("ul",{children:[e.jsx("li",{children:"FAQ"}),e.jsx("li",{children:"Returns"}),e.jsx("li",{children:"Contact"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{children:"About"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Partners"}),e.jsx("li",{children:"Policy"}),e.jsx("li",{children:"Privacy"})]})]})]}),e.jsx("div",{className:"nba-pay",children:"VISA · MASTERCARD · AMEX · PAYPAL · APPLE PAY"}),e.jsx("div",{className:"nba-copy",children:"© 2026 NBA Store · All rights reserved"})]})}),T&&e.jsxs("div",{className:"nba-sticky-bar",children:[e.jsx("div",{className:"img",children:e.jsx("img",{src:j,alt:""})}),e.jsxs("div",{className:"info",children:[e.jsxs("div",{className:"n",children:["KNICKS JERSEY 2026 ",c>0&&e.jsxs("span",{style:{color:"#F58426"},children:["+",b-s," items"]})]}),e.jsx("div",{className:"p",children:d(t*s+c)})]}),e.jsx("button",{disabled:!m,onClick:E,children:"BUY NOW"})]})]})}const te=`
.nba-page { font-family: 'Inter', sans-serif; color: #333; background: #fff; min-height: 100vh; }
.nba-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* HEADER */
.nba-header { position: sticky; top: 0; z-index: 1000; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }

/* Team shop bar */
.nba-teamshop { background: #1d428a; color: #fff; }
.nba-teamshop-inner { display: flex; align-items: center; padding: 14px 24px; max-width: 1280px; margin: 0 auto; gap: 16px; }
.nba-teamshop-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
.knicks-logo { width: 56px; height: 56px; display: grid; place-items: center; flex-shrink: 0; }
.knicks-logo img { width: 100%; height: 100%; object-fit: contain; }
.ts-dot { color: #fff; font-size: 22px; line-height: 1; opacity: 0.9; }
.teamshop-text .ts-title { font-family: 'Barlow Condensed', 'Oswald', sans-serif; font-style: italic; font-weight: 800; font-size: 28px; line-height: 1; letter-spacing: 1px; color: #fff; }
.teamshop-text .ts-sub { font-size: 11px; opacity: 0.95; margin-top: 4px; letter-spacing: 0.3px; }
.teamshop-text .ts-sub .fanatics { font-weight: 700; font-style: italic; }
.nba-teamshop-center { display: flex; align-items: center; gap: 10px; margin-left: 8px; }
.nba-teamshop-right { display: flex; gap: 18px; align-items: center; color: #fff; margin-left: auto; }
.nba-cart { position: relative; display: inline-flex; }
.nba-cart-badge { position: absolute; top: -4px; right: -8px; background: #F58426; color: #000; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 10px; min-width: 16px; text-align: center; }
@media (max-width: 768px) {
  .nba-teamshop-inner { padding: 10px 12px; gap: 8px; }
  .knicks-logo { width: 44px; height: 44px; }
  .teamshop-text .ts-title { font-size: 22px; }
  .nba-teamshop-center { gap: 6px; margin-left: 4px; }
  .nba-teamshop-right { gap: 12px; }
}


/* Orange nav */
.nba-orangenav { background: #F58426; }
.nba-orangenav-inner { max-width: 1280px; margin: 0 auto; padding: 6px 16px; display: flex; align-items: center; gap: 18px; }
.nba-orangenav a { color: #fff; font-weight: 700; font-size: 14px; text-decoration: none; text-transform: capitalize; }
.nba-orangenav a:hover { text-decoration: underline; }
.nba-orangenav .search-ico { margin-left: auto; color: #fff; font-size: 16px; }

/* Quiz unlock strip */
.nba-quizstrip { background: #1d428a; color: #fff; text-align: center; padding: 14px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }

@media (max-width: 768px) {
  .teamshop-text .ts-title { font-size: 18px; }
  .nba-orangenav-inner { gap: 20px; padding: 12px; }
  .nba-orangenav a { font-size: 16px; }
  .nba-quizstrip { font-size: 13px; padding: 12px; }
}

/* CRUMB */
.nba-crumb { display: flex; gap: 8px; align-items: center; padding: 12px 0; font-size: 12px; color: #767676; flex-wrap: wrap; }
.nba-crumb a { color: #767676; text-decoration: none; }
.nba-crumb a:hover { color: #006BB6; }
.nba-crumb span { color: #ccc; }
.nba-crumb .current { color: #333; }

/* MAIN */
.nba-main { display: grid; grid-template-columns: 55% 45%; gap: 40px; padding: 16px 0 48px; }
@media (max-width: 1024px) { .nba-main { grid-template-columns: 50% 50%; gap: 24px; } }
@media (max-width: 768px) { .nba-main { grid-template-columns: 1fr; } }

/* GALLERY */
.nba-img-main { position: relative; aspect-ratio: 4/5; background: #F5F5F5; overflow: hidden; cursor: zoom-in; }
.nba-img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.1s; padding: 16px; }
.nba-finals-badge { position: absolute; top: 16px; left: 16px; background: #006BB6; color: #fff; font-size: 11px; font-weight: 700; padding: 6px 10px; letter-spacing: 0.5px; z-index: 2; }
.nba-thumbs { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; }
.nba-thumb { width: 80px; height: 80px; min-width: 80px; background: #F5F5F5; border: 1px solid #E5E5E5; cursor: pointer; padding: 4px; }
.nba-thumb img { width: 100%; height: 100%; object-fit: contain; }
.nba-thumb.active { border: 2px solid #006BB6; }

/* PANEL */
.nba-panel { display: flex; flex-direction: column; gap: 18px; }
.nba-edicao-badge { background: #F58426; color: #000; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 6px 10px; border-radius: 2px; width: fit-content; letter-spacing: 0.4px; }
.nba-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-style: italic; font-size: 30px; color: #000; line-height: 1.1; text-transform: uppercase; margin: 0; }
.nba-rating { display: inline-flex; gap: 6px; align-items: center; font-size: 13px; color: #767676; text-decoration: none; }
.nba-rating .stars { color: #F58426; letter-spacing: 1px; }
.muted { color: #767676; }
.green-bold { color: #1DB954; font-weight: 700; font-size: 14px; }
.strike { text-decoration: line-through; color: #767676; font-size: 16px; }

/* PRICE */
.nba-price-box { background: #F0F7FF; border-left: 4px solid #F58426; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.nba-price-row { display: flex; justify-content: space-between; font-size: 14px; }
.nba-price-divider { height: 1px; background: #D0E0F0; margin: 6px 0; }
.nba-price-final-row { display: flex; justify-content: space-between; align-items: baseline; }
.label-final { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #333; letter-spacing: 0.5px; }
.price-final { color: #006BB6; font-size: 36px; font-weight: 700; }
.nba-quiz-note { color: #1DB954; font-size: 12px; font-weight: 600; margin: 4px 0 0; }

/* SECTIONS */
.nba-section { display: flex; flex-direction: column; gap: 10px; }
.nba-section-head { display: flex; justify-content: space-between; align-items: center; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #333; letter-spacing: 0.5px; }
.nba-size-guide { color: #006BB6; text-decoration: none; font-size: 12px; }
.nba-sizes { display: flex; gap: 8px; flex-wrap: wrap; }
.nba-size { width: 48px; height: 40px; border: 1px solid #D1D1D1; background: #fff; cursor: pointer; font-weight: 600; font-size: 13px; }
.nba-size:hover { border-color: #000; }
.nba-size.selected { border: 2px solid #000; background: #000; color: #fff; }
.nba-qty { display: inline-flex; border: 1px solid #D1D1D1; width: fit-content; }
.nba-qty button { width: 40px; height: 40px; background: #fff; border: none; cursor: pointer; font-size: 16px; }
.nba-qty span { width: 50px; height: 40px; display: grid; place-items: center; border-left: 1px solid #D1D1D1; border-right: 1px solid #D1D1D1; font-weight: 600; }

/* BTNS */
.nba-btn { width: 100%; height: 52px; border: none; cursor: pointer; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s; }
.nba-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.nba-btn-cart { background: #006BB6; color: #fff; }
.nba-btn-cart:not(:disabled):hover { background: #005a99; }
.nba-btn-cart.added { background: #1DB954; }
.nba-btn-buy { background: #000; color: #fff; }
.nba-btn-buy:not(:disabled):hover { background: #333; }

/* COUNTDOWN */
.nba-countdown { background: #FFF3CD; border: 1px solid #F58426; padding: 12px; font-size: 14px; color: #333; text-align: center; }
.nba-countdown.expired { background: #FBE5E5; border-color: #C0392B; color: #C0392B; }
.nba-countdown a { color: #006BB6; }

/* WISH */
.nba-wish { display: flex; gap: 16px; flex-wrap: wrap; }
.nba-wish button { background: none; border: none; color: #767676; font-size: 13px; cursor: pointer; }
.nba-wish button:hover { color: #000; }

/* TRUST */
.nba-trust { list-style: none; padding: 16px 0 0; margin: 0; border-top: 1px solid #E5E5E5; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #555; }

/* ACCORDIONS */
.nba-accordions { padding: 24px 0 48px; }
.nba-acc { border-top: 1px solid #E5E5E5; }
.nba-acc:last-child { border-bottom: 1px solid #E5E5E5; }
.nba-acc-head { width: 100%; background: none; border: none; padding: 18px 0; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; text-transform: uppercase; cursor: pointer; color: #000; }
.nba-acc-head .chev { transition: transform 0.25s; font-size: 18px; }
.nba-acc.open .nba-acc-head .chev { transform: rotate(180deg); }
.nba-acc-body { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
.nba-acc.open .nba-acc-body { max-height: 500px; }
.nba-acc-body ul { padding: 0 0 18px 20px; margin: 0; color: #333; font-size: 14px; line-height: 1.8; }

/* REVIEWS */
.nba-reviews { background: #F5F5F5; padding: 48px 0; }
.nba-reviews-head { display: grid; grid-template-columns: 280px 1fr; gap: 40px; margin-bottom: 32px; }
@media (max-width: 768px) { .nba-reviews-head { grid-template-columns: 1fr; } }
.nba-reviews-summary .big { font-size: 56px; font-weight: 700; line-height: 1; }
.nba-reviews-summary .stars { color: #F58426; font-size: 20px; margin: 6px 0; letter-spacing: 2px; }
.nba-bars { display: flex; flex-direction: column; gap: 6px; }
.bar-row { display: grid; grid-template-columns: 80px 1fr 40px; gap: 12px; align-items: center; font-size: 13px; }
.bar { background: #E5E5E5; height: 8px; }
.bar > div { background: #F58426; height: 100%; }
.nba-review-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) { .nba-review-cards { grid-template-columns: 1fr; } }
.nba-review { background: #fff; padding: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.nba-review .stars { color: #F58426; letter-spacing: 1px; }
.nba-review h3 { font-size: 15px; margin: 6px 0 4px; }
.nba-review .meta { font-size: 12px; color: #767676; margin-bottom: 8px; }
.nba-review p { font-size: 14px; color: #333; margin: 0 0 12px; }
.nba-review .verified { font-size: 12px; color: #1DB954; font-weight: 600; }

/* RELATED */
.nba-related { padding: 48px 0; }
.nba-related h2 { font-family: 'Barlow Condensed'; font-weight: 700; font-style: italic; font-size: 26px; text-transform: uppercase; margin: 0 0 20px; }
.nba-related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 768px) { .nba-related-grid { grid-template-columns: repeat(2, 1fr); } }
.nba-related-card { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.nba-related-card .img { aspect-ratio: 1; background: #F5F5F5; overflow: hidden; }
.nba-related-card .img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.2s; }
.nba-related-card:hover .img img { transform: scale(1.03); }
.nba-related-card .name { font-size: 13px; color: #333; }
.nba-related-card .price { font-weight: 700; color: #006BB6; }
.nba-related-card button { background: #000; color: #fff; border: none; padding: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
.nba-related-card.selected { outline: 2px solid #006BB6; }
.nba-related-card button.added { background: #1DB954; }
.nba-related-hint { color: #666; font-size: 13px; margin: -8px 0 16px; }

/* FOOTER */
.nba-footer { background: #1A1A1A; color: #fff; padding: 48px 0 24px; }
.nba-footer-grid { display: grid; grid-template-columns: 120px repeat(3, 1fr); gap: 32px; margin-bottom: 32px; }
@media (max-width: 768px) { .nba-footer-grid { grid-template-columns: 1fr 1fr; } }
.nba-footer-logo { font-family: 'Barlow Condensed'; font-weight: 800; font-style: italic; font-size: 32px; }
.nba-footer h4 { font-size: 13px; text-transform: uppercase; margin: 0 0 12px; }
.nba-footer ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.nba-footer ul li { font-size: 13px; color: #AAA; cursor: pointer; }
.nba-footer ul li:hover { color: #fff; }
.nba-pay { color: #AAA; font-size: 12px; padding: 16px 0; border-top: 1px solid #333; }
.nba-copy { color: #AAA; font-size: 12px; }

/* STICKY BAR */
.nba-sticky-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: #000; display: none; align-items: center; gap: 12px; padding: 0 12px; z-index: 999; }
@media (max-width: 768px) { .nba-sticky-bar { display: flex; } }
.nba-sticky-bar .img { width: 44px; height: 44px; background: #F5F5F5; overflow: hidden; }
.nba-sticky-bar .img img { width: 100%; height: 100%; object-fit: contain; }
.nba-sticky-bar .info { flex: 1; color: #fff; min-width: 0; }
.nba-sticky-bar .info .n { font-size: 12px; font-weight: 600; }
.nba-sticky-bar .info .p { font-size: 16px; color: #F58426; font-weight: 700; }
.nba-sticky-bar button { background: #006BB6; color: #fff; border: none; padding: 12px 16px; font-weight: 700; font-size: 12px; text-transform: uppercase; cursor: pointer; }
.nba-sticky-bar button:disabled { opacity: 0.5; }


`;export{ce as component};

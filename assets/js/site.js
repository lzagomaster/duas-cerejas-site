(()=>{"use strict";
document.addEventListener("visibilitychange",()=>{document.documentElement.toggleAttribute("data-hidden",document.hidden)});

const section=document.getElementById("inicio");
const hero=document.getElementById("hero-stage");
const stores=document.getElementById("lojas");
const menu=document.getElementById("cardapio-stage");
const menuFrame=document.getElementById("cardapio-frame");
if(!section||!hero||!stores||!menu)return;

const track=document.getElementById("stores-track");
const cards=track?[...track.querySelectorAll(".store-card")]:[];
const prevStore=document.getElementById("stores-prev");
const nextStore=document.getElementById("stores-next");
const pagination=document.getElementById("stores-pagination");
const motion=(window.DC_CONTENT&&DC_CONTENT.motion)||{};
const transitionMs=Math.max(320,Number(motion.stageTransitionMs)||460);
const wheelThreshold=Math.max(30,Number(motion.wheelThreshold)||56);
const swipeThreshold=Math.max(30,Number(motion.swipeThreshold)||46);
const stages=[{kind:"hero",hash:"#inicio"},{kind:"stores",hash:"#lojas"},{kind:"menu",hash:"#cardapio"}];

let current=location.hash==="#cardapio"?2:location.hash==="#lojas"?1:0;
let busy=false,unlockTimer=0,wheelAccum=0,wheelCommitted=false,wheelQuietTimer=0,touchStart=null;

const clampIndex=value=>Math.max(0,Math.min(stages.length-1,value));

function toggleLayer(el,show){
  el.classList.toggle("is-active",show);
  el.setAttribute("aria-hidden",show?"false":"true");
  if("inert" in el)el.inert=!show;
}
function emit(stage,index,initial){
  window.DC_STAGE_STATE={index,stage,total:stages.length};
  document.dispatchEvent(new CustomEvent("dc:stagechange",{detail:{...stage,index,total:stages.length,initial:!!initial}}));
}
function syncHash(stage){
  if(!history.replaceState)return;
  history.replaceState(null,"",stage.hash);
}
function ensureMenuLoaded(){
  if(!menuFrame||menuFrame.hasAttribute("src"))return;
  const source=menuFrame.dataset.src;
  if(source)menuFrame.setAttribute("src",source);
}
let storesMediaLoaded=false;
function ensureStoresLoaded(){
  if(storesMediaLoaded)return;
  storesMediaLoaded=true;
  if(typeof window.DC_LOAD_STORE_IMAGES==="function"){
    window.DC_LOAD_STORE_IMAGES();
    return;
  }
  const images=[...stores.querySelectorAll("img[data-src]")];
  images.forEach((img,index)=>{
    const source=img.dataset.src;
    if(!source)return;
    const reveal=()=>{img.classList.add("is-loaded");img.removeAttribute("data-src")};
    img.loading="eager";
    if(index===0)img.fetchPriority="high";
    img.addEventListener("load",reveal,{once:true});
    img.src=source;
    if(img.complete&&img.naturalWidth)reveal();
  });
}
function applyStage(index,{initial=false}={}){
  index=clampIndex(index);
  if(index===current&&!initial)return;
  current=index;
  const stage=stages[current];
  section.dataset.scene=stage.kind;
  section.dataset.stage=String(current);
  toggleLayer(hero,stage.kind==="hero");
  toggleLayer(stores,stage.kind==="stores");
  toggleLayer(menu,stage.kind==="menu");
  if(stage.kind==="stores")ensureStoresLoaded();
  if(stage.kind==="menu")ensureMenuLoaded();
  syncHash(stage);
  emit(stage,current,initial);

  clearTimeout(unlockTimer);
  if(initial){busy=false;return}
  busy=true;
  unlockTimer=setTimeout(()=>{busy=false},transitionMs);
}
function go(next){
  const target=clampIndex(next);
  if(target===current||busy)return false;
  applyStage(target);
  return true;
}
function next(){return go(current+1)}
function prev(){return go(current-1)}

function releaseWheelGesture(){wheelAccum=0;wheelCommitted=false}
addEventListener("wheel",event=>{
  if(event.ctrlKey)return;
  if(current===2)return;
  if(current===1&&track&&track.matches(":hover")&&Math.abs(event.deltaX)>0){return}
  if(Math.abs(event.deltaX)>Math.abs(event.deltaY))return;
  event.preventDefault();
  clearTimeout(wheelQuietTimer);
  wheelQuietTimer=setTimeout(releaseWheelGesture,190);
  if(wheelCommitted||busy)return;
  wheelAccum+=event.deltaY;
  if(Math.abs(wheelAccum)<wheelThreshold)return;
  wheelCommitted=true;
  const direction=wheelAccum>0?1:-1;
  wheelAccum=0;
  go(current+direction);
},{passive:false});

addEventListener("touchstart",event=>{
  if(event.touches.length!==1)return;
  const t=event.touches[0];
  touchStart={x:t.clientX,y:t.clientY};
},{passive:true});
addEventListener("touchend",event=>{
  if(!touchStart||!event.changedTouches.length){touchStart=null;return}
  const start=touchStart,t=event.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
  touchStart=null;
  if(current===2)return;
  const distance=Math.abs(dy);
  if(busy||distance<swipeThreshold||distance<Math.abs(dx)*1.12)return;
  go(current+(dy<0?1:-1));
},{passive:true});
addEventListener("touchcancel",()=>{touchStart=null},{passive:true});

/* Coverflow das lojas: arraste horizontal livre + profundidade em tempo real. */
const reduceStoreMotion=matchMedia("(prefers-reduced-motion: reduce)");
let storeDepthRaf=0;
let activeStore=0;
let dragState=null;
let suppressStoreClickUntil=0;

function storeCenterAtScroll(card){
  return card.offsetLeft+(card.offsetWidth/2);
}
function nearestStoreIndexForScroll(scrollLeft=track?.scrollLeft||0){
  if(!track||!cards.length)return 0;
  const center=scrollLeft+(track.clientWidth/2);
  let best=0,bestDistance=Infinity;
  cards.forEach((card,index)=>{
    const distance=Math.abs(storeCenterAtScroll(card)-center);
    if(distance<bestDistance){bestDistance=distance;best=index}
  });
  return best;
}
function scrollStoreTo(index,{smooth=true}={}){
  if(!track||!cards.length)return;
  const target=Math.max(0,Math.min(cards.length-1,index));
  const card=cards[target];
  const left=storeCenterAtScroll(card)-(track.clientWidth/2);
  track.scrollTo({left,behavior:smooth&&!reduceStoreMotion.matches?"smooth":"auto"});
}
function renderPagination(index){
  if(!pagination)return;
  [...pagination.children].forEach((dot,i)=>{
    const selected=i===index;
    dot.classList.toggle("is-active",selected);
    dot.setAttribute("aria-current",selected?"true":"false");
  });
}
function setActiveStore(index){
  if(!cards.length)return;
  activeStore=Math.max(0,Math.min(cards.length-1,index));
  cards.forEach((card,i)=>{
    const selected=i===activeStore;
    card.dataset.depth=selected?"center":"side";
    card.setAttribute("aria-current",selected?"true":"false");
  });
  renderPagination(activeStore);
}
function updateStoreDepth(){
  storeDepthRaf=0;
  if(!track||!cards.length)return;
  if(reduceStoreMotion.matches){
    cards.forEach(card=>{
      card.style.transform="none";
      card.style.opacity="1";
      card.style.zIndex="1";
    });
    setActiveStore(nearestStoreIndexForScroll());
    return;
  }

  const trackRect=track.getBoundingClientRect();
  const viewportCenter=trackRect.left+(trackRect.width/2);
  const cardWidth=Math.max(1,cards[0]?.getBoundingClientRect().width||320);
  const range=Math.max(1,cardWidth*.92);
  let nearest=0,nearestDistance=Infinity;

  cards.forEach((card,index)=>{
    const cardCenter=trackRect.left+card.offsetLeft-track.scrollLeft+(card.offsetWidth/2);
    const raw=(cardCenter-viewportCenter)/range;
    const signed=Math.max(-1.7,Math.min(1.7,raw));
    const distance=Math.min(1.35,Math.abs(signed));
    const near=Math.min(1,distance);
    const rotate=-signed*34;
    const depth=-near*185;
    const scale=1-(near*.085);
    const shift=-signed*24;
    const lift=near*6;
    const opacity=1-(near*.22);

    card.style.transformOrigin=signed<-.04?"100% 50%":signed>.04?"0% 50%":"50% 50%";
    card.style.transform=`perspective(1200px) translate3d(${shift.toFixed(1)}px,${lift.toFixed(1)}px,${depth.toFixed(1)}px) rotateY(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    card.style.opacity=String(Math.max(.68,opacity));
    card.style.zIndex=String(100-Math.round(near*45));

    const absolute=Math.abs(cardCenter-viewportCenter);
    if(absolute<nearestDistance){nearestDistance=absolute;nearest=index}
  });

  setActiveStore(nearest);
}
function scheduleStoreDepth(){
  if(storeDepthRaf)return;
  storeDepthRaf=requestAnimationFrame(updateStoreDepth);
}

function buildStorePagination(){
  if(!pagination||!cards.length)return;
  pagination.replaceChildren();
  cards.forEach((card,index)=>{
    const dot=document.createElement("button");
    dot.type="button";
    dot.className="stores-dot";
    dot.setAttribute("aria-label",`Ir para ${card.querySelector("h3")?.textContent?.trim()||`loja ${index+1}`}`);
    dot.addEventListener("click",()=>scrollStoreTo(index));
    pagination.appendChild(dot);
  });
  renderPagination(activeStore);
}

function endStoreDrag(event,cancelled=false){
  if(!dragState||event.pointerId!==dragState.id)return;
  const state=dragState;
  dragState=null;
  track?.classList.remove("is-dragging");
  try{track?.releasePointerCapture?.(event.pointerId)}catch{}
  if(cancelled||state.axis!=="x")return;

  suppressStoreClickUntil=performance.now()+260;
  const projected=(track?.scrollLeft||0)+(state.velocity*210);
  scrollStoreTo(nearestStoreIndexForScroll(projected));
}

track?.addEventListener("pointerdown",event=>{
  if(event.pointerType==="touch")return;
  if(!event.isPrimary||event.button!==0)return;
  dragState={
    id:event.pointerId,
    startX:event.clientX,
    startY:event.clientY,
    startScroll:track.scrollLeft,
    lastX:event.clientX,
    lastTime:performance.now(),
    velocity:0,
    axis:null,
    moved:false
  };
},{passive:true});

track?.addEventListener("pointermove",event=>{
  const state=dragState;
  if(!state||event.pointerId!==state.id)return;
  const dx=event.clientX-state.startX;
  const dy=event.clientY-state.startY;
  if(!state.axis&&Math.hypot(dx,dy)>6){
    state.axis=Math.abs(dx)>Math.abs(dy)*1.06?"x":"y";
    if(state.axis==="x"){
      state.moved=true;
      track.classList.add("is-dragging");
      try{track.setPointerCapture(event.pointerId)}catch{}
    }
  }
  if(state.axis!=="x")return;
  event.preventDefault();

  const now=performance.now();
  const before=track.scrollLeft;
  track.scrollLeft=state.startScroll-dx;
  const dt=Math.max(8,now-state.lastTime);
  const delta=track.scrollLeft-before;
  const instant=delta/dt;
  state.velocity=(state.velocity*.72)+(instant*.28);
  state.lastX=event.clientX;
  state.lastTime=now;
  scheduleStoreDepth();
},{passive:false});

track?.addEventListener("pointerup",event=>endStoreDrag(event,false));
track?.addEventListener("pointercancel",event=>endStoreDrag(event,true));
track?.addEventListener("lostpointercapture",event=>{
  if(dragState&&event.pointerId===dragState.id)endStoreDrag(event,false);
});
track?.addEventListener("dragstart",event=>event.preventDefault());
track?.addEventListener("click",event=>{
  if(performance.now()<suppressStoreClickUntil){
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  if(event.target.closest("a,button"))return;
  const card=event.target.closest(".store-card");
  if(!card)return;
  const index=cards.indexOf(card);
  if(index>=0&&index!==activeStore)scrollStoreTo(index);
});
track?.addEventListener("scroll",scheduleStoreDepth,{passive:true});
addEventListener("resize",scheduleStoreDepth,{passive:true});
reduceStoreMotion.addEventListener?.("change",scheduleStoreDepth);
document.addEventListener("dc:stagechange",event=>{
  if(event.detail?.stage?.kind==="stores")requestAnimationFrame(scheduleStoreDepth);
});

function moveStore(direction){
  if(!track||!cards.length)return;
  scrollStoreTo(nearestStoreIndexForScroll()+direction);
}
prevStore?.addEventListener("click",()=>moveStore(-1));
nextStore?.addEventListener("click",()=>moveStore(1));

addEventListener("keydown",event=>{
  const target=event.target;
  if(current===2&&target===document.body)return;
  const interactive=target&&/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(target.tagName);
  if(current===1&&!interactive&&(event.key==="ArrowLeft"||event.key==="ArrowRight")){
    event.preventDefault();moveStore(event.key==="ArrowRight"?1:-1);return;
  }
  if(interactive)return;
  let handled=true;
  if(event.key==="ArrowDown"||event.key==="PageDown"||event.key===" ")next();
  else if(event.key==="ArrowUp"||event.key==="PageUp")prev();
  else if(event.key==="Home")go(0);
  else if(event.key==="End")go(stages.length-1);
  else handled=false;
  if(handled)event.preventDefault();
});

document.addEventListener("click",event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const href=link.getAttribute("href");
  let target=null;
  if(href==="#inicio")target=0;
  else if(href==="#lojas")target=1;
  else if(href==="#cardapio")target=2;
  if(target===null)return;
  event.preventDefault();
  go(target);
});

addEventListener("message",event=>{
  if(!menuFrame||event.source!==menuFrame.contentWindow)return;
  if(event.data?.type==="dc:menu:back"&&current===2)go(1);
});

buildStorePagination();
window.DC_STAGE_API={next,prev,go,get index(){return current},get stages(){return stages.slice()},moveStore,scrollStoreTo,get storeIndex(){return activeStore}};
applyStage(current,{initial:true});
scheduleStoreDepth();
})();

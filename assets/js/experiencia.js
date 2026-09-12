(()=>{"use strict";
const source=window.DC_CONTENT&&DC_CONTENT.categories;if(!source||!source.length)return;
const cats=source.filter(item=>!item.hidden);if(!cats.length)return;
const total=cats.length;
const imgA=document.getElementById("story-img-a"),imgB=document.getElementById("story-img-b"),num=document.getElementById("story-number"),title=document.getElementById("story-title"),sub=document.getElementById("story-subtitle"),copy=document.getElementById("story-copy"),readout=document.getElementById("story-readout"),bar=document.getElementById("story-progress-bar"),finale=document.getElementById("brand-finale"),sweetsLayer=document.getElementById("story-sweets-gallery");
if(!imgA||!imgB||!copy||!finale)return;
const sweetSources=(window.DC_CONTENT&&DC_CONTENT.docesGallery)||[];
const sweetCards=sweetsLayer?[...sweetsLayer.querySelectorAll(".story-sweet-card")]:[];
let front=imgA,back=imgB,currentIndex=-1,sweetsReady=false,sweetsPreloaded=false,swapTimer=0,copyTimer=0,renderToken=0;
const pad=n=>String(n).padStart(2,"0");

function clearImageHandlers(el){if(!el)return;el.onload=null;el.onerror=null}
function applyImage(el,item){
  clearImageHandlers(el);
  el.classList.remove("fit-contain");
  if(!item||!item.image){el.removeAttribute("src");el.removeAttribute("srcset");return}
  el.srcset=item.image.srcset||"";el.sizes="100vw";el.src=item.image.src;el.style.objectPosition=item.image.position||"50% 50%";
  if(item.image.fit==="contain")el.classList.add("fit-contain");
}
function preload(item){if(!item||!item.image)return;const i=new Image();i.decoding="async";i.srcset=item.image.srcset||"";i.sizes="100vw";i.src=item.image.src}
function preloadWindow(index){for(let offset=1;offset<=3;offset++)preload(cats[index+offset])}
function hydrateSweets(){
  if(sweetsReady||!sweetCards.length||!sweetSources.length)return;
  sweetCards.forEach((card,index)=>{const img=card.querySelector("img"),item=sweetSources[index];if(!img||!item)return;img.alt=item.alt||"";img.decoding="async";img.loading="lazy";img.src=item.src;img.srcset=item.srcset||"";img.sizes="(max-width:760px) 30vw, (max-width:1180px) 26vw, 340px";img.style.objectPosition=item.position||"50% 50%"});
  sweetsReady=true;
}
function preloadSweets(){
  if(sweetsPreloaded||!sweetSources.length)return;
  hydrateSweets();
  sweetSources.forEach(item=>{const i=new Image();i.decoding="async";i.srcset=item.srcset||"";i.sizes="(max-width:760px) 30vw, (max-width:1180px) 26vw, 340px";i.src=item.src});
  sweetsPreloaded=true;
}
function setCopy(item,index){
  const display=pad(index+1);num.textContent=display;title.textContent=item.title;sub.textContent=item.subtitle;readout.textContent=`${display} / ${pad(total)}`;
}
function hideCopy(){clearTimeout(copyTimer);copy.classList.remove("is-visible")}
function showCopy(item,index,delay=70){
  hideCopy();setCopy(item,index);
  copyTimer=setTimeout(()=>copy.classList.add("is-visible"),delay);
}
function hideSweets(){if(sweetsLayer)sweetsLayer.classList.remove("is-active")}
function hideFinale(){finale.classList.remove("is-visible","is-interactive");finale.setAttribute("aria-hidden","true");const link=finale.querySelector("a");if(link)link.tabIndex=-1}
function showFinale(){
  renderToken++;clearTimeout(swapTimer);clearImageHandlers(front);clearImageHandlers(back);hideCopy();hideSweets();front.classList.remove("is-visible");back.classList.remove("is-visible");
  finale.classList.add("is-visible");finale.setAttribute("aria-hidden","false");
  setTimeout(()=>{finale.classList.add("is-interactive");const link=finale.querySelector("a");if(link)link.tabIndex=0},260);
  if(bar)bar.style.transform="scaleX(1)";
  if(readout)readout.textContent=`${pad(total)} / ${pad(total)}`;
  currentIndex=total;
}
function showSweets(item,index){
  renderToken++;clearTimeout(swapTimer);clearImageHandlers(front);clearImageHandlers(back);hideFinale();hydrateSweets();preloadSweets();
  front.classList.remove("is-visible");back.classList.remove("is-visible");
  hideCopy();setCopy(item,index);
  requestAnimationFrame(()=>{copy.classList.add("is-visible");if(sweetsLayer)sweetsLayer.classList.add("is-active")});
  currentIndex=index;
}
function showCategory(index,{immediate=false}={}){
  index=Math.max(0,Math.min(total-1,index));const item=cats[index];
  if(!item)return;
  const token=++renderToken;
  const docesIndex=cats.findIndex(x=>x.id==="doces");
  if(docesIndex>=0&&index>=Math.max(0,docesIndex-3))preloadSweets();
  preloadWindow(index);
  if(item.id==="doces"){showSweets(item,index);if(bar)bar.style.transform=`scaleX(${((index+1)/total).toFixed(4)})`;return}

  hideFinale();hideSweets();clearTimeout(swapTimer);clearImageHandlers(front);clearImageHandlers(back);
  hideCopy();
  applyImage(back,item);back.classList.remove("is-visible");
  const reveal=()=>{
    if(token!==renderToken)return;
    clearImageHandlers(back);
    setCopy(item,index);
    requestAnimationFrame(()=>{
      if(token!==renderToken)return;
      back.classList.add("is-visible");
      front.classList.remove("is-visible");
      copy.classList.add("is-visible");
      swapTimer=setTimeout(()=>{
        if(token!==renderToken)return;
        const old=front;front=back;back=old;
        back.classList.remove("is-visible");clearImageHandlers(back);back.removeAttribute("srcset");back.removeAttribute("src");
      },immediate?0:430);
    });
  };
  if(immediate||(back.complete&&back.naturalWidth))requestAnimationFrame(reveal);
  else{back.onload=reveal;back.onerror=reveal}
  currentIndex=index;
  if(bar)bar.style.transform=`scaleX(${((index+1)/total).toFixed(4)})`;
}
function clearStory(){
  renderToken++;clearTimeout(swapTimer);clearTimeout(copyTimer);clearImageHandlers(front);clearImageHandlers(back);hideCopy();hideSweets();hideFinale();front.classList.remove("is-visible");back.classList.remove("is-visible");currentIndex=-1;if(bar)bar.style.transform="scaleX(0)";
}
function handleStage(event){
  const detail=event.detail||{};
  if(detail.kind==="category")showCategory(Number(detail.categoryIndex)||0,{immediate:!!detail.initial});
  else if(detail.kind==="final")showFinale();
  else clearStory();
}
document.addEventListener("dc:stagechange",handleStage);
if(window.DC_STAGE_STATE)handleStage({detail:{...window.DC_STAGE_STATE.stage,index:window.DC_STAGE_STATE.index,initial:true}});
preload(cats[0]);
})();

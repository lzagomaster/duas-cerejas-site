(()=>{"use strict";
const embedded=new URLSearchParams(location.search).get("embed")==="1";
if(embedded){
  document.body.classList.add("is-embedded");
  document.documentElement.classList.add("is-embedded");

  let touchStartY=null;
  let lastBackSignal=0;
  const signalBack=()=>{
    const now=performance.now();
    if(now-lastBackSignal<650)return;
    lastBackSignal=now;
    parent.postMessage({type:"dc:menu:back"},"*");
  };
  addEventListener("wheel",event=>{
    if(scrollY<=1&&event.deltaY<-42)signalBack();
  },{passive:true});
  addEventListener("touchstart",event=>{
    if(event.touches.length===1)touchStartY=event.touches[0].clientY;
  },{passive:true});
  addEventListener("touchend",event=>{
    if(touchStartY===null||!event.changedTouches.length){touchStartY=null;return}
    const dy=event.changedTouches[0].clientY-touchStartY;
    touchStartY=null;
    if(scrollY<=1&&dy>52)signalBack();
  },{passive:true});
  addEventListener("touchcancel",()=>{touchStartY=null},{passive:true});
}

const pages=[...document.querySelectorAll(".pdf-page")];
const counter=document.getElementById("pdf-counter");
if(!pages.length||!counter)return;
let current=1;
function setCurrent(page){
  const next=Math.max(1,Math.min(pages.length,Number(page)||1));
  if(next===current)return;
  current=next;
  counter.textContent=`Página ${current} de ${pages.length}`;
}
if("IntersectionObserver" in window){
  const visibility=new Map();
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>visibility.set(Number(entry.target.dataset.page),entry.intersectionRatio));
    let best=current,bestRatio=-1;
    visibility.forEach((ratio,page)=>{if(ratio>bestRatio){bestRatio=ratio;best=page}});
    if(bestRatio>0)setCurrent(best);
  },{root:null,rootMargin:"-18% 0px -46% 0px",threshold:[0,.15,.3,.5,.7,.9,1]});
  pages.forEach(page=>observer.observe(page));
}else{
  let ticking=false;
  addEventListener("scroll",()=>{
    if(ticking)return;
    ticking=true;
    requestAnimationFrame(()=>{
      const targetY=innerHeight*.38;
      let best=1,distance=Infinity;
      pages.forEach(page=>{
        const rect=page.getBoundingClientRect();
        const d=Math.abs((rect.top+Math.min(rect.height,targetY))-targetY);
        if(d<distance){distance=d;best=Number(page.dataset.page)||1}
      });
      setCurrent(best);
      ticking=false;
    });
  },{passive:true});
}
})();

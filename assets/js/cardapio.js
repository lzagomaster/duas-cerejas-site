(()=>{"use strict";
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

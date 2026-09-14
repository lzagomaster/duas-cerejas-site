(()=>{"use strict";
const loader=document.getElementById("site-loader");
const bar=document.getElementById("site-loader-progress");
const label=document.getElementById("site-loader-percent");
const hero=document.getElementById("hero-a");
const started=performance.now();
let repeatVisit=false;
try{repeatVisit=sessionStorage.getItem("dc-boot-seen")==="1"}catch{}
const minimumHold=repeatVisit?120:360;
let finished=false,current=6,target=12,raf=0;

function paint(value){
  current=Math.max(current,Math.min(100,value));
  if(bar)bar.style.transform=`scaleX(${(current/100).toFixed(3)})`;
  if(label)label.textContent=current>=100?"Pronto":`Carregando ${Math.round(current)}%`;
}
function tick(){
  raf=0;
  const gap=target-current;
  if(Math.abs(gap)>.25){
    paint(current+Math.max(.45,gap*.11));
    raf=requestAnimationFrame(tick);
  }else paint(target);
}
function aim(value){target=Math.max(target,Math.min(100,value));if(!raf)raf=requestAnimationFrame(tick)}
function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function domReady(){
  if(document.readyState!=="loading")return Promise.resolve();
  return new Promise(resolve=>document.addEventListener("DOMContentLoaded",resolve,{once:true}));
}
function heroReady(){
  if(!hero)return Promise.resolve();
  const loaded=hero.complete&&hero.naturalWidth>0
    ? Promise.resolve()
    : new Promise(resolve=>{
        const done=()=>{hero.removeEventListener("load",done);hero.removeEventListener("error",done);resolve()};
        hero.addEventListener("load",done,{once:true});
        hero.addEventListener("error",done,{once:true});
      });
  return loaded.then(async()=>{
    aim(78);
    if(typeof hero.decode==="function"){try{await hero.decode()}catch{}}
    aim(93);
  });
}
function finish(){
  if(finished)return;finished=true;
  aim(100);paint(100);
  document.body.classList.remove("is-loading");
  window.DC_APP_READY=true;
  try{sessionStorage.setItem("dc-boot-seen","1")}catch{}
  document.dispatchEvent(new CustomEvent("dc:appready"));
  requestAnimationFrame(()=>{
    loader?.classList.add("is-leaving");
    setTimeout(()=>{if(loader)loader.hidden=true},460);
  });
}

aim(24);
Promise.all([
  domReady().then(()=>aim(46)),
  heroReady(),
  wait(Math.max(0,minimumHold-(performance.now()-started)))
]).then(finish);
setTimeout(finish,4500);
})();

(()=>{"use strict";
document.addEventListener("visibilitychange",()=>{document.documentElement.toggleAttribute("data-hidden",document.hidden)});
const section=document.getElementById("inicio");
const welcome=document.getElementById("welcome-layer");
const storyLayer=document.getElementById("story-layer");
if(!section||!welcome||!storyLayer)return;

const heroCopy=section.querySelector(".hero-copy");
const heroControls=section.querySelector(".hero-controls");
const scrollCue=section.querySelector(".scroll-cue");
const cats=((window.DC_CONTENT&&DC_CONTENT.categories)||[]).filter(item=>!item.hidden);
const motion=(window.DC_CONTENT&&DC_CONTENT.motion)||{};
const transitionMs=Math.max(360,Number(motion.stageTransitionMs)||520);
const wheelThreshold=Math.max(30,Number(motion.wheelThreshold)||56);
const swipeThreshold=Math.max(30,Number(motion.swipeThreshold)||46);
const stages=[{kind:"hero"},{kind:"welcome"},...cats.map((item,index)=>({kind:"category",categoryIndex:index,id:item.id})),{kind:"final"}];
let current=0,busy=false,unlockTimer=0,wheelAccum=0,wheelCommitted=false,wheelQuietTimer=0,touchStart=null;

const clampIndex=value=>Math.max(0,Math.min(stages.length-1,value));
function setHeroVisible(show){
  const opacity=show?"1":"0";
  section.style.setProperty("--hero-exit",show?"0":"1");
  if(heroCopy){heroCopy.style.opacity=opacity;heroCopy.style.transform=show?"translate3d(0,0,0)":"translate3d(0,-10px,0)"}
  if(heroControls)heroControls.style.opacity=opacity;
  if(scrollCue)scrollCue.style.opacity=opacity;
}
function setWelcomeVisible(show){
  welcome.style.opacity=show?"1":"0";
  welcome.style.transform=show?"translate3d(0,0,0) scale(1)":"translate3d(0,12px,0) scale(.988)";
  welcome.style.pointerEvents=show?"auto":"none";
}
function setStoryVisible(show){storyLayer.style.opacity=show?"1":"0"}
function emit(stage,index,initial){
  window.DC_STAGE_STATE={index,stage,total:stages.length};
  document.dispatchEvent(new CustomEvent("dc:stagechange",{detail:{...stage,index,total:stages.length,initial:!!initial}}));
}
function applyStage(index,{initial=false}={}){
  index=clampIndex(index);
  if(index===current&&!initial)return;
  current=index;
  const stage=stages[current];
  section.dataset.scene=stage.kind;
  section.dataset.stage=String(current);
  setHeroVisible(stage.kind==="hero");
  setWelcomeVisible(stage.kind==="welcome");
  setStoryVisible(stage.kind==="category"||stage.kind==="final");
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

function releaseWheelGesture(){
  wheelAccum=0;
  wheelCommitted=false;
}
addEventListener("wheel",event=>{
  if(event.ctrlKey)return;
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
  touchStart={x:t.clientX,y:t.clientY,time:performance.now()};
},{passive:true});
addEventListener("touchend",event=>{
  if(!touchStart||!event.changedTouches.length){touchStart=null;return}
  const start=touchStart,t=event.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;
  touchStart=null;
  const distance=Math.abs(dy);
  if(busy||distance<swipeThreshold||distance<Math.abs(dx)*1.12)return;

  // Swipe curto = 1 etapa; medio = 2; longo = 3.
  const viewport=Math.max(1,window.innerHeight||document.documentElement.clientHeight||1);
  const ratio=distance/viewport;
  let steps=1;
  if(ratio>=0.42)steps=3;
  else if(ratio>=0.22)steps=2;
  go(current+(dy<0?steps:-steps));
},{passive:true});
addEventListener("touchcancel",()=>{touchStart=null},{passive:true});

addEventListener("keydown",event=>{
  const target=event.target;
  if(target&&/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName))return;
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
  else if(href==="#boas-vindas")target=1;
  else if(href==="#sabores")target=2;
  if(target===null)return;
  event.preventDefault();
  go(target);
});

const hash=location.hash;
if(hash==="#boas-vindas")current=1;
else if(hash==="#sabores")current=2;
else current=0;
window.DC_STAGE_API={next,prev,go,get index(){return current},get stages(){return stages.slice()}};
applyStage(current,{initial:true});
})();

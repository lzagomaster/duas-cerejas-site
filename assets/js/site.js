(()=>{"use strict";
document.addEventListener("visibilitychange",()=>{document.documentElement.toggleAttribute("data-hidden",document.hidden)});
const section=document.getElementById("inicio");
const welcome=document.getElementById("welcome-layer");
const storyLayer=document.getElementById("story-layer");
if(!section||!welcome||!storyLayer)return;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const motion=(window.DC_CONTENT&&DC_CONTENT.motion)||{};
const openingVh=Number(motion.openingVh)||54;
const heroCopy=section.querySelector(".hero-copy");
const heroControls=section.querySelector(".hero-controls");
const scrollCue=section.querySelector(".scroll-cue");
const welcomeAnchor=document.getElementById("boas-vindas");
const storyAnchor=document.getElementById("sabores");
const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
welcome.classList.add("is-active");
let start=0,range=1,raf=0,last=-1;
function measure(){
  const r=section.getBoundingClientRect();
  start=scrollY+r.top;
  range=Math.max(1,innerHeight*(openingVh/100));
  if(welcomeAnchor)welcomeAnchor.style.top=`${Math.round(openingVh*.31)}vh`;
  if(storyAnchor)storyAnchor.style.top=`${openingVh}vh`;
  last=-1;
  request();
}
function render(){
  raf=0;
  const p=clamp((scrollY-start)/range);
  if(Math.abs(p-last)<.001)return;
  last=p;

  // Hero -> preto: o palco nao se move; apenas a luz/copia desaparecem.
  const heroOut=smooth((p-.06)/.20);
  const heroDark=smooth((p-.10)/.25);
  section.style.setProperty("--hero-exit",heroDark.toFixed(4));
  const heroOpacity=(1-heroOut).toFixed(4);
  if(heroCopy){heroCopy.style.opacity=heroOpacity;heroCopy.style.transform=`translate3d(0,${(-10*heroOut).toFixed(2)}px,0)`}
  if(heroControls)heroControls.style.opacity=heroOpacity;
  if(scrollCue)scrollCue.style.opacity=heroOpacity;

  // Boas-vindas entra sobre o mesmo preto e sai antes do produto dominar.
  const welcomeIn=smooth((p-.27)/.17);
  const welcomeOut=1-smooth((p-.61)/.17);
  const welcomeOpacity=clamp(welcomeIn*welcomeOut);
  welcome.style.opacity=welcomeOpacity.toFixed(4);
  if(!reduced){
    const scale=.985+.015*welcomeIn;
    const y=(1-welcomeIn)*14-(1-welcomeOut)*8;
    welcome.style.transform=`translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
  }
  welcome.style.pointerEvents=welcomeOpacity>.72?"auto":"none";

  // O proprio palco dos sabores nasce por cima. Nao existe segunda foto/pagina subindo.
  const storyIn=smooth((p-.73)/.27);
  storyLayer.style.opacity=storyIn.toFixed(4);
}
function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(render)}
addEventListener("scroll",request,{passive:true});
addEventListener("resize",()=>{clearTimeout(window.__dcOpeningResize);window.__dcOpeningResize=setTimeout(measure,120)},{passive:true});
document.addEventListener("visibilitychange",request);
measure();
})();

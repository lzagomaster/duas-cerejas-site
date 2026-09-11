(()=>{"use strict";
const source=window.DC_CONTENT&&DC_CONTENT.categories;
if(!source||!source.length)return;
const cats=source.filter(item=>!item.hidden);
if(!cats.length)return;
const total=cats.length;
const section=document.getElementById("inicio"),stage=document.getElementById("cinematic-stage"),storyLayer=document.getElementById("story-layer"),imgA=document.getElementById("story-img-a"),imgB=document.getElementById("story-img-b"),num=document.getElementById("story-number"),title=document.getElementById("story-title"),sub=document.getElementById("story-subtitle"),copy=document.getElementById("story-copy"),readout=document.getElementById("story-readout"),bar=document.getElementById("story-progress-bar"),finale=document.getElementById("brand-finale"),storyAnchor=document.getElementById("sabores"),sweetsLayer=document.getElementById("story-sweets-gallery");
if(!section||!stage||!storyLayer)return;
const sweetSources=(window.DC_CONTENT&&DC_CONTENT.docesGallery)||[];
const sweetCards=sweetsLayer?[...sweetsLayer.querySelectorAll(".story-sweet-card")]:[];
const motion=(window.DC_CONTENT&&DC_CONTENT.motion)||{};
const openingVh=Number(motion.openingVh)||54;
const segmentVh=Number(motion.segmentVh)||38;
const states=[...cats,{id:"final",image:null,final:true}];
let segment=-1,raf=0,start=0,storyStart=0,range=1,lastP=-1,sweetsReady=false,sweetsPreloaded=false;
const unit=(window.CSS&&CSS.supports&&CSS.supports("height","100svh"))?"svh":"vh";
const pad=n=>String(n).padStart(2,"0");
function setSectionHeight(){
  section.style.height=`${100+openingVh+total*segmentVh}${unit}`;
  if(storyAnchor)storyAnchor.style.top=`${openingVh}${unit}`;
}
function setImg(el,item){
  el.classList.remove("fit-contain");
  if(!item||!item.image){el.removeAttribute("src");el.removeAttribute("srcset");el.style.opacity=0;return}
  el.src=item.image.src;el.srcset=item.image.srcset;el.sizes="100vw";el.style.objectPosition=item.image.position||"50% 50%";
  if(item.image.fit==="contain")el.classList.add("fit-contain");
}
function preload(item){if(!item||!item.image)return;const i=new Image();i.decoding="async";i.srcset=item.image.srcset;i.sizes="100vw";i.src=item.image.src}
function hydrateSweets(){
  if(sweetsReady||!sweetsLayer||!sweetCards.length||!sweetSources.length)return;
  sweetCards.forEach((card,index)=>{
    const img=card.querySelector("img"),item=sweetSources[index];
    if(!img||!item)return;
    img.alt=item.alt||"";
    img.loading="lazy";
    img.decoding="async";
    img.src=item.src;
    img.srcset=item.srcset||"";
    img.sizes="(max-width: 760px) 29vw, (max-width: 1180px) 25vw, 340px";
    img.style.objectPosition=item.position||"50% 50%";
  });
  sweetsReady=true;
}
function preloadSweets(){
  if(sweetsPreloaded||!sweetSources.length)return;
  sweetSources.forEach(item=>{const i=new Image();i.decoding="async";i.srcset=item.srcset||"";i.sizes="(max-width: 760px) 29vw, (max-width: 1180px) 25vw, 340px";i.src=item.src});
  sweetsPreloaded=true;
}
function resetSweets(){
  if(!sweetsLayer)return;
  sweetsLayer.style.opacity="0";
  sweetsLayer.classList.remove("is-active");
  sweetCards.forEach((card,index)=>{
    const baseOffset=[20,34,24][index]||26;
    card.style.opacity="0";
    card.style.transform=`translate3d(0,${baseOffset+34}px,0) scale(.94)`;
  });
}
function setup(s){
  segment=s;
  const current=states[s],next=states[Math.min(s+1,states.length-1)];
  setImg(imgA,current);setImg(imgB,next);
  if(!current.final){const displayNumber=pad(s+1);num.textContent=displayNumber;title.textContent=current.title;sub.textContent=current.subtitle;readout.textContent=`${displayNumber} / ${pad(total)}`;copy.style.display="block"}
  preload(states[Math.min(s+2,states.length-1)]);
  if(current.id==="doces"||next.id==="doces"){hydrateSweets();preloadSweets();}
}
function smooth(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
function renderSweets(current,local){
  if(!sweetsLayer||!sweetCards.length)return;
  if(!current||current.id!=="doces"){resetSweets();return;}
  const backdrop=1-smooth((local-.90)/.08);
  sweetsLayer.style.opacity=String(backdrop);
  sweetsLayer.classList.toggle("is-active",backdrop>.02);
  const starts=[.10,.32,.54],baseOffsets=[18,30,22];
  sweetCards.forEach((card,index)=>{
    const reveal=smooth((local-starts[index])/.16);
    const visible=Math.max(0,Math.min(1,reveal*backdrop));
    const lift=baseOffsets[index]+(1-reveal)*34;
    const scale=.92+.08*reveal;
    card.style.opacity=String(visible);
    card.style.transform=`translate3d(0,${lift.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
  });
}
function render(){
  raf=0;
  const p=Math.max(0,Math.min(1,(scrollY-storyStart)/range));
  if(Math.abs(p-lastP)<.0008)return;
  lastP=p;
  const pos=p*(states.length-1),s=Math.min(states.length-2,Math.floor(pos)),local=pos-s;
  if(s!==segment)setup(s);
  const current=states[s],next=states[s+1];

  const fade=smooth((local-.68)/.26);
  if(current&&current.id==="doces"){
    imgA.style.opacity="0";
    imgA.style.transform="translate3d(0,0,0) scale(1.01)";
    if(next&&next.image){
      const nextFade=smooth((local-.82)/.16);
      imgB.style.opacity=String(nextFade);
      imgB.style.transform=`translate3d(${(.9*(1-local)).toFixed(2)}%,${(-.45*(1-local)).toFixed(2)}%,0) scale(${(1.026-.010*nextFade).toFixed(4)})`;
    }else imgB.style.opacity="0";
  }else{
    if(current.image){imgA.style.opacity=String(1-fade);imgA.style.transform=`translate3d(${(-.7*local).toFixed(2)}%,${(.45*local).toFixed(2)}%,0) scale(${(1.018-.006*smooth(local/.45)+.016*smooth((local-.52)/.48)).toFixed(4)})`}else imgA.style.opacity="0";
    if(next&&next.image&&next.id!=="doces"){imgB.style.opacity=String(fade);imgB.style.transform=`translate3d(${(.9*(1-local)).toFixed(2)}%,${(-.45*(1-local)).toFixed(2)}%,0) scale(${(1.035-.017*smooth((local-.68)/.32)).toFixed(4)})`}else imgB.style.opacity="0";
  }

  const textIn=smooth((local-.16)/.16);
  const textOut=1-smooth((local-.56)/.12);
  const textFade=current.final?0:Math.max(0,Math.min(1,textIn*textOut));
  copy.style.opacity=String(textFade);
  const y=(1-textIn)*18+(1-textOut)*-10;
  copy.style.transform=`translate3d(0,${y.toFixed(2)}px,0)`;

  renderSweets(current,local);

  const isLast=s===total-1;
  const f=isLast?smooth((local-.70)/.27):0;
  finale.style.opacity=String(f);
  finale.style.transform=`scale(${(.955+.045*f).toFixed(4)})`;
  finale.setAttribute("aria-hidden",f>.78?"false":"true");
  finale.classList.toggle("is-interactive",f>.82);
  const link=finale.querySelector("a");if(link)link.tabIndex=f>.82?0:-1;
  bar.style.transform=`scaleX(${p.toFixed(4)})`;
}
function measure(){
  const r=section.getBoundingClientRect();
  start=scrollY+r.top;
  storyStart=start+innerHeight*(openingVh/100);
  range=Math.max(1,innerHeight*(total*segmentVh/100));
  lastP=-1;
  request();
}
function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(render)}
addEventListener("scroll",request,{passive:true});
addEventListener("resize",()=>{clearTimeout(window.__dcResize);window.__dcResize=setTimeout(()=>{setSectionHeight();measure()},120)},{passive:true});
document.addEventListener("visibilitychange",request);
resetSweets();setSectionHeight();setup(0);measure();
})();

(()=>{"use strict";
const data=window.DC_CONTENT&&DC_CONTENT.hero;if(!data||!data.length)return;
const a=document.getElementById("hero-a"),b=document.getElementById("hero-b"),title=document.getElementById("hero-title"),eyebrow=document.getElementById("hero-eyebrow"),sub=document.getElementById("hero-subtitle"),dots=document.getElementById("hero-dots");
if(!a||!b||!title||!eyebrow||!sub||!dots)return;
const motion=(window.DC_CONTENT&&DC_CONTENT.motion)||{};
const intervalMs=Math.max(1800,Number(motion.heroIntervalMs)||2600);
const fadeMs=matchMedia("(prefers-reduced-motion: reduce)").matches?0:340;
const reduced=fadeMs===0;
let index=0,front=a,back=b,timer=0,transitionTimer=0,transitionToken=0,active=true,busy=false;
let appReady=!!window.DC_APP_READY,started=false;

function clearHandlers(img){img.onload=null;img.onerror=null}
function clearSource(img){clearHandlers(img);img.removeAttribute("srcset");img.removeAttribute("src")}
function apply(img,item,priority){
  clearHandlers(img);
  img.src=item.image.src;
  img.srcset=item.image.srcset;
  img.sizes="100vw";
  img.style.objectPosition=item.image.position||"50% 50%";
  img.style.objectFit=item.image.fit||"cover";
  img.fetchPriority=priority?"high":"auto";
}
function preload(i){
  const item=data[(i+data.length)%data.length],im=new Image();
  im.decoding="async";im.srcset=item.image.srcset;im.sizes="100vw";im.src=item.image.src;
}
function text(item){eyebrow.textContent=item.eyebrow;title.textContent=item.title;sub.textContent=item.subtitle}

[...data].forEach((_,i)=>{
  const d=document.createElement("button");
  d.type="button";d.className="hero-dot";d.setAttribute("aria-label",`Ir para destaque ${i+1}`);
  d.addEventListener("click",()=>go(i,true));dots.appendChild(d)
});
function marks(){[...dots.children].forEach((d,i)=>d.classList.toggle("is-active",i===index))}

function stopTimer(){clearTimeout(timer);timer=0}
function scheduleNext(){
  stopTimer();
  if(reduced||!active||document.hidden||!appReady)return;
  timer=setTimeout(()=>{
    timer=0;
    if(!active||document.hidden)return;
    if(busy){scheduleNext();return}
    go(index+1,false);
  },intervalMs);
}
function restart(){scheduleNext()}

function go(next,user=false){
  next=(next+data.length)%data.length;
  if(next===index||busy){if(user)restart();return false}

  stopTimer();
  busy=true;
  const token=++transitionToken;
  const item=data[next];
  const incoming=back;
  const outgoing=front;
  let revealed=false;

  apply(incoming,item,false);

  const fail=()=>{
    if(token!==transitionToken)return;
    clearHandlers(incoming);clearSource(incoming);busy=false;scheduleNext();
  };
  const reveal=()=>{
    if(revealed||token!==transitionToken)return;
    revealed=true;
    clearHandlers(incoming);
    text(item);
    incoming.classList.add("is-visible");
    outgoing.classList.remove("is-visible");

    // Atualiza o estado no inicio do crossfade. Assim o ultimo -> primeiro
    // segue a mesma logica de todas as demais trocas e nao herda handlers antigos.
    index=next;
    front=incoming;
    back=outgoing;
    marks();
    preload(index+1);

    clearTimeout(transitionTimer);
    transitionTimer=setTimeout(()=>{
      if(token!==transitionToken)return;
      clearSource(outgoing);
      busy=false;
      scheduleNext();
    },fadeMs);
  };

  incoming.onload=reveal;
  incoming.onerror=fail;
  if(incoming.complete&&incoming.naturalWidth)requestAnimationFrame(reveal);
  return true;
}
function next(user=false){return go(index+1,user)}
function prev(user=false){return go(index-1,user)}
function setActive(value){
  active=!!value;
  if(active&&appReady)restart();else stopTimer();
}
function startAfterBoot(){
  if(started)return;
  started=true;appReady=true;
  preload(1);
  restart();
}

document.getElementById("hero-next")?.addEventListener("click",()=>next(true));
document.getElementById("hero-prev")?.addEventListener("click",()=>prev(true));
document.addEventListener("dc:stagechange",event=>setActive(event.detail&&event.detail.kind==="hero"));
document.addEventListener("visibilitychange",()=>{if(document.hidden)stopTimer();else restart()});

marks();
if(appReady)startAfterBoot();
else document.addEventListener("dc:appready",startAfterBoot,{once:true});
})();

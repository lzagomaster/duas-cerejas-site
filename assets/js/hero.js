(()=>{"use strict";
const data=window.DC_CONTENT&&DC_CONTENT.hero;if(!data||!data.length)return;
const a=document.getElementById("hero-a"),b=document.getElementById("hero-b"),title=document.getElementById("hero-title"),eyebrow=document.getElementById("hero-eyebrow"),sub=document.getElementById("hero-subtitle"),dots=document.getElementById("hero-dots");
if(!a||!b||!title||!eyebrow||!sub||!dots)return;
const motion=(window.DC_CONTENT&&DC_CONTENT.motion)||{};
const intervalMs=Math.max(1800,Number(motion.heroIntervalMs)||2600);
let index=0,front=a,back=b,timer=0,active=true,busy=false;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
function apply(img,item,priority){img.src=item.image.src;img.srcset=item.image.srcset;img.sizes="100vw";img.style.objectPosition=item.image.position||"50% 50%";img.style.objectFit=item.image.fit||"cover";img.fetchPriority=priority?"high":"auto"}
function preload(i){const item=data[(i+data.length)%data.length],im=new Image();im.decoding="async";im.srcset=item.image.srcset;im.sizes="100vw";im.src=item.image.src}
function text(item){eyebrow.textContent=item.eyebrow;title.textContent=item.title;sub.textContent=item.subtitle}
[...data].forEach((_,i)=>{const d=document.createElement("button");d.type="button";d.className="hero-dot";d.setAttribute("aria-label",`Ir para destaque ${i+1}`);d.addEventListener("click",()=>go(i,true));dots.appendChild(d)});
function marks(){[...dots.children].forEach((d,i)=>d.classList.toggle("is-active",i===index))}
function go(next,user=false){
  next=(next+data.length)%data.length;if(next===index||busy)return;
  busy=true;const item=data[next];apply(back,item,false);
  const swap=()=>{text(item);back.classList.add("is-visible");front.classList.remove("is-visible");setTimeout(()=>{const old=front;front=back;back=old;back.removeAttribute("srcset");back.removeAttribute("src");index=next;marks();preload(index+1);busy=false},reduced?0:340)};
  if(back.complete&&back.naturalWidth)swap();else{back.onload=swap;back.onerror=()=>{busy=false}};
  if(user)restart();
}
function next(){go(index+1)}function prev(){go(index-1)}
function restart(){clearInterval(timer);if(!reduced&&active&&!document.hidden)timer=setInterval(next,intervalMs)}
function setActive(value){active=!!value;if(active)restart();else clearInterval(timer)}
document.getElementById("hero-next")?.addEventListener("click",()=>{next();restart()});
document.getElementById("hero-prev")?.addEventListener("click",()=>{prev();restart()});
document.addEventListener("dc:stagechange",event=>setActive(event.detail&&event.detail.kind==="hero"));
document.addEventListener("visibilitychange",restart);
marks();preload(1);restart();
})();

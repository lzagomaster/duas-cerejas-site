(()=>{"use strict";
const data=window.DC_CONTENT&&DC_CONTENT.hero;if(!data||!data.length)return;
const a=document.getElementById("hero-a"),b=document.getElementById("hero-b"),title=document.getElementById("hero-title"),eyebrow=document.getElementById("hero-eyebrow"),sub=document.getElementById("hero-subtitle"),dots=document.getElementById("hero-dots"),hero=document.getElementById("hero-stage"),section=document.getElementById("inicio");
let index=0,front=a,back=b,timer=0,visible=true,busy=false;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
function apply(img,item,priority){img.src=item.image.src;img.srcset=item.image.srcset;img.sizes="100vw";img.style.objectPosition=item.image.position||"50% 50%";img.style.objectFit=item.image.fit||"cover";img.fetchPriority=priority?"high":"auto"}
function preload(i){const item=data[(i+data.length)%data.length],im=new Image();im.decoding="async";im.srcset=item.image.srcset;im.sizes="100vw";im.src=item.image.src}
function text(item){eyebrow.textContent=item.eyebrow;title.textContent=item.title;sub.textContent=item.subtitle}
[...data].forEach((_,i)=>{const d=document.createElement("button");d.type="button";d.className="hero-dot";d.setAttribute("aria-label",`Ir para destaque ${i+1}`);d.addEventListener("click",()=>go(i,true));dots.appendChild(d)});
function marks(){[...dots.children].forEach((d,i)=>d.classList.toggle("is-active",i===index))}
function go(next,user=false){next=(next+data.length)%data.length;if(next===index||busy)return;busy=true;const item=data[next];apply(back,item,false);const swap=()=>{text(item);back.classList.add("is-visible");front.classList.remove("is-visible");setTimeout(()=>{const old=front;front=back;back=old;back.removeAttribute("srcset");back.removeAttribute("src");index=next;marks();preload(index+1);busy=false},reduced?0:500)};if(back.complete)swap();else{back.onload=swap;back.onerror=()=>{busy=false}}if(user)restart()}
function next(){go(index+1)}function prev(){go(index-1)}
function restart(){clearInterval(timer);if(!reduced&&visible&&!document.hidden)timer=setInterval(next,4300)}
function updateVisible(){if(!section)return;const r=section.getBoundingClientRect();const now=r.bottom>0&&r.top<innerHeight&&Math.max(0,-r.top)<innerHeight*.18;if(now===visible)return;visible=now;if(visible)restart();else clearInterval(timer)}
document.getElementById("hero-next").addEventListener("click",()=>{next();restart()});
document.getElementById("hero-prev").addEventListener("click",()=>{prev();restart()});
addEventListener("scroll",updateVisible,{passive:true});addEventListener("resize",updateVisible,{passive:true});
document.addEventListener("visibilitychange",()=>{updateVisible();restart()});
marks();preload(1);updateVisible();restart();
})();

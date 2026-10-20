// ---- Demo settings: edit here ----
const CONFIG={
  price:599,
  whatsapp:"", // international format without +, e.g. "2126XXXXXXXX" (button appears when set)
  sizes:[40,41,42,43,44,45],
  maxQty:5,
  images:{
    hero:{src:"assets/images/shoe.png"},
    detail1:{src:"assets/images/shoe.png",x:30,y:80,s:2.2},
    // Replace with separate photos (gallery-1.jpg ...) when you have them
    gallery:[{src:"assets/images/shoe.png",x:50,y:50,s:1.15},{src:"assets/images/shoe.png",x:62,y:28,s:2},{src:"assets/images/shoe.png",x:74,y:70,s:2}]
  },
  faq:[
    ["واش خاصني نخلص دابا؟","لا. الدفع كيكون عند الاستلام."],
    ["كيفاش كنختار المقاس؟","كتختارو فالاستمارة، وكنأكدوه معاك فالمكالمة."],
    ["شحال كياخد التوصيل؟","كيتغير حسب المدينة. كنقولو ليك المدة فالمكالمة."],
    ["واش نقدر نبدل الطلب؟","إيه، قبل الشحن. تواصل معنا فالمكالمة ديال التأكيد."]
  ]
};
// ----------------------------------
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function fill(el,o,alt){
  const img=new Image();img.alt=alt||"";img.loading="lazy";
  if(o.s){img.style.transformOrigin=(o.x||50)+'% '+(o.y||50)+'%';img.style.transform='scale('+o.s+')'}
  if(!o.s)img.style.objectFit='contain';
  img.onload=()=>{el.innerHTML="";el.appendChild(img)};
  img.src=o.src;
}
fill($('[data-img=hero]'),CONFIG.images.hero,"حذاء رياضي رجالي");
fill($('[data-img=detail1]'),CONFIG.images.detail1,"تفصيل الحذاء");
$$('[data-price]').forEach(e=>e.textContent=CONFIG.price);
$$('[data-sizes]').forEach(e=>e.textContent=CONFIG.sizes[0]+'–'+CONFIG.sizes.at(-1));
// gallery
const sl=$('#slides'),n=CONFIG.images.gallery.length;
CONFIG.images.gallery.forEach((o,i)=>{const d=document.createElement('div');d.className='media';d.style.aspectRatio='1/1';sl.appendChild(d);fill(d,o,"صورة "+(i+1))});
$('#gn').textContent=String(n).padStart(2,'0');$('#bar').style.width=(100/n)+'%';
const step=()=>sl.firstElementChild.getBoundingClientRect().width+(parseFloat(getComputedStyle(sl).columnGap)||0);
const idx=()=>Math.round(Math.abs(sl.scrollLeft)/step());
const go=i=>sl.scrollTo({left:Math.max(0,Math.min(n-1,i))*step(),behavior:'smooth'});
sl.addEventListener('scroll',()=>{const i=Math.min(n-1,idx());$('#gi').textContent=String(i+1).padStart(2,'0');$('#bar').style.left=(i*100/n)+'%'},{passive:true});
$('#prev').onclick=()=>go(idx()-1);$('#next').onclick=()=>go(idx()+1);
sl.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(idx()+1);if(e.key==='ArrowLeft')go(idx()-1)});
// faq
$('#faq').innerHTML=CONFIG.faq.map(([q,a])=>`<details class="faq"><summary class="flex items-center justify-between gap-4 min-h-[58px] cursor-pointer font-bold">${q}<svg class="ico plus"><use href="#i-plus"/></svg></summary><p class="pb-4 text-sm" style="opacity:.75">${a}</p></details>`).join('');
$('#faq details').open=true;
if(CONFIG.whatsapp){const w=$('#wa');w.href='https://wa.me/'+CONFIG.whatsapp+'?text='+encodeURIComponent('السلام، بغيت نطلب PACE R1');w.classList.remove('hidden')}
// form
let q=1,sel='';
const money=n=>n.toLocaleString('en-US');
const upd=()=>{$('#qty').textContent=q;$('#total').textContent=money(q*CONFIG.price);$('#sumPrice').textContent=money(q*CONFIG.price);$('#sumMeta').textContent=(sel?'المقاس '+sel:'اختار المقاس')+' · الكمية '+q};
fill($('#sumImg'),{src:CONFIG.images.hero.src,x:50,y:50,s:1.1},"PACE R1");
$('#chips').innerHTML=CONFIG.sizes.map(s=>`<button type="button" class="chip" role="radio" aria-checked="false" data-s="${s}">${s}</button>`).join('');
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;sel=b.dataset.s;$('#size').value=sel;$$('.chip').forEach(c=>c.setAttribute('aria-checked',c===b));$('#chips').classList.remove('bad');$('[data-e=size]').textContent='';navigator.vibrate&&navigator.vibrate(10);upd()});
$('#minus').onclick=()=>{q=Math.max(1,q-1);upd()};$('#plus').onclick=()=>{q=Math.min(CONFIG.maxQty,q+1);upd()};
const phoneOk=v=>/^(?:\+212|00212|0)[5-7]\d{8}$/.test(v.replace(/[\s.-]/g,''));
const rules={
  name:v=>v.trim().length<3&&'كتب الاسم الكامل',
  phone:v=>!phoneOk(v)&&'رقم غير صحيح، مثال: 0612345678',
  city:v=>v.trim().length<2&&'كتب المدينة',
  addr:v=>v.trim().length<6&&'كتب العنوان بالتفصيل'
};
const check=k=>{const el=$('#'+k),m=rules[k](el.value);$('[data-e='+k+']').textContent=m||'';el.classList.toggle('bad',!!m);el.classList.toggle('ok',!m&&el.value.trim()!=='');return m};
Object.keys(rules).forEach(k=>{const el=$('#'+k);el.addEventListener('blur',()=>check(k));el.addEventListener('input',()=>{if(el.classList.contains('bad'))check(k)})});
$('#phone').addEventListener('input',e=>{e.target.value=e.target.value.replace(/[^\d+\s]/g,'')});
$('#f').addEventListener('submit',e=>{
  e.preventDefault();
  const bad=Object.keys(rules).filter(k=>check(k));
  if(!sel){$('[data-e=size]').textContent='اختار المقاس';$('#chips').classList.add('bad')}
  const first=bad[0]?$('#'+bad[0]):(!sel?$('.chip'):null);
  if(first){first.scrollIntoView({block:'center',behavior:'smooth'});first.focus({preventScroll:true});navigator.vibrate&&navigator.vibrate([20,40,20]);return}
  const btn=$('#f .btn'),t=btn.childNodes[0].textContent;btn.disabled=true;btn.childNodes[0].textContent='جاري التأكيد…';
  setTimeout(()=>{
    btn.disabled=false;btn.childNodes[0].textContent=t;
    $('#okt').textContent=`${$('#name').value.trim()} · المقاس ${sel} · الكمية ${q} · ${money(q*CONFIG.price)} DH — عرض تجريبي، ما تسجل حتى طلب.`;
    $('#f').classList.add('hidden');$('#ok').classList.remove('hidden');$('#ok').scrollIntoView({block:'center',behavior:'smooth'});$('#ok').focus({preventScroll:true});navigator.vibrate&&navigator.vibrate(30);
  },700);
});
$('#again').onclick=()=>{$('#f').reset();q=1;sel='';$$('.chip').forEach(c=>c.setAttribute('aria-checked','false'));$$('.field').forEach(f=>f.classList.remove('ok','bad'));upd();$('#ok').classList.add('hidden');$('#f').classList.remove('hidden')};
upd();
// scroll progress
addEventListener('scroll',()=>{const d=document.documentElement;$('#prog').style.width=(100*d.scrollTop/(d.scrollHeight-d.clientHeight||1))+'%'},{passive:true});
// sticky CTA: hidden while hero CTA or order form is on screen
const st=$('#sticky'),vis={h:true,o:false};
const io=new IntersectionObserver(es=>{es.forEach(x=>{vis[x.target.id==='order'?'o':'h']=x.isIntersecting});st.classList.toggle('on',!vis.h&&!vis.o)});
io.observe($('#heroCta'));io.observe($('#order'));
// ---- animation & marketing arrows ----
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
$$('.btn[data-cta],#f .btn').forEach(b=>b.insertAdjacentHTML('beforeend','<svg class="ico nudge" aria-hidden="true"><use href="#i-arrow"/></svg>'));
if(!reduce){
  document.documentElement.classList.add('js');
  const tg=[...$$('main section:not(#hero) > *:not(ul):not(ol)'),...$$('main section:not(#hero) li')];
  tg.forEach(e=>{e.setAttribute('data-r','');if(e.tagName==='LI'){e.style.setProperty('--rd',(([...e.parentNode.children].indexOf(e))*0.1)+'s')}});
  const ob=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');ob.unobserve(x.target);if(x.target.id==='offerPrice'||x.target.contains($('#offerPrice')))countUp()}}),{threshold:.15});
  [...tg,...$$('main ol')].forEach(e=>ob.observe(e));
  let counted=false;
  function countUp(){if(counted)return;counted=true;const el=$('#offerPrice'),t0=performance.now();
    const f=t=>{const k=Math.min(1,(t-t0)/900);el.textContent=Math.round(CONFIG.price*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
}
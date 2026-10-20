// ---- Demo settings: edit here ----
const CONFIG={
  price:599,
  sizes:[40,41,42,43,44,45],
  maxQty:5,
  images:{
    hero:{src:"assets/images/nike-pegasus-41-m-chaussures-homme-717204-1-sz.png"},
    detail1:{src:"assets/images/aaaa_59c76089-d41a-4bd1-a248-3bcc416f2a86.png",x:50,y:50,s:1.0},
    gallery:[
      {src:"assets/images/nike-pegasus-41-m-chaussures-homme-717204-1-sz.png",x:50,y:50,s:1.0},
      {src:"assets/images/images.png",x:50,y:50,s:1.0},
      {src:"assets/images/aaaa_59c76089-d41a-4bd1-a248-3bcc416f2a86.png",x:50,y:50,s:1.0}
    ]
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
  const img=document.createElement('img');
  img.alt=alt||"";
  img.loading="lazy";
  img.style.width="100%";
  img.style.height="100%";
  if(o.s){
    img.style.objectFit='cover';
    img.style.transformOrigin=(o.x||50)+'% '+(o.y||50)+'%';
    img.style.transform='scale('+o.s+')';
  } else {
    img.style.objectFit='contain';
  }
  img.onerror=()=>{console.error('Failed to load image:',o.src)};
  el.innerHTML="";
  el.appendChild(img);
  img.src=o.src;
}
fill($('[data-img=hero]'),CONFIG.images.hero,"حذاء رياضي رجالي");
fill($('[data-img=detail1]'),CONFIG.images.detail1,"تفصيل الحذاء");
$$('[data-price]').forEach(e=>e.textContent=CONFIG.price);
$$('[data-sizes]').forEach(e=>e.textContent=CONFIG.sizes[0]+'–'+CONFIG.sizes.at(-1));
// gallery - عرض الصور الثلاث جنباً إلى جنب
const sl=$('#slides'),n=CONFIG.images.gallery.length;
CONFIG.images.gallery.forEach((o,i)=>{const d=document.createElement('div');d.className='media';d.style.aspectRatio='1/1';d.style.flex='1 1 calc(33.33% - 10px)';sl.appendChild(d);fill(d,o,"صورة "+(i+1))});
$('#gi').style.display='none';$('#gn').style.display='none';$('#prev').style.display='none';$('#next').style.display='none';$('#bar').style.display='none';
sl.style.overflowX='visible';sl.style.flexWrap='wrap';sl.style.gap='15px';
// faq
$('#faq').innerHTML=CONFIG.faq.map(([q,a])=>`<details class="faq"><summary class="flex items-center justify-between gap-4 min-h-[58px] cursor-pointer font-bold">${q}<svg class="ico plus"><use href="#i-plus"/></svg></summary><p class="pb-4 text-sm" style="opacity:.75">${a}</p></details>`).join('');
// form
$('#size').innerHTML='<option value="">اختار المقاس</option>'+CONFIG.sizes.map(s=>`<option>${s}</option>`).join('');
let q=1;const upd=()=>{$('#qty').textContent=q;$('#total').textContent=(q*CONFIG.price).toLocaleString('en-US')};
$('#minus').onclick=()=>{q=Math.max(1,q-1);upd()};$('#plus').onclick=()=>{q=Math.min(CONFIG.maxQty,q+1);upd()};
const phoneOk=v=>/^(?:\+212|00212|0)[5-7]\d{8}$/.test(v.replace(/[\s.-]/g,''));
const ids={name:'#name',phone:'#phone',city:'#city',addr:'#addr',size:'#size'};
$('#f').addEventListener('submit',e=>{
  e.preventDefault();
  const v={name:$('#name').value.trim(),phone:$('#phone').value.trim(),city:$('#city').value.trim(),addr:$('#addr').value.trim(),size:$('#size').value};
  const er={};
  if(v.name.length<3)er.name='كتب الاسم الكامل';
  if(!phoneOk(v.phone))er.phone='رقم غير صحيح، مثال: 0612345678';
  if(v.city.length<2)er.city='كتب المدينة';
  if(v.addr.length<6)er.addr='كتب العنوان بالتفصيل';
  if(!v.size)er.size='اختار المقاس';
  $$('[data-e]').forEach(p=>p.textContent=er[p.dataset.e]||'');
  Object.keys(ids).forEach(k=>$(ids[k]).classList.toggle('bad',!!er[k]));
  const k=Object.keys(er)[0];
  if(k){$(ids[k]).focus();return}
  $('#okt').textContent=`${v.name} · المقاس ${v.size} · الكمية ${q} · ${q*CONFIG.price} DH — عرض تجريبي، ما تسجل حتى طلب.`;
  $('#f').classList.add('hidden');$('#ok').classList.remove('hidden');$('#ok').focus();
});
$('#again').onclick=()=>{$('#f').reset();q=1;upd();$('#ok').classList.add('hidden');$('#f').classList.remove('hidden')};
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
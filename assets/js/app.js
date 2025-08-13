// ===== Data Produk =====
const PRODUCTS = [
  {id:'ck-01', name:'Cheesecake Strawberry', price:45000, category:'Cheesecake', popular:5, tags:['strawberry','fresh'], allergens:['susu','telur','gluten'], img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop'},
  {id:'ck-02', name:'Cheesecake Blueberry', price:47000, category:'Cheesecake', popular:4, tags:['blueberry'], allergens:['susu','telur','gluten'], img:'https://images.unsplash.com/photo-1542826438-1fc05aa1f250?q=80&w=1200&auto=format&fit=crop'},
  {id:'ck-03', name:'Classic Cheesecake', price:42000, category:'Cheesecake', popular:5, tags:['classic'], allergens:['susu','telur','gluten'], img:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop'},

  {id:'ch-01', name:'Chocolate Truffle Cake', price:52000, category:'Cokelat', popular:5, tags:['dark','rich'], allergens:['susu','telur','gluten'], img:'https://images.unsplash.com/photo-1599785209796-9e72a3216b47?q=80&w=1200&auto=format&fit=crop'},
  {id:'ch-02', name:'Brownies Fudgy', price:30000, category:'Cokelat', popular:4, tags:['brownies'], allergens:['telur','gluten','susu'], img:'https://images.unsplash.com/photo-1599785209793-73a130e7b2cf?q=80&w=1200&auto=format&fit=crop'},
  {id:'ch-03', name:'Chocolate Mousse', price:38000, category:'Cokelat', popular:3, tags:['mousse'], allergens:['susu','telur'], img:'https://images.unsplash.com/photo-1614707267537-f8ee35c50b1b?q=80&w=1200&auto=format&fit=crop'},

  {id:'fr-01', name:'Fruit Tart Kiwi', price:36000, category:'Buah', popular:4, tags:['tart','kiwi'], allergens:['telur','gluten'], img:'https://images.unsplash.com/photo-1561089489-f13d5e730d72?q=80&w=1200&auto=format&fit=crop'},
  {id:'fr-02', name:'Fruit Tart Mix Berry', price:39000, category:'Buah', popular:5, tags:['berry'], allergens:['telur','gluten'], img:'https://images.unsplash.com/photo-1562440499-64c9a111f713?q=80&w=1200&auto=format&fit=crop'},
  {id:'fr-03', name:'Pineapple Cake', price:34000, category:'Buah', popular:3, tags:['nanas'], allergens:['gluten','telur'], img:'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop'},

  {id:'cp-01', name:'Cupcake Vanilla', price:18000, category:'Cupcake', popular:4, tags:['vanilla'], allergens:['telur','susu','gluten'], img:'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=1200&auto=format&fit=crop'},
  {id:'cp-02', name:'Cupcake Red Velvet', price:22000, category:'Cupcake', popular:5, tags:['red velvet'], allergens:['telur','susu','gluten'], img:'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop'},
  {id:'cp-03', name:'Cupcake Cokelat', price:20000, category:'Cupcake', popular:4, tags:['choco'], allergens:['telur','susu','gluten'], img:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200&auto=format&fit=crop'}
];

const rupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(n);

// ===== Slider =====
let current = 0;
const slidesWrap = document.querySelector('.slides');
const slides = Array.from(document.querySelectorAll('.slide'));
const dotsWrap = document.getElementById('sliderDots');

function goto(idx){
  current = (idx+slides.length)%slides.length;
  slidesWrap.style.transform = `translateX(-${current*100}%)`;
  document.querySelectorAll('.dots button').forEach((d,i)=>d.classList.toggle('is-active', i===current));
}
slides.forEach((_,i)=>{
  const b = document.createElement('button');
  b.addEventListener('click',()=>goto(i));
  if(i===0) b.classList.add('is-active');
  dotsWrap.appendChild(b);
});
document.getElementById('prevSlide').addEventListener('click',()=>goto(current-1));
document.getElementById('nextSlide').addEventListener('click',()=>goto(current+1));
setInterval(()=>goto(current+1), 5000);

// ===== Search Overlay =====
const openSearch = document.getElementById('openSearch');
const closeSearch = document.getElementById('closeSearch');
const searchLayer = document.getElementById('searchLayer');
const searchInput = document.getElementById('searchInput');
openSearch.addEventListener('click', ()=>{ searchLayer.classList.add('show'); searchInput.focus(); });
closeSearch.addEventListener('click', ()=>{ searchLayer.classList.remove('show'); searchInput.value=''; render(); });

// ===== Tabs + Sorting + Grid =====
let state = {cat:'Semua', q:'', sort:'popular', cart: loadCart()};
document.querySelectorAll('.chip').forEach(c=>{
  c.addEventListener('click', ()=>{
    document.querySelectorAll('.chip').forEach(x=>x.classList.remove('is-active'));
    c.classList.add('is-active');
    state.cat = c.dataset.cat;
    render();
  });
});
document.getElementById('sortSelect').addEventListener('change', (e)=>{
  state.sort = e.target.value;
  render();
});
searchInput.addEventListener('input', (e)=>{ state.q = e.target.value.trim().toLowerCase(); render(); });

function getFiltered(){
  let items = [...PRODUCTS];
  if(state.cat!=='Semua') items = items.filter(p=>p.category===state.cat);
  if(state.q) items = items.filter(p=> p.name.toLowerCase().includes(state.q) || p.tags.some(t=>t.includes(state.q)));
  switch(state.sort){
    case 'price-asc': items.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': items.sort((a,b)=>b.price-a.price); break;
    case 'name-asc': items.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case 'name-desc': items.sort((a,b)=>b.name.localeCompare(a.name)); break;
    default: items.sort((a,b)=>b.popular-a.popular);
  }
  return items;
}

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');

function render(){
  const items = getFiltered();
  grid.innerHTML = '';
  empty.hidden = items.length>0;
  items.forEach((p,i)=>{
    const el = document.createElement('article');
    el.className = 'card reveal';
    el.style.transitionDelay = (i*0.02)+'s';
    el.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <div class="content">
        <h3 class="title">${p.name}</h3>
        <div class="meta">
          <span class="price">${rupiah(p.price)}</span>
          <span class="tag">${p.category}</span>
        </div>
        <div class="meta">
          <small>${p.allergens.map(a=>`<span class='badge'>${a}</span>`).join(' ')}</small>
          <small class="fresh">🟢 Fresh Today</small>
        </div>
        <div class="actions">
          <button class="btn small" data-add="${p.id}">Tambah</button>
          <button class="btn small" data-detail="${p.id}">Detail</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
  // wire
  document.querySelectorAll('[data-add]').forEach(b=> b.addEventListener('click', ()=> addToCart(b.dataset.add)));
  document.querySelectorAll('[data-detail]').forEach(b=> b.addEventListener('click', ()=> showDetail(b.dataset.detail)));
  revealObserve();
}
render();

// ===== Reveal on scroll =====
const obs = new IntersectionObserver((ent)=>{
  ent.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); obs.unobserve(e.target); } });
},{threshold:.08});
function revealObserve(){ document.querySelectorAll('.reveal').forEach(el=>obs.observe(el)); }
revealObserve();

// ===== Detail (simple) =====
function showDetail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  alert(`${p.name}\nHarga: ${rupiah(p.price)}\nKategori: ${p.category}\nAlergen: ${p.allergens.join(', ')}`);
}

// ===== Roulette (Signature) =====
const rcImg = document.getElementById('rcImg');
const rcName = document.getElementById('rcName');
const rcPrice = document.getElementById('rcPrice');
const rcAdd = document.getElementById('rcAdd');
const rcShuffle = document.getElementById('rcShuffle');
let rcPick = PRODUCTS[0];
function shuffle(){
  rcPick = PRODUCTS[Math.floor(Math.random()*PRODUCTS.length)];
  rcImg.src = rcPick.img; rcImg.alt = rcPick.name;
  rcName.textContent = rcPick.name;
  rcPrice.textContent = rupiah(rcPick.price);
}
shuffle();
rcShuffle.addEventListener('click', shuffle);
rcAdd.addEventListener('click', ()=> addToCart(rcPick.id));

// ===== Cart =====
const cartBtn = document.getElementById('openCart');
const cartDim = document.getElementById('cartDim');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
const cartBody = document.getElementById('cartBody');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout');

function loadCart(){ try{return JSON.parse(localStorage.getItem('sc-cart')||'{}')}catch(e){return{}} }
function saveCart(){ localStorage.setItem('sc-cart', JSON.stringify(state.cart)); }
function addToCart(id,qty=1){
  state.cart[id]=(state.cart[id]||0)+qty;
  saveCart(); renderCart(); confetti(cartBtn);
}
function removeFromCart(id){ delete state.cart[id]; saveCart(); renderCart(); }
function setQty(id,qty){ if(qty<=0) removeFromCart(id); else { state.cart[id]=qty; saveCart(); renderCart(); } }
function cartItems(){
  return Object.entries(state.cart).map(([id,qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    return p? {...p, qty, total: p.price*qty} : null;
  }).filter(Boolean);
}
function totals(){
  const items = cartItems();
  const subtotal = items.reduce((s,i)=>s+i.total,0);
  const tax = Math.round(subtotal*0.11);
  return {subtotal, tax, total: subtotal+tax};
}
function renderCart(){
  const items = cartItems();
  cartBody.innerHTML = items.length? '' : '<div style="text-align:center;color:#6c757d;padding:30px">Keranjang kosong. Yuk tambahkan kue favoritmu! 🍰</div>';
  items.forEach(it=>{
    const row = document.createElement('div');
    row.className = 'ci';
    row.innerHTML = `
      <div style="display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;padding:10px;border-bottom:1px solid var(--soft)">
        <img src="${it.img}" alt="${it.name}" style="width:64px;height:64px;object-fit:cover;border-radius:10px">
        <div>
          <strong>${it.name}</strong>
          <div style="color:#6c757d;font-size:.9rem">${rupiah(it.price)} × ${it.qty} = <b>${rupiah(it.total)}</b></div>
          <div style="display:flex;gap:6px;margin-top:6px">
            <button data-dec="${it.id}">−</button>
            <span style="min-width:26px;text-align:center">${it.qty}</span>
            <button data-inc="${it.id}">+</button>
            <button data-del="${it.id}" style="margin-left:auto">Hapus</button>
          </div>
        </div>
        <div><b>${rupiah(it.total)}</b></div>
      </div>
    `;
    cartBody.appendChild(row);
  });
  const t = totals();
  subtotalEl.textContent = rupiah(t.subtotal);
  taxEl.textContent = rupiah(t.tax);
  totalEl.textContent = rupiah(t.total);
  cartCount.textContent = Object.values(state.cart).reduce((s,n)=>s+n,0);

  // wire
  cartBody.querySelectorAll('[data-inc]').forEach(b=> b.addEventListener('click', ()=> setQty(b.dataset.inc, (state.cart[b.dataset.inc]||0)+1)));
  cartBody.querySelectorAll('[data-dec]').forEach(b=> b.addEventListener('click', ()=> setQty(b.dataset.dec, (state.cart[b.dataset.dec]||0)-1)));
  cartBody.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', ()=> removeFromCart(b.dataset.del)));
}
renderCart();

function openCart(){ document.body.classList.add('cart-open'); cartPanel.style.right='0'; cartDim.style.opacity='1'; cartDim.style.pointerEvents='auto'; }
function closeCartPanel(){ document.body.classList.remove('cart-open'); cartPanel.style.right='-420px'; cartDim.style.opacity='0'; cartDim.style.pointerEvents='none'; }
cartBtn.addEventListener('click', openCart);
cartDim.addEventListener('click', closeCartPanel);
closeCart.addEventListener('click', closeCartPanel);

// ===== Checkout via WhatsApp =====
checkoutBtn.addEventListener('click', ()=>{
  const items = cartItems();
  if(!items.length){ alert('Keranjang masih kosong.'); return; }
  const t = totals();
  const lines = items.map(i=>`• ${i.name} x ${i.qty} = ${rupiah(i.total)}`).join('%0A');
  const msg = `Halo SweetCrumbs!%0ASaya mau pesan:%0A${lines}%0A%0ASubtotal: ${rupiah(t.subtotal)}%0APPN 11%: ${rupiah(t.tax)}%0ATotal: ${rupiah(t.total)}%0A%0ANama:%0AAlamat:%0AMetode bayar:`;
  // Ganti nomor WA di bawah ini
  const wa = '6281234567890';
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
});

// ===== Confetti mini (canvas-less) =====
function confetti(target){
  const rect = target.getBoundingClientRect();
  for(let i=0;i<12;i++){
    const p = document.createElement('i');
    p.style.position='fixed';
    p.style.left = (rect.left + rect.width/2)+'px';
    p.style.top = (rect.top)+'px';
    p.style.width='6px'; p.style.height='10px';
    p.style.background = ['#111827','#9ca3af','#6b7280','#374151'][i%4];
    p.style.transform=`rotate(${Math.random()*360}deg)`;
    p.style.opacity='1';
    p.style.borderRadius='2px';
    p.style.transition='transform .7s ease, opacity .7s ease';
    document.body.appendChild(p);
    requestAnimationFrame(()=>{
      p.style.transform=`translate(${(Math.random()*2-1)*120}px, ${80+Math.random()*80}px) rotate(${Math.random()*360}deg)`;
      p.style.opacity='0';
    });
    setTimeout(()=>p.remove(), 800);
  }
}

// ===== Year footer =====
document.getElementById('year').textContent = new Date().getFullYear();

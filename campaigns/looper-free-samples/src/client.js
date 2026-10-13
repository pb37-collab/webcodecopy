/* global CONFIG, SHIP_STATES, PRODUCT */
/* Looper free-sample lander. Settings live in the CONFIG block above this script. */
const NOT_LISTED = '__none';
const $ = id => document.getElementById(id);
const money = n => '$' + Number(n).toFixed(2);
const flavorBy = slug => PRODUCT.flavors.find(f => f.slug === slug);
const isPlaceholder = u => !u || /PLACEHOLDER/i.test(u);
const isLive = () => Boolean(CONFIG.KLAVIYO_COMPANY_ID && CONFIG.KLAVIYO_LIST_ID);
const STORE_KEY = 'looper_sample_' + PRODUCT.id;
const offerEnd = CONFIG.END ? new Date(CONFIG.END).getTime() : 0;
const isClosed = () => CONFIG.SOLD_OUT === true || (offerEnd > 0 && Date.now() >= offerEnd);

// UTM tags from the ad, kept for this tab so they survive a reload.
const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','ttclid'];
const utm = (() => {
  let saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('looper_utm') || '{}'); } catch { saved = {}; }
  const q = new URLSearchParams(location.search), found = {};
  UTM_KEYS.forEach(k => { const v = q.get(k); if (v) found[k] = v.slice(0, 120); });
  const all = Object.keys(found).length ? found : saved;
  try { sessionStorage.setItem('looper_utm', JSON.stringify(all)); } catch { /* storage blocked */ }
  return all;
})();

function checkoutUrl(slug, email, state){
  const raw = (CONFIG.CHECKOUT || {})[slug];
  if (isPlaceholder(raw)) return null;
  let u = raw.replace(/\{email\}/g, encodeURIComponent(email || ''))
             .replace(/\{flavor\}/g, encodeURIComponent(slug))
             .replace(/\{state\}/g, encodeURIComponent(state || ''));
  if (CONFIG.PASS_UTM) {
    try {
      const url = new URL(u, location.href);
      Object.entries(utm).forEach(([k, v]) => { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
      u = url.toString();
    } catch { /* leave the URL as written */ }
  }
  return u;
}

/* ---------- setup: fill config-driven text ---------- */
(function(){
  document.querySelectorAll('[data-ship]').forEach(e => e.textContent = money(CONFIG.SHIPPING));
  document.querySelectorAll('[data-retail]').forEach(e => e.textContent = money(CONFIG.RETAIL));
  document.querySelectorAll('[data-supply]').forEach(e => e.textContent = CONFIG.SUPPLY);
  document.querySelectorAll('[data-ship-states]').forEach(e => e.textContent = SHIP_STATES.join(', '));
  document.querySelectorAll('[data-state-count]').forEach(e => e.textContent = SHIP_STATES.length);
  $('year').textContent = new Date().getFullYear();

  // Optional "X left" meter, only when the team sets CONFIG.LEFT by hand.
  const left = Number(CONFIG.LEFT);
  if (CONFIG.LEFT !== null && CONFIG.LEFT !== '' && Number.isFinite(left) && left >= 0 && CONFIG.SUPPLY > 0) {
    $('supplyLine').innerHTML = 'Only <b>' + left + '</b> of ' + CONFIG.SUPPLY + ' free ' + PRODUCT.unitPlural + ' left';
    const m = $('supplyMeter'); m.hidden = false;
    m.firstElementChild.style.setProperty('--p', Math.max(3, Math.min(100, left / CONFIG.SUPPLY * 100)) + '%');
  }

  const sel = $('state');
  SHIP_STATES.forEach(s => sel.add(new Option(s, s)));
  sel.add(new Option("My state isn't listed", NOT_LISTED));
  sel.addEventListener('change', () => {
    const m = $('formMsg');
    sel.removeAttribute('aria-invalid');
    if (sel.value === NOT_LISTED) { m.textContent = "Sorry, we can't ship Looper products to your state yet, so we can't send you a sample. Follow along for future drops!"; m.className = 'msg err'; }
    else if (m.textContent.startsWith("Sorry, we can't ship")) { m.textContent = ''; m.className = 'msg'; }
  });

  // Sold-out flavors
  (CONFIG.SOLD_OUT_FLAVORS || []).forEach(slug => {
    const r = $('f-' + slug); if (r) { r.disabled = true; r.checked = false; }
    document.querySelectorAll('[data-pick="' + slug + '"]').forEach(b => { b.textContent = 'All Gone'; b.setAttribute('aria-disabled', 'true'); });
  });

  // "As featured on" logos, straight from the looperverse.com homepage strip
  const logos = [['laweekly3xWHITE-1.png',1],['cbdorigin3xWHITE-1.png',1],['candid3xWHITE-1.png',1.3],['TheBluntness-1.png',1.6],['logo-leaflywhite.png',1],['weed-republic-logo-large-1.png',1],['neonjoint3xWHITE-1.png',1.15]];
  $('logos').innerHTML = [...logos, ...logos].map(([f, k]) => '<img src="https://looperverse.com/wp-content/uploads/2025/02/' + f + '" alt="" loading="lazy"' + (k !== 1 ? ' style="transform:scale(' + k + ')"' : '') + '>').join('');

  // Swap the fake outline stroke off once the real Akira Outline font is available
  if (document.fonts) document.fonts.load('20px "AkiraOutline"').then(f => { if (f.length) document.documentElement.classList.add('akira'); }).catch(() => {});

  // Scroll reveals
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.12}) : null;
  document.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));
})();

/* ---------- starfield: slow drift toward the viewer ---------- */
(function(){
  const c = $('stars'), x = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h;
  const stars = [];
  function size(){ w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio; }
  function mk(){ return {x:(Math.random()-.5)*w, y:(Math.random()-.5)*h, z:Math.random()*w, hue:Math.random()<.15 ? (Math.random()<.5?'2,169,225':'231,9,128') : '255,255,255'}; }
  size(); addEventListener('resize', size);
  const N = innerWidth < 600 ? 110 : 220;
  for (let i=0;i<N;i++) stars.push(mk());
  function frame(){
    x.clearRect(0,0,w,h);
    for (const s of stars){
      if (!still){ s.z -= 1.1*devicePixelRatio; if (s.z <= 1) Object.assign(s, mk(), {z:w}); }
      const k = 260*devicePixelRatio / s.z, px = s.x*k + w/2, py = s.y*k + h/2;
      if (px<0||px>w||py<0||py>h) continue;
      const r = Math.max(.3, (1 - s.z/w) * 2.2 * devicePixelRatio);
      x.fillStyle = 'rgba(' + s.hue + ',' + Math.min(1, 1.2 - s.z/w) + ')';
      x.beginPath(); x.arc(px,py,r,0,6.283); x.fill();
    }
    if (!still) requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- optional countdown (CONFIG.END) ---------- */
(function(){
  if (!offerEnd) return;
  $('cdWrap').hidden = false;
  let timer;
  function tick(){
    const diff = Math.max(0, offerEnd - Date.now());
    $('cd-d').textContent = Math.floor(diff/864e5);
    $('cd-h').textContent = String(Math.floor(diff%864e5/36e5)).padStart(2,'0');
    $('cd-m').textContent = String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
    $('cd-s').textContent = String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
    if (!diff) { clearInterval(timer); closeOffer(); }
  }
  tick(); timer = setInterval(tick, 1000);
})();

/* ---------- closed state (SOLD_OUT, or past END) ---------- */
function closeOffer(){
  $('claimForm').hidden = true;
  $('successBox').style.display = 'none';
  $('closedBox').hidden = false;
  document.querySelector('.live').textContent = 'Gone';
  document.querySelector('.ann-tag').textContent = 'Drop Closed';
  $('cdWrap').hidden = true;
  document.querySelectorAll('[data-claim-link]').forEach(a => { a.textContent = 'Shop ' + PRODUCT.shortName; a.href = PRODUCT.productUrl; });
  document.body.classList.add('is-closed');
}
if (isClosed()) closeOffer();

/* ---------- claim form ---------- */
(function(){
  const form = $('claimForm'), grid = $('flavGrid'), email = $('email'), state = $('state'), agree = $('agree'), btn = $('submitBtn'), msg = $('formMsg');
  const btnHTML = btn.innerHTML;
  const radios = [...grid.querySelectorAll('input[name=flavor]')];
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const err = t => { msg.textContent = t; msg.className = 'msg err'; };
  const clr = () => { msg.textContent = ''; msg.className = 'msg'; };
  const selected = () => (radios.find(r => r.checked) || {}).value || '';
  let claimed = false;

  function showPick(slug){
    const f = flavorBy(slug);
    grid.classList.remove('err');
    $('pickNote').classList.remove('err');
    if (!f) return;
    $('pickNote').innerHTML = '<b>' + f.name + (f.strain ? ' · ' + f.strain : '') + '</b>' + f.note;
    $('sumFlavor').textContent = '· ' + f.name;
    const st = $('sticky');
    st.querySelector('.thumb').style.setProperty('--img', 'var(--f-' + slug + ')');
    st.querySelector('.s-txt b').textContent = f.name;
    if (msg.textContent === 'Pick your flavor first.') clr();
  }
  function pick(slug){
    const r = $('f-' + slug);
    if (!r || r.disabled) return false;
    r.checked = true; showPick(slug);
    return true;
  }
  radios.forEach(r => r.addEventListener('change', () => showPick(r.value)));

  // Deep link from an ad: ?flavor=watermelon-punch
  const fromUrl = (new URLSearchParams(location.search).get('flavor') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (fromUrl) pick(fromUrl);

  // "Claim this flavor" buttons further down the page
  document.querySelectorAll('[data-pick]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault();
    if (b.getAttribute('aria-disabled') === 'true' || isClosed()) return;
    pick(b.dataset.pick);
    $('claim').scrollIntoView({behavior:'smooth', block:'start'});
  }));

  [email, state].forEach(i => i.addEventListener('input', () => i.removeAttribute('aria-invalid')));
  agree.addEventListener('change', () => agree.closest('.check').classList.remove('err'));

  // Same browser came back: offer a straight path to checkout.
  try {
    const prev = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    const f = prev && flavorBy(prev.flavor);
    if (f && !isClosed()) {
      const url = checkoutUrl(prev.flavor, prev.email, prev.state);
      const box = $('returning');
      box.innerHTML = 'You already locked in <b>' + f.name + '</b>.' + (url ? ' <a href="' + url.replace(/"/g, '&quot;') + '">Finish checkout →</a>' : '');
      box.hidden = false;
    }
  } catch { /* storage blocked */ }

  form.addEventListener('submit', async e => {
    e.preventDefault(); clr();
    if ($('website').value || claimed || isClosed()) return;
    const slug = selected();
    const val = email.value.trim().toLowerCase();
    const problems = [];
    if (!slug) {
      grid.classList.add('err');
      $('pickNote').classList.add('err');
      $('pickNote').innerHTML = '<b>Pick your flavor first</b>Tap one above to lock it in.';
      problems.push([radios.find(r => !r.disabled) || radios[0], 'Pick your flavor first.']);
    }
    if (!validEmail(val)) { email.setAttribute('aria-invalid','true'); problems.push([email,'Enter a valid email address.']); }
    if (!state.value) { state.setAttribute('aria-invalid','true'); problems.push([state,'Pick your state so we know we can ship to you.']); }
    else if (!SHIP_STATES.includes(state.value)) { state.setAttribute('aria-invalid','true'); problems.push([state,"Sorry, we can't ship Looper products to your state yet, so we can't send you a sample."]); }
    if (!agree.checked) { agree.closest('.check').classList.add('err'); problems.push([agree,'Confirm you\'re 21+ to claim.']); }
    if (problems.length) {
      err(problems[0][1]);
      const el = problems[0][0];
      el.focus({preventScroll:true});
      (el.type === 'radio' ? grid : el).scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }

    claimed = true;
    btn.disabled = true; btn.textContent = 'Locking it in…';
    const f = flavorBy(slug);
    const url = checkoutUrl(slug, val, state.value);
    try { localStorage.setItem(STORE_KEY, JSON.stringify({flavor:slug, email:val, state:state.value, at:Date.now()})); } catch { /* storage blocked */ }

    // Email capture never blocks checkout: wait at most CAPTURE_TIMEOUT_MS, then move on.
    await Promise.race([
      capture({email:val, state:state.value, flavor:f, checkout:url}).catch(ex => console.error('[free-sample] Klaviyo', ex)),
      new Promise(r => setTimeout(r, CONFIG.CAPTURE_TIMEOUT_MS || 2500))
    ]);
    if (window.fbq) window.fbq('track', 'Lead', {content_name: PRODUCT.fullName + ' Free Sample', content_category:'free_sample', content_ids:[slug], value:0, currency:'USD'});
    if (window.gtag) window.gtag('event', 'generate_lead', {currency:'USD', value:0, items:[{item_id:PRODUCT.id + '-' + slug, item_name:PRODUCT.fullName + ' (' + f.name + ')'}]});
    if (window.dataLayer) window.dataLayer.push({event:'free_sample_claim', sample:PRODUCT.id, flavor:slug});

    showSuccess(f, url);
  });

  function showSuccess(f, url){
    form.style.display = 'none';
    const box = $('successBox');
    box.style.display = 'block';
    $('lockArt').style.setProperty('--img', 'var(--f-' + f.slug + ')');
    $('lockArt').style.setProperty('--glow', f.glow);
    $('successFlavor').textContent = f.name;
    const go = $('checkoutBtn');
    $('sticky').classList.remove('show');
    document.body.classList.add('is-claimed');
    $('claim').scrollIntoView({behavior:'smooth', block:'start'});
    if (url) {
      go.href = url;
      requestAnimationFrame(() => { $('redirectBar').firstElementChild.style.width = '100%'; });
      setTimeout(() => { location.href = url; }, 1300);
    } else {
      // Preview mode: checkout links are still placeholders.
      go.removeAttribute('href'); go.setAttribute('aria-disabled', 'true');
      go.innerHTML = 'Checkout link not set';
      $('redirectBar').hidden = true;
      $('successText').innerHTML = 'Live, this step sends them straight to checkout for <b>' + f.name + '</b>: $0 for the ' + PRODUCT.unit + ', <b>' + money(CONFIG.SHIPPING) + '</b> shipping.';
      $('previewNote').hidden = false;
      $('previewNote').innerHTML = '<b>Preview mode.</b> ' + (isLive() ? '' : 'No Klaviyo list is set, so nothing was sent. ') + 'Add this flavor\'s link to <code>CONFIG.CHECKOUT[\'' + f.slug + '\']</code> to turn on the redirect.';
    }
    $('changeBtn').onclick = () => {
      claimed = false;
      box.style.display = 'none'; form.style.display = '';
      btn.disabled = false; btn.innerHTML = btnHTML;
      document.body.classList.remove('is-claimed');
    };
  }

  /* Klaviyo client API: subscribe to the list, then log a "Claimed Free Sample" event to trigger flows.
     Docs: developers.klaviyo.com/en/reference/create_client_subscription and create_client_event */
  async function capture(p){
    if (!isLive()) {
      console.warn('[free-sample] KLAVIYO_LIST_ID not set. Preview mode, nothing sent.', p);
      await new Promise(r => setTimeout(r, 500));
      return;
    }
    const base = 'https://a.klaviyo.com/client/', q = '/?company_id=' + encodeURIComponent(CONFIG.KLAVIYO_COMPANY_ID);
    const headers = {'Content-Type':'application/json', 'revision':'2024-10-15'};
    const now = new Date().toISOString();
    const props = {
      free_sample: PRODUCT.fullName,
      free_sample_key: PRODUCT.sampleKey,
      free_sample_flavor: p.flavor.name,
      free_sample_claimed_at: now,
      age_confirmed_21: true,
      ...Object.fromEntries(Object.entries(utm).map(([k, v]) => ['free_sample_' + k, v]))
    };
    const sub = fetch(base + 'subscriptions' + q, {
      method:'POST', headers, keepalive:true,
      body: JSON.stringify({ data: {
        type:'subscription',
        attributes: {
          custom_source: CONFIG.KLAVIYO_SOURCE,
          profile: { data: { type:'profile', attributes: {
            email: p.email,
            location: { region: p.state, country: 'United States' },
            properties: props
          } } }
        },
        relationships: { list: { data: { type:'list', id: CONFIG.KLAVIYO_LIST_ID } } }
      } })
    });
    const evt = CONFIG.KLAVIYO_EVENT ? fetch(base + 'events' + q, {
      method:'POST', headers, keepalive:true,
      body: JSON.stringify({ data: {
        type:'event',
        attributes: {
          properties: { sample: PRODUCT.fullName, sample_key: PRODUCT.sampleKey, flavor: p.flavor.name, flavor_slug: p.flavor.slug, shipping: CONFIG.SHIPPING, retail_value: CONFIG.RETAIL, state: p.state, checkout_url: p.checkout || '', ...utm },
          metric: { data: { type:'metric', attributes: { name: CONFIG.KLAVIYO_EVENT } } },
          profile: { data: { type:'profile', attributes: { email: p.email } } },
          value: 0,
          unique_id: PRODUCT.id + ':' + p.email
        }
      } })
    }) : Promise.resolve();
    const [a] = await Promise.allSettled([sub, evt]);
    if (a.status === 'rejected' || !(a.value.status === 202 || a.value.ok)) throw new Error('Klaviyo subscribe ' + (a.value ? a.value.status : a.reason));
  }

  /* ---------- sticky claim bar (phones) ---------- */
  const sticky = $('sticky'), card = $('claim');
  let cardSeen = false;
  const update = () => sticky.classList.toggle('show', !cardSeen && !document.body.classList.contains('is-claimed') && innerWidth <= 980);
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { cardSeen = e.isIntersecting; update(); }, {threshold:.12}).observe(card);
  addEventListener('resize', update);
  sticky.querySelector('a').addEventListener('click', e => {
    if (isClosed()) return;
    e.preventDefault();
    const target = selected() ? (email.value ? card : email) : grid;
    target.scrollIntoView({behavior:'smooth', block: target === card ? 'start' : 'center'});
  });
  setTimeout(update, 400);
})();

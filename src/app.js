import { property, places, placeCategories } from './config.js';
import { content } from './content.js';
import { departureDate, localDate, enquiryMessage } from './booking.js';
import { distanceMeters, walkMinutes, formatDistance } from './geo.js';
import { icons, mark } from './icons.js';
import { mountGallery } from './gallery3d.js';
import { createMap, usesMapbox } from './map.js';

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } }
};
let lang = storage.get('smart-studio-language') === 'es' ? 'es' : 'en';
let gallery, mapView, mapObserver, activeCat = 'all';
const isLive = () => !property.preview && /^\d{10,15}$/.test(property.whatsapp || '') && property.legalOwner && property.privacyEmail;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

const sortedPlaces = () => places
  .map(p => ({ ...p, meters: distanceMeters(property.location, p) }))
  .sort((a, b) => a.meters - b.meters);

function placeRow(p, t) {
  return `<li data-cat="${p.cat}"><button type="button" class="place" data-place="${p.id}">
    <span class="place-dot dot-${p.cat}" aria-hidden="true"></span>
    <span class="place-name">${esc(p.name)}<small>${esc(p[lang])}</small></span>
    <span class="place-time">${walkMinutes(p.meters)} ${t.walk}<small>${formatDistance(p.meters, lang)}</small></span>
  </button></li>`;
}

function render() {
  const t = content[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelector('.skip-link').textContent = t.skip;
  const kitIcons = [icons.plane, icons.breakfast, icons.coffee];
  const extraIcons = [icons.sparkle, icons.drop, icons.tv];
  const smartIcons = [icons.key, icons.voice, icons.desk, icons.wifi];
  const guideIcons = [icons.fork, icons.compass, icons.heart, icons.route];
  const list = sortedPlaces();
  const months = Array.from({ length: property.maximumMonths }, (_, i) => i + 1);

  const title = ([a, b], tag = 'h2', id = '') => `<${tag}${id ? ` id="${id}"` : ''} class="title"><span>${a}</span> <span class="title-accent">${b}</span></${tag}>`;

  document.querySelector('#app').innerHTML = `
    <p class="preview-bar">${t.preview}</p>
    <header class="header">
      <div class="wrap header-inner">
        <a href="#top" class="brand" aria-label="Smart Studio">${mark}<span>Smart Studio<small>Bogotá, Colombia</small></span></a>
        <nav class="nav" aria-label="Main">
          <a href="#welcome">${t.nav[0]}</a><a href="#studio">${t.nav[1]}</a><a href="#neighborhood">${t.nav[2]}</a><a href="#host">${t.nav[3]}</a>
        </nav>
        <div class="header-actions">
          <button type="button" class="lang" aria-label="${t.language}">${t.languageShort}</button>
          <a class="button button-small" href="#enquiry">${t.cta}</a>
          <button type="button" class="menu-toggle" aria-label="${t.menu}" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
        </div>
      </div>
      <nav class="mobile-nav" id="mobile-nav" hidden aria-label="Mobile">
        <a href="#welcome">${t.nav[0]}</a><a href="#studio">${t.nav[1]}</a><a href="#neighborhood">${t.nav[2]}</a><a href="#host">${t.nav[3]}</a><a href="#enquiry">${t.cta}</a>
      </nav>
    </header>

    <main id="main">
      <section class="hero" id="top" aria-labelledby="hero-title">
        <img class="hero-bg" src="/assets/living.jpg" alt="" width="2000" height="1500" fetchpriority="high">
        <div class="wrap hero-copy">
          <p class="kicker">${t.kickers.hero}</p>
          ${title(t.heroTitle, 'h1', 'hero-title')}
          <p class="lead">${t.heroText}</p>
          <div class="actions">
            <a class="button button-gold" href="#welcome">${t.heroSecondary}${icons.arrow}</a>
            <a class="button button-light" href="#enquiry">${t.cta}</a>
          </div>
          <dl class="facts">${t.facts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
        </div>
      </section>

      <section class="kit" id="welcome" aria-labelledby="kit-title">
        <div class="wrap">
          <div class="kit-card">
            <div class="kit-head">
              <div><p class="kicker">${t.kickers.kit}</p>${title(t.kitTitle, 'h2', 'kit-title')}</div>
              <span class="tag">${icons.check}${t.kitLabel}</span>
            </div>
            <ul class="kit-list">${t.kit.map(([a, b], i) => `<li class="reveal"><span class="kit-icon">${kitIcons[i]}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('')}</ul>
            <p class="kit-close">${t.welcomeText}</p>
          </div>
        </div>
      </section>

      <section class="intro" aria-labelledby="intro-title">
        <div class="wrap split">
          <div>
            <p class="kicker">${t.kickers.intro}</p>
            ${title(t.introTitle, 'h2', 'intro-title')}
            <p class="lead">${t.introText}</p>
            <dl class="mini-facts">${t.introFacts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>
          </div>
          <figure class="photo photo-tall reveal"><img src="/assets/studio.jpg" alt="${esc(property.photos[5][lang])}" loading="lazy"><figcaption>${t.photoNote}</figcaption></figure>
        </div>
      </section>

      <section class="comfort" aria-labelledby="extras-title">
        <div class="wrap">
          <div class="section-head">
            <p class="kicker">${t.kickers.comfort}</p>
            ${title(t.extrasTitle, 'h2', 'extras-title')}
            <p class="lead">${t.extrasText}</p>
          </div>
          <ul class="cards">${t.extras.map(([a, b], i) => `<li class="card reveal"><div class="card-top">${extraIcons[i]}<span class="tag tag-quiet">${t.included}</span></div><h3>${a}</h3><p>${b}</p></li>`).join('')}</ul>
        </div>
      </section>

      <section class="studio" id="studio" aria-labelledby="studio-title">
        <div class="wrap">
          <div class="section-head on-dark">
            <p class="kicker">${t.kickers.studio}</p>
            ${title(t.studioTitle, 'h2', 'studio-title')}
            <p class="lead">${t.studioText}</p>
          </div>
          <div class="ring-gallery" aria-roledescription="carousel" aria-label="${t.nav[1]}">
            <div class="ring-stage">
              <div class="ring">
                ${property.photos.map((p, i) => `<button type="button" class="ring-item" data-index="${i}" data-caption="${esc(p[lang])}" aria-label="${t.open}: ${esc(p[lang])}">
                  <img src="${p.src}" alt="${esc(p[lang])}" loading="lazy" draggable="false"></button>`).join('')}
              </div>
            </div>
            <div class="ring-controls">
              <button type="button" class="icon-button ring-prev" aria-label="${t.prev}">${icons.left}</button>
              <p><span class="ring-caption" aria-live="polite"></span><span class="ring-count"></span></p>
              <button type="button" class="icon-button ring-next" aria-label="${t.next}">${icons.right}</button>
            </div>
          </div>
          <ul class="pills">${t.specs.map(s => `<li>${s}</li>`).join('')}</ul>
          <p class="note">${t.specsNote} ${t.studioHint}</p>
        </div>
      </section>

      <section class="smart" aria-labelledby="smart-title">
        <div class="wrap split">
          <div>
            <p class="kicker">${t.kickers.smart}</p>
            ${title(t.smartTitle, 'h2', 'smart-title')}
            <p class="lead">${t.smartText}</p>
            <ul class="feature-grid">${t.smart.map(([a, b], i) => `<li class="reveal">${smartIcons[i]}<h3>${a}</h3><p>${b}</p></li>`).join('')}</ul>
            <p class="note">${t.smartNote}</p>
          </div>
          <figure class="photo reveal"><img src="/assets/workspace.jpg" alt="${esc(property.photos[3][lang])}" loading="lazy"><figcaption>${t.photoNote}</figcaption></figure>
        </div>
      </section>

      <section class="hood" id="neighborhood" aria-labelledby="map-title">
        <div class="wrap">
          <div class="section-head hood-head">
            <div><p class="kicker">${t.kickers.hood}</p>${title(t.mapTitle, 'h2', 'map-title')}</div>
            <p class="lead">${t.mapText}</p>
          </div>
          <div class="chips" role="toolbar" aria-label="${t.cats.all}">
            ${['all', ...placeCategories].map(c => `<button type="button" class="chip${c === activeCat ? ' is-on' : ''}" data-cat="${c}" aria-pressed="${c === activeCat}">${c === 'all' ? '' : `<span class="place-dot dot-${c}" aria-hidden="true"></span>`}${t.cats[c]}</button>`).join('')}
          </div>
          <div class="hood-grid">
            <div class="map-shell">
              <div class="map" id="map" role="region" aria-label="${t.mapTitle.join(' ')}"></div>
              <button type="button" class="map-poster">${icons.pin}<span>${t.mapLoad}</span></button>
              <div class="map-actions">
                <button type="button" class="button button-small map-orbit">${icons.orbit}${t.mapOrbit}</button>
                <button type="button" class="button button-small button-light map-reset">${t.mapReset}</button>
              </div>
              ${usesMapbox() && property.mapboxSatellite ? `<div class="map-views" role="group" aria-label="${t.mapTitle.join(' ')}">${Object.entries(t.mapViews).map(([k, v], i) => `<button type="button" class="map-view" data-view="${k}" aria-pressed="${i === 0}">${v}</button>`).join('')}</div>` : ''}
            </div>
            <ol class="places">${list.map(p => placeRow(p, t)).join('')}</ol>
          </div>
          <p class="note">${t.mapNote}</p>
        </div>
      </section>

      <section class="host" id="host" aria-labelledby="host-title">
        <div class="wrap split split-reverse">
          <figure class="host-photo reveal"><div class="portrait-slot">${icons.heart}<span>${t.hostPhoto}</span></div></figure>
          <div>
            <p class="kicker">${t.kickers.host}</p>
            ${title(t.hostTitle, 'h2', 'host-title')}
            <p class="lead">${t.hostText}</p>
            <div class="driver">${icons.car}<div><p class="driver-label">${t.driverLabel}</p><h3>${t.driverTitle}</h3><p>${t.driverText}</p></div></div>
          </div>
        </div>
      </section>

      <section class="guide" aria-labelledby="guide-title">
        <div class="wrap split">
          <div>
            <p class="kicker">${t.kickers.guide}</p>
            ${title(t.guideTitle, 'h2', 'guide-title')}
            <p class="lead">${t.guideText}</p>
            <ul class="feature-grid">${t.guide.map(([a, b], i) => `<li class="reveal">${guideIcons[i]}<h3>${a}</h3><p>${b}</p></li>`).join('')}</ul>
            <p class="signature">${t.guideBy}</p>
          </div>
          <div class="guide-media reveal">
            <img src="/assets/food.jpg" alt="" loading="lazy">
            <img src="/assets/coffee.jpg" alt="" loading="lazy">
          </div>
        </div>
      </section>

      <section class="stay" id="stay" aria-labelledby="stay-title">
        <div class="wrap stay-inner">
          <p class="kicker">${t.kickers.stay}</p>
          ${title(t.stayTitle, 'h2', 'stay-title')}
          <p class="lead">${t.stayText}</p>
          <div class="rate-card">
            <p class="rate-label">${t.rateLabel}</p>
            <p class="rate"><strong>${money(property.proposedRateUSD)}</strong><span>${t.perMonth}*</span></p>
            <p class="rate-min">${t.minimum}. ${property.address}</p>
            <ul class="rate-list">${t.stayList.map(s => `<li>${icons.check}${s}</li>`).join('')}</ul>
            <a class="button" href="#enquiry">${t.cta}${icons.arrow}</a>
            <p class="note">* ${t.rateNote}</p>
          </div>
        </div>
      </section>

      <section class="enquiry" id="enquiry" aria-labelledby="form-title">
        <div class="wrap enquiry-grid">
          <div>
            <p class="kicker">${t.kickers.form}</p>
            ${title(t.formTitle, 'h2', 'form-title')}
            <p class="lead">${t.formText}</p>
            <div class="faq">
              <h3>${t.faqTitle}</h3>
              ${t.faqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}
            </div>
          </div>
          <form class="form" novalidate>
            <label>${t.fields.name}<input name="name" autocomplete="name" required></label>
            <label>${t.fields.email}<input name="email" type="email" autocomplete="email" required></label>
            <div class="form-row">
              <label>${t.fields.arrival}<input name="arrival" type="date" min="${localDate()}" required></label>
              <label>${t.fields.months}<select name="months">${months.map(m => `<option value="${m}">${t.monthOption(m)}</option>`).join('')}</select></label>
            </div>
            <p class="departure" aria-live="polite"></p>
            <label>${t.fields.note}<textarea name="note" rows="3"></textarea></label>
            <p class="form-error" role="alert"></p>
            <button class="button" type="submit">${isLive() ? icons.whatsapp + t.submitLive : t.submit}</button>
            <p class="form-status" role="status"></p>
          </form>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="wrap footer-inner">
        <a href="#top" class="brand">${mark}<span>Smart Studio<small>Bogotá</small></span></a>
        <p>${property.address}<br>${t.footer}</p>
        <a href="#top" class="text-link">${t.top}</a>
      </div>
    </footer>

    <div class="sticky" hidden>
      <p><strong>${t.stickyRate}*</strong><span>${t.stickyNote}</span></p>
      <a class="button button-small button-gold" href="#enquiry">${t.cta}</a>
    </div>

    <dialog class="lightbox" aria-label="${t.nav[1]}">
      <button type="button" class="icon-button lightbox-close" aria-label="Close">${icons.close}</button>
      <img alt="">
      <p class="lightbox-caption"></p>
    </dialog>`;

  wire(t);
}

function wire(t) {
  document.querySelector('.lang').addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    storage.set('smart-studio-language', lang);
    teardown(); render();
    document.querySelector('.lang').focus();
  });

  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-nav');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); mobile.hidden = !open;
  });
  mobile.addEventListener('click', e => { if (e.target.closest('a')) { mobile.hidden = true; toggle.setAttribute('aria-expanded', 'false'); } });

  // Lightbox
  const dialog = document.querySelector('.lightbox');
  const openPhoto = i => {
    const p = property.photos[i];
    dialog.querySelector('img').src = p.src; dialog.querySelector('img').alt = p[lang];
    dialog.querySelector('.lightbox-caption').textContent = p[lang];
    dialog.showModal();
  };
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  gallery = mountGallery(document.querySelector('.ring-gallery'), { onOpen: openPhoto });

  // Neighborhood list, filters and map
  const placeById = Object.fromEntries(sortedPlaces().map(p => [p.id, p]));
  const popupHtml = p => `<strong>${esc(p.name)}</strong><span>${esc(p[lang])}</span><span>${walkMinutes(p.meters)} ${t.walk}, ${formatDistance(p.meters, lang)}</span>`;
  const select = id => {
    document.querySelectorAll('.place').forEach(b => b.setAttribute('aria-current', String(b.dataset.place === id)));
    ensureMap().focus(placeById[id], popupHtml(placeById[id]));
  };
  const ensureMap = () => {
    if (!mapView) {
      const el = document.querySelector('#map');
      el.classList.add('is-loading');
      mapView = createMap(el, { t, onSelect: id => {
        select(id);
        document.querySelector(`.place[data-place="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } });
      mapView.ready.then(() => { el.classList.remove('is-loading'); document.querySelector('.map-poster')?.remove(); mapView.filter(activeCat); })
        .catch(() => { el.classList.remove('is-loading'); el.classList.add('is-failed'); document.querySelector('.map-poster')?.classList.add('is-failed'); });
    }
    return mapView;
  };
  document.querySelector('.map-poster').addEventListener('click', ensureMap);
  document.querySelectorAll('.place').forEach(b => b.addEventListener('click', () => select(b.dataset.place)));
  document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
    activeCat = chip.dataset.cat;
    document.querySelectorAll('.chip').forEach(c => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
    document.querySelectorAll('.places li').forEach(li => { li.hidden = !(activeCat === 'all' || li.dataset.cat === activeCat); });
    mapView?.filter(activeCat);
  }));
  document.querySelector('.map-orbit').addEventListener('click', () => ensureMap().orbit());
  document.querySelectorAll('.map-view').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.map-view').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    ensureMap().setView(b.dataset.view);
  }));
  document.querySelector('.map-reset').addEventListener('click', () => {
    document.querySelectorAll('.place').forEach(b => b.setAttribute('aria-current', 'false'));
    ensureMap().reset();
  });
  // Load the map shortly before it scrolls into view; tiles are only requested then.
  mapObserver = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) { ensureMap(); mapObserver.disconnect(); }
  }, { rootMargin: '400px 0px' });
  mapObserver.observe(document.querySelector('#map'));

  // Sticky availability bar after the hero
  const sticky = document.querySelector('.sticky');
  // Hidden while the hero, the rate card or the form is on screen.
  const covering = new Set();
  const stickyObserver = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? covering.add(e.target) : covering.delete(e.target));
    sticky.hidden = covering.size > 0;
  });
  ['.hero', '.stay', '.enquiry'].forEach(sel => stickyObserver.observe(document.querySelector(sel)));

  // Gentle reveal; content is visible without JS and with reduced motion.
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); revealObserver.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => { el.classList.add('will-reveal'); revealObserver.observe(el); });
  }

  // Enquiry
  const form = document.querySelector('.form');
  const departure = form.querySelector('.departure');
  const updateDeparture = () => {
    const date = departureDate(form.arrival.value, Number(form.months.value));
    departure.textContent = date ? `${t.departure}: ${date}` : '';
  };
  form.arrival.addEventListener('change', updateDeparture);
  form.months.addEventListener('change', updateDeparture);
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const error = !data.name.trim() ? t.errors.name
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ? t.errors.email
      : (!departureDate(data.arrival, Number(data.months)) || data.arrival < localDate()) ? t.errors.arrival : '';
    form.querySelector('.form-error').textContent = error;
    if (error) return;
    const message = enquiryMessage(data, lang);
    if (isLive()) { window.open(`https://wa.me/${property.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener'); return; }
    try { await navigator.clipboard.writeText(message); } catch {
      const area = Object.assign(document.createElement('textarea'), { value: message });
      document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
    }
    form.querySelector('.form-status').textContent = t.copied;
  });
}

function teardown() {
  gallery?.destroy(); mapView?.destroy(); mapObserver?.disconnect();
  gallery = mapView = mapObserver = undefined;
}

render();

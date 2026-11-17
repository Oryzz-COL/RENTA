import { property } from './config.js';
import { content } from './content.js';
import { departureDate, localDate, enquiryMessage } from './booking.js';

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } }
};
let lang = storage.get('residence-language') === 'es' ? 'es' : 'en';
let activePhoto = 0;
let returnFocus;
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.4"/></svg>';
const cross = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" stroke-width="1.4"/></svg>';
const wa = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-12 7l-5 1.4 1.4-5A8 8 0 1 1 20 11.5Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.5c0 4 2 6 6 7l1.5-2-2-1-1 1c-1.5-.5-2.5-1.5-3-3l1-1-1-2Z" stroke="currentColor" stroke-width="1.2"/></svg>';
const mark = '<svg viewBox="0 0 44 44" fill="none" aria-hidden="true"><path d="M9 35V9h13c12 0 12 15 0 15H9m13 0 13 11" stroke="currentColor" stroke-width="1.3"/></svg>';
const isLive = () => !property.preview && /^\d{10,15}$/.test(property.whatsapp || '') && property.legalOwner && property.privacyEmail;
function render() {
  const t = content[lang];
  document.documentElement.lang = lang;
  document.title = lang === 'es' ? 'Un lugar muy tuyo · Residencia Bogotá' : 'A place of your own · Bogotá residence';
  document.querySelector('.skip-link').textContent = lang === 'es' ? 'Saltar al contenido' : 'Skip to content';
  document.querySelector('#app').innerHTML = `
    <header class="header">
      <a href="#" class="brand" aria-label="${property.brand}">${mark}<span>THE BOGOTÁ<br><strong>RESIDENCE</strong></span></a>
      <nav class="desktop-nav" aria-label="${lang === 'es' ? 'Principal' : 'Main'}"><a href="#residence">${t.nav[0]}</a><a href="#neighbourhood">${t.nav[1]}</a><a href="#questions">${t.nav[2]}</a></nav>
      <div class="header-actions"><button class="language" aria-label="${lang === 'es' ? 'Switch to English' : 'Cambiar a español'}">${lang === 'es' ? 'EN' : 'ES'}</button><a class="button button-small" href="#enquiry">${t.enquire}${arrow}</a><button class="menu-toggle icon-button" aria-label="${t.menu}" aria-expanded="false"><span></span><span></span></button></div>
      <nav class="mobile-nav" hidden aria-label="${lang === 'es' ? 'Menú móvil' : 'Mobile menu'}"><a href="#residence">${t.nav[0]}</a><a href="#neighbourhood">${t.nav[1]}</a><a href="#questions">${t.nav[2]}</a><a href="#enquiry">${t.enquire}</a></nav>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy"><span class="eyebrow">${t.eyebrow}</span><h1 id="hero-title">${t.hero}</h1><p>${t.intro}</p><a class="text-link" href="#residence">${t.explore}<span>${arrow}</span></a><div class="hero-place"><span class="coordinate-dot"></span>${t.place}<span class="place-line"></span></div></div>
        <div class="hero-visual"><img src="${property.photos[0].src}" alt="${property.photos[0][lang]} — ${t.photoNote}" fetchpriority="high" width="2000" height="1333"><button class="photo-launch" data-photo="0" aria-label="${t.gallery}"><span class="grid-icon">▦</span>${t.gallery}</button><div class="duration-card"><span class="duration-number">1—12</span><div><strong>${t.duration}</strong><span>${t.durationSub}</span></div></div><span class="photo-note">${t.photoNote}</span></div>
      </section>
      <div class="intro-strip"><span>${t.preview}</span><div>${t.strip.map(s => `<span>${s}</span>`).join('<i aria-hidden="true">✳</i>')}</div></div>
      <section class="section residence" id="residence" aria-labelledby="residence-title">
        <div class="residence-heading"><span class="eyebrow">${t.residenceEyebrow}</span><h2 id="residence-title">${t.residenceTitle}</h2><p>${t.residenceCopy}</p><button class="text-link" data-gallery>${t.gallery}<span>${arrow}</span></button></div>
        <figure class="residence-photo"><button data-photo="1" aria-label="${t.gallery}: ${property.photos[1][lang]}"><img src="${property.photos[1].src}" alt="${property.photos[1][lang]}" loading="lazy" width="1200" height="900"><span class="photo-plus" aria-hidden="true">+</span></button><figcaption><span>${t.livingLabel}</span><span>${t.photoNote}</span></figcaption></figure>
        <figure class="detail-photo"><button data-photo="3" aria-label="${t.gallery}: ${property.photos[3][lang]}"><img src="${property.photos[3].src}" alt="${property.photos[3][lang]}" loading="lazy" width="1200" height="1400"><span class="photo-plus" aria-hidden="true">+</span></button><figcaption>${t.detailsLabel}</figcaption></figure>
        <p class="residence-disclaimer">${t.residenceNote}</p>
      </section>
      <section class="stay-section section" aria-labelledby="stay-title"><div class="stay-heading"><span class="eyebrow">${t.stayEyebrow}</span><h2 id="stay-title">${t.stayTitle}</h2></div><div class="stay-grid">${t.stays.map(s => `<article><span class="stay-symbol">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join('')}</div></section>
      <section class="section neighbourhood" id="neighbourhood" aria-labelledby="area-title"><div class="area-copy"><span class="eyebrow">${t.areaEyebrow}</span><h2 id="area-title">${t.areaTitle}</h2><p>${t.areaCopy}</p><div class="area-tabs" role="tablist" aria-label="${t.nav[1]}">${t.areaTabs.map((s, i) => `<button role="tab" id="tab-${i}" aria-controls="area-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-area="${i}">${s}</button>`).join('')}</div><div id="area-panel" role="tabpanel" aria-labelledby="tab-0" tabindex="0"></div></div><div class="area-art" role="img" aria-label="${t.mapLabel}"><div class="art-block block-a"></div><div class="art-block block-b"></div><div class="art-block block-c"></div><div class="art-block block-d"></div><div class="art-road road-a"></div><div class="art-road road-b"></div><div class="art-road road-c"></div><div class="art-park"></div><div class="art-north">↑<span>${t.north}</span></div><div class="art-location">${mark}<span>BOGOTÁ</span></div><span class="art-caption">${t.cityLabel}</span><span class="art-disclaimer">${t.mapLabel}</span></div><p class="area-note">${t.areaNote}</p></section>
      <section class="section faq-section" id="questions" aria-labelledby="faq-title"><div><span class="eyebrow">${t.faqEyebrow}</span><h2 id="faq-title">${t.faqTitle}</h2></div><div class="faq-list">${t.faqs.map((q, i) => `<details><summary><span>${q[0]}</span><span class="faq-plus" aria-hidden="true">+</span></summary><p>${q[1]}</p></details>`).join('')}</div></section>
      <section class="section enquiry-section" id="enquiry" aria-labelledby="book-title"><div class="enquiry-copy"><span class="eyebrow">${t.bookEyebrow}</span><h2 id="book-title">${t.bookTitle}</h2><p>${t.bookCopy}</p><div class="enquiry-seal"><span>BOGOTÁ</span><div>1—12</div><span>${t.duration.toUpperCase()}</span></div><p class="preview-notice">${t.bookNotice}</p></div><form id="enquiry-form"><div class="form-grid"><label>${t.name}<input name="name" autocomplete="name" required maxlength="100" placeholder="${lang === 'es' ? 'Nombre y apellido' : 'First and last name'}"></label><label>${t.email}<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label><label>${t.arrival}<input name="arrival" type="date" min="${localDate()}" required></label><label>${t.length}<select name="months">${Array.from({length: 12}, (_, i) => `<option value="${i + 1}">${i + 1} ${i ? t.months : t.month}</option>`).join('')}</select></label></div><p class="departure-preview" aria-live="polite"></p><label>${t.note}<textarea name="note" rows="3" maxlength="1200" placeholder="${t.notePlaceholder}"></textarea></label><div class="consent-row"><input id="privacy-consent" name="consent" type="checkbox" required><label for="privacy-consent">${t.consent}</label></div><button class="privacy-read" type="button" data-legal="1">${t.privacyLink}</button><p id="form-status" role="status"></p><button class="button form-submit" type="submit">${isLive() ? t.submitLive : t.submit}${arrow}</button><p class="form-note">${t.noConfirm}</p><div class="enquiry-result" hidden><label for="message">${t.noSend}</label><textarea id="message" rows="8" readonly></textarea><button type="button" class="text-link copy-message">${t.copy}${arrow}</button><p class="copy-status" role="status"></p></div></form></section>
    </main>
    <footer class="footer"><div class="footer-top"><a href="#" class="brand">${mark}<span>THE BOGOTÁ<br><strong>RESIDENCE</strong></span></a><p class="footer-title">${t.footerLine}</p><p>${t.footerDescription}</p></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} · ${property.brand}</span><div>${t.legal.map((s,i) => `<button data-legal="${i}">${s}</button>`).join('')}<button data-preferences>${t.cookieSettings}</button></div><span>Design & development · ORYZZ</span></div><p class="footer-note">${t.footerNote}</p></footer>
    <button class="whatsapp" aria-label="${t.whatsapp}">${wa}<span>${t.whatsapp}</span></button>
    <aside class="privacy-banner" aria-label="${t.cookieSettings}" ${storage.get('residence-privacy') ? 'hidden' : ''}><div><strong>${t.cookieTitle}</strong><p>${t.cookieText}</p></div><button class="button" data-dismiss>${t.cookieButton}</button><button class="privacy-read" data-legal="2">${t.legal[2]}</button></aside>
    <dialog class="gallery-dialog" aria-labelledby="gallery-title"><div class="dialog-header"><div><span class="eyebrow">${t.photoNote}</span><h2 id="gallery-title">${t.galleryTitle}</h2></div><button class="icon-button" data-close aria-label="${t.close}">${cross}</button></div><p>${t.gallerySub}</p><div class="gallery-filters" role="group" aria-label="${t.gallery}">${t.filters.map((s,i) => `<button data-filter="${['all','living','rest','details'][i]}" aria-pressed="${i === 0}">${s}</button>`).join('')}</div><div class="gallery-stage"><img class="gallery-main" alt=""><button class="gallery-prev icon-button" aria-label="${t.previous}">${arrow}</button><button class="gallery-next icon-button" aria-label="${t.next}">${arrow}</button></div><div class="gallery-caption" aria-live="polite"></div><div class="gallery-thumbnails"></div></dialog>
    <dialog class="legal-dialog" aria-labelledby="legal-title"><div class="dialog-header"><span class="eyebrow">${t.legalDraft}</span><button class="icon-button" data-close aria-label="${t.close}">${cross}</button></div><h2 id="legal-title"></h2><div class="legal-body"></div></dialog>`;
  bind();
  updateArea(0);
}
function openDialog(dialog) {
  returnFocus = document.activeElement;
  dialog.showModal();
  document.body.classList.add('dialog-open');
}
let filteredPhotos = property.photos.map((_, i) => i);
function updateGallery() {
  const t = content[lang];
  const photo = property.photos[activePhoto];
  const main = document.querySelector('.gallery-main');
  main.src = photo.src;
  main.alt = `${photo[lang]} — ${t.photoNote}`;
  document.querySelector('.gallery-caption').textContent = `${String(filteredPhotos.indexOf(activePhoto) + 1).padStart(2, '0')} / ${String(filteredPhotos.length).padStart(2, '0')} — ${photo[lang]}`;
  document.querySelector('.gallery-thumbnails').innerHTML = filteredPhotos.map(i => `<button data-thumb="${i}" aria-label="${property.photos[i][lang]}" aria-pressed="${i === activePhoto}"><img src="${property.photos[i].src}" alt=""></button>`).join('');
  document.querySelectorAll('[data-thumb]').forEach(b => b.onclick = () => { activePhoto = Number(b.dataset.thumb); updateGallery(); });
}
function movePhoto(direction) {
  activePhoto = filteredPhotos[(filteredPhotos.indexOf(activePhoto) + direction + filteredPhotos.length) % filteredPhotos.length];
  updateGallery();
}
function updateArea(index) {
  const p = content[lang].areaPanels[index];
  document.querySelector('#area-panel').innerHTML = `<h3>${p[0]}</h3><p>${p[1]}</p><span class="pending-detail">${p[2]}</span>`;
  document.querySelector('#area-panel').setAttribute('aria-labelledby', `tab-${index}`);
  document.querySelectorAll('[data-area]').forEach((b,i) => { b.setAttribute('aria-selected', String(i === index)); b.tabIndex = i === index ? 0 : -1; });
}
function bind() {
  const t = content[lang];
  document.querySelector('.language').onclick = () => {
    const form = document.querySelector('#enquiry-form');
    const values = new FormData(form);
    const position = window.scrollY;
    lang = lang === 'es' ? 'en' : 'es'; storage.set('residence-language', lang); render();
    for (const key of ['name','email','arrival','months','note']) document.querySelector(`[name="${key}"]`).value = values.get(key);
    window.scrollTo({top:position, behavior:'instant'});
    document.querySelector('.language').focus({preventScroll:true});
  };
  const menu = document.querySelector('.menu-toggle');
  function closeMenu() { menu.setAttribute('aria-expanded','false'); document.querySelector('.mobile-nav').hidden = true; }
  menu.onclick = () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); document.querySelector('.mobile-nav').hidden = open; };
  document.querySelectorAll('.mobile-nav a').forEach(a => a.onclick = closeMenu);
  document.onkeydown = e => { if(e.key === 'Escape') closeMenu(); };
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('[data-close]').onclick = () => dialog.close();
    dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); returnFocus?.focus({preventScroll:true}); });
    dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if(e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close(); });
  });
  document.querySelectorAll('[data-photo], [data-gallery]').forEach(b => b.onclick = () => {
    activePhoto = Number(b.dataset.photo || 0); filteredPhotos = property.photos.map((_,i) => i);
    document.querySelectorAll('[data-filter]').forEach(f => f.setAttribute('aria-pressed', String(f.dataset.filter === 'all')));
    updateGallery(); openDialog(document.querySelector('.gallery-dialog'));
  });
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => {
    filteredPhotos = property.photos.flatMap((p,i) => b.dataset.filter === 'all' || p.category === b.dataset.filter ? [i] : []);
    activePhoto = filteredPhotos[0]; document.querySelectorAll('[data-filter]').forEach(f => f.setAttribute('aria-pressed', String(f === b))); updateGallery();
  });
  document.querySelector('.gallery-prev').onclick = () => movePhoto(-1);
  document.querySelector('.gallery-next').onclick = () => movePhoto(1);
  document.querySelector('.gallery-dialog').onkeydown = e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); movePhoto(e.key === 'ArrowLeft' ? -1 : 1); } };
  document.querySelectorAll('[data-area]').forEach(b => {
    b.onclick = () => updateArea(Number(b.dataset.area));
    b.onkeydown = e => { let i = Number(b.dataset.area); if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); i = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowLeft' ? -1 : 1) + 3) % 3; updateArea(i); document.querySelector(`[data-area="${i}"]`).focus(); } };
  });
  document.querySelectorAll('[data-legal]').forEach(b => b.onclick = () => {
    const index = Number(b.dataset.legal);
    document.querySelector('#legal-title').textContent = t.legal[index];
    document.querySelector('.legal-body').innerHTML = `<p class="legal-intro">${t.legalIntro}</p>${t.legalSections[index].map(s => `<h3>${s[0]}</h3><p>${s[1]}</p>`).join('')}`;
    openDialog(document.querySelector('.legal-dialog'));
  });
  document.querySelector('[data-dismiss]').onclick = () => { storage.set('residence-privacy','acknowledged'); document.querySelector('.privacy-banner').hidden = true; };
  document.querySelector('[data-preferences]').onclick = () => { document.querySelector('.privacy-banner').hidden = false; document.querySelector('[data-dismiss]').focus(); };
  document.querySelector('.whatsapp').onclick = () => {
    if (isLive()) window.open(`https://wa.me/${property.whatsapp}`, '_blank', 'noopener,noreferrer');
    else { document.querySelector('#enquiry').scrollIntoView(); document.querySelector('#form-status').textContent = t.whatsappPending; document.querySelector('[name="name"]').focus({preventScroll:true}); }
  };
  const form = document.querySelector('#enquiry-form');
  const updateDeparture = () => {
    const date = departureDate(form.elements.arrival.value, Number(form.elements.months.value));
    document.querySelector('.departure-preview').textContent = date ? `${t.departure}: ${new Intl.DateTimeFormat(lang, {dateStyle:'long'}).format(new Date(date + 'T12:00:00'))}` : '';
    document.querySelector('.enquiry-result').hidden = true;
  };
  form.elements.arrival.onchange = updateDeparture;
  form.elements.months.onchange = updateDeparture;
  form.addEventListener('input', () => { document.querySelector('.enquiry-result').hidden = true; });
  form.onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if(!data.name.trim() || !form.checkValidity() || !departureDate(data.arrival, Number(data.months)) || data.arrival < localDate()) { document.querySelector('#form-status').textContent = t.required; return; }
    const message = enquiryMessage(data, lang);
    document.querySelector('#form-status').textContent = '';
    if (isLive()) window.open(`https://wa.me/${property.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    else {
      document.querySelector('#message').value = message;
      document.querySelector('.copy-status').textContent = '';
      document.querySelector('.enquiry-result').hidden = false;
      document.querySelector('#message').focus();
    }
  };
  document.querySelector('.copy-message').onclick = async () => {
    try { await navigator.clipboard.writeText(document.querySelector('#message').value); document.querySelector('.copy-status').textContent = t.copied; }
    catch { document.querySelector('#message').select(); document.querySelector('.copy-status').textContent = t.copyFail; }
  };
}
render();

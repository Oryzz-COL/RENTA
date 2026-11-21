// A 3D ring of photos you can drag, swipe or step through. Without JS the photos stay a scrollable row.
export function mountGallery(root, { onOpen }) {
  const ring = root.querySelector('.ring');
  const items = [...ring.children];
  const n = items.length;
  const step = 360 / n;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let angle = 0, velocity = 0, dragging = false, lastX = 0, moved = 0, raf = 0, radius = 0;

  root.classList.add('is-3d');

  function layout() {
    const w = items[0].getBoundingClientRect().width || 300;
    radius = Math.round((w / 2) / Math.tan(Math.PI / n) * 1.08);
    items.forEach((item, i) => { item.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`; });
    paint();
  }
  const current = () => ((Math.round(-angle / step) % n) + n) % n;
  function paint() {
    ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    const front = current();
    items.forEach((item, i) => {
      const d = Math.min(Math.abs(i - front), n - Math.abs(i - front));
      item.style.opacity = String(Math.max(0.28, 1 - d * 0.24));
      item.classList.toggle('is-front', i === front);
      item.tabIndex = i === front ? 0 : -1;
      item.setAttribute('aria-hidden', String(i !== front));
    });
    root.querySelector('.ring-count').textContent = `${front + 1} / ${n}`;
    root.querySelector('.ring-caption').textContent = items[front].dataset.caption;
  }
  function snapTo(target) {
    cancelAnimationFrame(raf);
    if (reduced) { angle = target; paint(); return; }
    const start = angle, t0 = performance.now(), dur = 620;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      angle = start + (target - start) * e; paint();
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  const go = dir => snapTo(Math.round(angle / step) * step - dir * step);
  function glide() {
    velocity *= 0.92; angle += velocity; paint();
    if (Math.abs(velocity) > 0.08) raf = requestAnimationFrame(glide);
    else snapTo(Math.round(angle / step) * step);
  }

  const stage = root.querySelector('.ring-stage');
  stage.addEventListener('pointerdown', e => {
    dragging = true; moved = 0; lastX = e.clientX; velocity = 0;
    cancelAnimationFrame(raf); stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
    velocity = dx * 0.22; angle += velocity; paint();
  });
  const release = () => {
    if (!dragging) return; dragging = false;
    if (reduced) snapTo(Math.round(angle / step) * step); else glide();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  items.forEach((item, i) => item.addEventListener('click', () => {
    if (moved > 6) return;
    if (i === current()) onOpen(i); else snapTo(Math.round(angle / step) * step - ((i - current() + n) % n <= n / 2 ? (i - current() + n) % n : (i - current() + n) % n - n) * step);
  }));
  root.querySelector('.ring-prev').addEventListener('click', () => go(-1));
  root.querySelector('.ring-next').addEventListener('click', () => go(1));
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  });
  const resize = new ResizeObserver(layout);
  resize.observe(stage);
  layout();
  return { destroy: () => { resize.disconnect(); cancelAnimationFrame(raf); } };
}

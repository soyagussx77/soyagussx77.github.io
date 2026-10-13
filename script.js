// Contador animado (0 → número) al entrar en pantalla
const io = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  io.unobserve(en.target);
  const el = en.target, end = +el.dataset.count, t0 = performance.now();
  const tick = t => { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(end * p); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .6 });
document.querySelectorAll("[data-count]").forEach(el => io.observe(el));

// Copiar Discord
document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", () => {
  navigator.clipboard?.writeText(b.dataset.copy);
  const s = b.querySelector("span"), old = s.textContent;
  s.textContent = "¡Copiado!"; setTimeout(() => s.textContent = old, 1600);
}));

// Contador de visitas (counterapi.dev). Suma 1 por sesión, no por cada página.
const VISITS = { ns: "aguss-portafolio", key: "visitas", base: 12 }; // base 12 + tu 1ª visita = 13
(async () => {
  const el = document.getElementById("visits");
  const card = document.getElementById("visit-card");
  let total = null;
  try {
    const first = !sessionStorage.getItem("visit-counted");
    const r = await fetch(`https://api.counterapi.dev/v1/${VISITS.ns}/${VISITS.key}/${first ? "up" : ""}`);
    if (r.ok) { total = VISITS.base + (await r.json()).count; sessionStorage.setItem("visit-counted", "1"); localStorage.setItem("visit-total", total); }
  } catch (e) {}
  if (!el) return;
  if (total === null) total = Number(localStorage.getItem("visit-total")) || null;
  if (!total) { card.hidden = true; return; }
  el.dataset.count = total;
  io.observe(el);
})();

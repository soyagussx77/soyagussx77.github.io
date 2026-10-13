// ====== EDITA AQUÍ ======
// Categorías y su descripción (se muestra al elegir la categoría)
const CATS = {
  "Configuraciones": "Configuro servidores de Minecraft: plugins, permisos, menús y sistemas listos para usar.",
  "Bots de Discord": "Desarrollo bots con comandos, tickets, moderación y funciones personalizadas para tu comunidad.",
  "Páginas web": "Diseño y desarrollo páginas web y portafolios personalizados para tu proyecto o comunidad."
};
// images: una o varias imágenes (el visor muestra 1/N). fit: "contain" para capturas verticales.
const works = [
  { title: "Web Darktrap", cat: "Páginas web", images: ["trabajos/web-darktrap-1.png", "trabajos/web-darktrap-2.png", "trabajos/web-darktrap-3.png", "trabajos/web-darktrap-4.png", "trabajos/web-darktrap-5.png"], date: "2026-10" },
  { title: "Darktrap Bot", cat: "Bots de Discord", images: ["trabajos/darktrap-bot.png"], fit: "contain", date: "2026-07" },
  // Agrega los demás con este modelo (cat debe ser: "Configuraciones", "Bots de Discord" o "Páginas web"):
  // { title: "Nombre", cat: "Páginas web", images: ["trabajos/foto.png"], date: "2026-05" },
];
const PAGE = 6;
let cat = "Todos", shown = PAGE, current = [], cur = null, k = 0;
const $ = s => document.querySelector(s);

function renderFilters() {
  $("#filters").innerHTML = ["Todos", ...Object.keys(CATS)].map(c =>
    `<button type="button" class="${c === cat ? "on" : ""}" data-cat="${c}">${c}</button>`).join("");
}

function render() {
  const q = $("#search").value.trim().toLowerCase(), s = $("#sort").value;
  current = works.filter(w => (cat === "Todos" || w.cat === cat) && w.title.toLowerCase().includes(q));
  current.sort((a, b) => s === "az" ? a.title.localeCompare(b.title) : s === "old" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const n = current.length;
  $("#count").textContent = `${n} ${n === 1 ? "trabajo" : "trabajos"} / ${cat === "Todos" ? "Todos los apartados" : cat}`;
  const b = $("#banner");
  b.hidden = cat === "Todos";
  if (!b.hidden) { b.querySelector("h3").textContent = cat; b.querySelector("p").textContent = CATS[cat]; }
  $("#works").innerHTML = n ? current.slice(0, shown).map((w, i) => `
    <button class="work-card" type="button" data-i="${i}">
      <div class="work-thumb ${w.fit || ""}"><img loading="lazy" src="${w.images[0]}" alt="${w.title}" onerror="this.remove()">${w.images.length > 1 ? `<em>${w.images.length} imágenes</em>` : ""}</div>
      <div class="work-info"><div><h3>${w.title}</h3><span>${w.cat}</span></div><i class="arrow" aria-hidden="true">↗</i></div>
    </button>`).join("") : `<p class="empty">No encontré ese proyecto. Prueba otra palabra o categoría.</p>`;
  $("#more").style.display = shown < n ? "" : "none";
  renderFilters();
}

$("#filters").addEventListener("click", e => { const b = e.target.closest("button"); if (b) { cat = b.dataset.cat; shown = PAGE; render(); } });
$("#search").addEventListener("input", () => { shown = PAGE; render(); });
$("#sort").addEventListener("change", () => { shown = PAGE; render(); });
$("#more").addEventListener("click", () => { shown += PAGE; render(); });

// Visor (como el de tu web original): imagen, categoría, título y contador 1/N
const v = document.createElement("div");
v.className = "viewer"; v.hidden = true;
v.innerHTML = `<div class="viewer-panel" role="dialog" aria-modal="true">
  <button class="viewer-close" type="button" aria-label="Cerrar">✕</button>
  <button class="viewer-nav viewer-prev" type="button" aria-label="Anterior">←</button>
  <div class="viewer-stage"><img alt=""></div>
  <button class="viewer-nav viewer-next" type="button" aria-label="Siguiente">→</button>
  <div class="viewer-info"><small></small><h3></h3><b></b></div></div>`;
document.body.appendChild(v);
const q2 = s => v.querySelector(s);
function paint() {
  q2("img").src = cur.images[k];
  q2("small").textContent = cur.cat;
  q2("h3").textContent = cur.title;
  q2("b").textContent = `${k + 1}/${cur.images.length}`;
  v.classList.toggle("single", cur.images.length < 2);
}
function openV(i) { cur = current[i]; k = 0; paint(); v.hidden = false; document.body.style.overflow = "hidden"; }
function closeV() { v.hidden = true; document.body.style.overflow = ""; }
function step(d) { if (cur.images.length > 1) { k = (k + d + cur.images.length) % cur.images.length; paint(); } }
$("#works").addEventListener("click", e => { const c = e.target.closest(".work-card"); if (c) openV(+c.dataset.i); });
v.addEventListener("click", e => {
  if (e.target.closest(".viewer-prev")) step(-1);
  else if (e.target.closest(".viewer-next")) step(1);
  else if (e.target === v || e.target.closest(".viewer-close")) closeV();
});
document.addEventListener("keydown", e => {
  if (v.hidden) return;
  if (e.key === "Escape") closeV();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

render();

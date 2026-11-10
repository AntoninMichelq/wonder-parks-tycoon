// Liens de téléchargement : ils pointent vers la dernière version publiée sur GitHub (onglet Releases).
// À changer si le dépôt ou le nom des fichiers change.
const REPO = "AntoninMichelq/wonder-parks-tycoon";
const FILES = {
  android: "WonderParksTycoon.apk",
  windows: "WonderParksTycoon-Setup.exe",
};

const latest = name => `https://github.com/${REPO}/releases/latest/download/${name}`;
const releasesPage = `https://github.com/${REPO}/releases`;

for (const [os, name] of Object.entries(FILES)) {
  document.querySelectorAll(`#dl-${os}, [data-dl="${os}"]`).forEach(a => {
    a.href = latest(name);
    a.setAttribute("download", "");
  });
}
document.getElementById("all-releases").href = releasesPage;

// L'appareil du visiteur passe en premier, avec une petite étiquette
const ua = navigator.userAgent;
const mine = /Android/i.test(ua) ? "android" : /Windows/i.test(ua) ? "windows" : null;
if (mine) {
  const t = document.getElementById(`dl-${mine}`);
  t.classList.add("mine");
  t.dataset.badge = "Pour ton appareil";
  t.parentElement.prepend(t);
}

// Version et taille des fichiers, lues dans la dernière version publiée (sans elles, la page marche quand même)
fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
  .then(r => (r.ok ? r.json() : null))
  .then(rel => {
    if (!rel) return;
    const mo = n => (n / 1048576).toFixed(n > 104857600 ? 0 : 1).replace(".", ",") + " Mo";
    for (const [os, name] of Object.entries(FILES)) {
      const asset = (rel.assets || []).find(a => a.name === name);
      const el = document.querySelector(`[data-size="${os}"]`);
      if (asset && el) el.textContent = mo(asset.size);
    }
    const date = rel.published_at ? new Date(rel.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
    document.getElementById("release-meta").textContent =
      `Version ${rel.tag_name}${date ? ", publiée le " + date : ""} · gratuit · en français et en anglais`;
  })
  .catch(() => {});

// Ancienne version web du jeu : son service worker et ses copies en cache sont retirés du navigateur
if ("serviceWorker" in navigator)
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
if (window.caches)
  caches.keys().then(ks => ks.forEach(k => caches.delete(k))).catch(() => {});

// ------------------------------------------------------------------ petits effets
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
// (l'entrée en scène ne rejoue pas au retour sur la page)
setTimeout(() => document.body.classList.remove("intro"), 2000);

// confettis aux couleurs du jeu quand on prend un ticket
const colors = ["#d93a4a", "#ffc93c", "#3d8bd9", "#5fae5c", "#fff3dc", "#b07cff"];
document.querySelectorAll(".ticket").forEach(t => t.addEventListener("click", e => {
  if (calm) return;
  const r = t.getBoundingClientRect();
  const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
  for (let i = 0; i < 18; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    const a = Math.PI * (1.1 + Math.random() * 0.8), d = 60 + Math.random() * 90;
    c.style.cssText = `left:${x}px;top:${y}px;background:${colors[i % colors.length]};` +
      `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d + 40}px;--r:${(Math.random() * 2 - 1) * 400}deg`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1000);
  }
}));

// Gus change de réplique quand on le touche
const lines = [
  "Encore un nouveau directeur ? Pfff… Télécharge, et ne me fais pas regretter de t'avoir embauché.",
  "Quoi encore ? Les tickets sont juste là. Je ne vais pas cliquer à ta place.",
  "Arrête de me toucher les cheveux. Ça m'a pris une heure ce matin.",
  "Douze espèces, un aquarium, et c'est moi qui nettoie. Évidemment.",
  "Les managers travaillent même la nuit. Moi aussi, d'ailleurs. Personne ne me remercie.",
];
let li = 0;
const gus = document.querySelector(".gus"), bubble = gus.querySelector(".bubble");
gus.querySelector(".gus-btn").addEventListener("click", () => {
  li = (li + 1) % lines.length;
  bubble.textContent = lines[li];
  gus.classList.remove("talk");
  void gus.offsetWidth;
  gus.classList.add("talk");
});

// le téléphone du haut suit doucement la souris (ordinateur seulement)
const phone = document.querySelector(".hero-phone");
if (!calm && matchMedia("(hover: hover)").matches) {
  addEventListener("pointermove", e => {
    const r = phone.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth, dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    phone.style.setProperty("--tx", (dx * 14).toFixed(2) + "deg");
    phone.style.setProperty("--ty", (-dy * 10).toFixed(2) + "deg");
  });
}

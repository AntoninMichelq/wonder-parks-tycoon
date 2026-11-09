// Liens de téléchargement : ils pointent vers la dernière version publiée sur GitHub (onglet Releases).
// À changer si le dépôt ou le nom des fichiers change.
const REPO = "AntoninMichelq/wonder-parks-tycoon";
const FILES = {
  android: "WonderParksTycoon.apk",
  windows: "WonderParksTycoon-Windows.zip",
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

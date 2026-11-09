# Site de téléchargement de Wonder Parks Tycoon

Page statique (HTML, CSS, JS, sans outil de compilation), prévue pour GitHub Pages.

## Mettre le site en ligne
1. Pousse ce dossier `docs/` sur la branche `main` du dépôt.
2. Sur GitHub : Settings → Pages → Source « Deploy from a branch », branche `main`, dossier `/docs`, puis Save.
3. Le site est en ligne quelques minutes plus tard à l'adresse indiquée sur cette page.

## Publier une version du jeu
Les boutons téléchargent toujours la **dernière version publiée** (Releases) du dépôt :
1. Exporte le jeu depuis Godot :
   - Android → renomme le fichier en `WonderParksTycoon.apk`
   - Windows → mets le `.exe` et le `.pck` dans un dossier, compresse-le en `WonderParksTycoon-Windows.zip`
2. Sur GitHub : Releases → Draft a new release, mets un numéro (ex. `v1.0`), ajoute les deux fichiers, puis Publish.

La page affiche alors toute seule le numéro de version, la date et la taille des fichiers.

## À changer si besoin
- Dépôt et noms de fichiers : en haut de `app.js` (`REPO` et `FILES`).
- Textes : `index.html`. Couleurs : variables au début de `style.css`.
- Captures d'écran : `img/*.webp` (540 × 1170).

Le fichier `.gdignore` empêche Godot d'importer ce dossier, et `.nojekyll` sert à GitHub Pages.
Polices : Lilita One et Nunito (licence OFL, voir `fonts/OFL.txt`).

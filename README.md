# Adhkār — invocations du matin et du soir

Application web statique (Vite + React) pour lire, compter, écouter et partager les adhkār. Aucun backend : les données viennent de `src/data/invocations.json`.

## Lancer en local

```bash
npm install
npm run dev
```

Ouvrir l’URL affichée par Vite (en général `http://localhost:5173`).

## Déployer en statique

```bash
npm run build
```

Le dossier `dist/` contient le site prêt à publier :

- **Netlify** : glisser-déposer `dist`, ou relier le dépôt avec la commande de build `npm run build` et le dossier de publication `dist`.
- **GitHub Pages** : publier le contenu de `dist`. Le `base: './'` de Vite permet un déploiement dans un sous-dossier.

Prévisualiser le build localement :

```bash
npm run preview
```

## Arborescence

```
├── index.html
├── package.json
├── vite.config.js
├── public/favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/invocations.json
    ├── hooks/useFavorites.js
    └── components/
        ├── Header.jsx
        ├── FilterBar.jsx
        ├── InvocationCard.jsx
        ├── Counter.jsx
        ├── AudioButton.jsx
        ├── ShareButton.jsx
        └── Toast.jsx
```

# SR Originals

![SR Originals preview](public/SR%20Originals%20-%20Thumbnail.png)

A Netflix-style family gallery for maternity and baby moments — hero video, carousels, and masonry grids backed by public Google Drive folders and optional YouTube embeds.

## Stack

- [React](https://react.dev/) 19 · [Vite](https://vite.dev/) 8
- [React Router](https://reactrouter.com/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- [Framer Motion](https://www.framer.com/motion/)

## Prerequisites

- Node.js 18+ (recommended: current LTS)

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` as needed (see below), then:

```bash
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173). Restart the dev server after changing env vars.

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`. Summary:

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_DRIVE_API_KEY` | Google API key with Drive access (production; can be used locally if referrer rules allow localhost). |
| `VITE_GOOGLE_DRIVE_API_KEY_LOCAL` | Optional dev-only key so the production key can stay restricted to your host (e.g. Netlify). Used when set during `npm run dev`. |
| `VITE_GOOGLE_DRIVE_FOLDER_ID` | Default folder for masonry galleries (e.g. home). |
| `VITE_GOOGLE_DRIVE_FOLDER_ID_BABY_SHOWER` | Folder for the Sprinkle Season / baby shower page (`/sprinkle-season`). |

In development, API calls can go through Vite’s `/googleapis` proxy (see `vite.config.js`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/bump-era` | Bump Era (alias: `/maternity` → `/bump-era`) |
| `/sprinkle-season` | Sprinkle Season (alias: `/baby-shower` → `/sprinkle-season`) |

Unknown paths redirect to `/`.

## Content and configuration

- **Copy and media IDs:** [`src/data/mediaConfig.js`](src/data/mediaConfig.js) documents how to swap hero video, carousels, and static Drive file IDs.
- **Folder-based masonry:** Requires the Drive API key and folder env vars above.

## License

Private project (`"private": true` in `package.json`).

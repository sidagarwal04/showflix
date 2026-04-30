# ShowFlix

![ShowFlix preview](public/og-image.jpg)

A Netflix-style family gallery — hero video, carousels, and masonry grids. Images are loaded through a **Cloudflare Worker** that proxies and caches Google Drive files (see below). Optional **YouTube** embed for the hero.

## Why a Worker instead of direct Drive links?

Google Drive is not a CDN: hotlinking thumbnails at scale often hits **429** rate limits. This setup treats Drive as the **source of truth** (you keep organizing files there) while visitors load images from **Cloudflare’s cache**:

```text
Browser → Cloudflare Worker (edge cache hit) → Google Drive only on cache miss
```

The Worker also keeps your **Google API key on the server** (Worker secrets), not in the React bundle.

## Cloudflare Worker

The reference implementation lives in **[`workers/drive-image-proxy.js`](workers/drive-image-proxy.js)**. Deploy it in [Cloudflare Workers](https://workers.cloudflare.com/) (dashboard: create Worker → paste → deploy, or use [Wrangler](https://developers.cloudflare.com/workers/wrangler/)).

### Worker configuration (secrets / variables)

| Name | Purpose |
| --- | --- |
| `GOOGLE_API_KEY` | Google Cloud API key with **Google Drive API** enabled. Restrict the key to Drive API and (optionally) IP / usage quotas. |
| `FOLDER_ID` | Primary album folder (Gallery One / home gallery). |
| `FOLDER_ID_2` | Second album (e.g. Gallery Two). Omit if you only use one folder. |

Folders should be shared so files are readable with the API key (e.g. **Anyone with the link** as needed for your setup).

### HTTP API (what the React app expects)

| Request | Behavior |
| --- | --- |
| `GET /list` | JSON array of `{ id, name }` for `FOLDER_ID`. |
| `GET /list?folder=2` | Same for `FOLDER_ID_2`. |
| `GET /{filename}?size=thumb` | Thumbnail via Google’s thumbnail CDN (`sz=w800`). |
| `GET /{filename}` | Full image via Drive `files.get` + `alt=media`. |
| `GET /{filename}?folder=2&size=thumb` | Thumbnail in the second folder. |
| `GET /{filename}?folder=2` | Full image in the second folder. |

Responses set `Access-Control-Allow-Origin: *` so your Netlify (or any) origin can fetch them. List responses are cached ~5 minutes; images ~1 day browser / ~7 days edge (see Worker headers).

### Frontend mapping

- Default Worker host is set in [`src/components/MasonryGallery.jsx`](src/components/MasonryGallery.jsx) (override with `VITE_DRIVE_IMAGE_PROXY_URL`).
- [`src/data/mediaConfig.js`](src/data/mediaConfig.js): Gallery One uses the default folder; **Gallery Two** sets `driveImageProxyFolder: '2'` so URLs include `?folder=2`.
- URL building and filters: [`src/services/driveImageProxy.js`](src/services/driveImageProxy.js).

**Workflow:** add photos to the Drive folder → after the list cache expires (minutes), refresh the site; no redeploy required for new filenames.

### If this repo is only the frontend

Keep **`workers/drive-image-proxy.js`** as documentation or copy it into your Cloudflare account. The Worker does not run during `npm run build`; it is deployed separately from Netlify.

### Alternatives (longer term)

If the library grows or you want zero Drive traffic from visitors: mirror Drive to **R2 / object storage** on a schedule (e.g. **rclone** + cron or GitHub Actions), or use another host-only image pipeline. The Worker approach above is the lightest path that keeps Drive as the editor.

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
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

No `.env` file is required. Defaults include the Worker base URL in code; override in [`src/data/mediaConfig.js`](src/data/mediaConfig.js) (`driveImageProxyBase`, `driveImageProxyFolder`) if you fork this template.

## Optional environment variables

Only if you need overrides (e.g. different Worker URL per deploy without editing code):

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Public site origin (`https://…`, no trailing slash) for Open Graph / social preview absolute URLs in `index.html`. **Netlify sets `URL` at build time** — the Vite plugin uses `VITE_SITE_URL` or `URL`, so you usually do **not** need to set anything. |
| `VITE_DRIVE_IMAGE_PROXY_URL` | Override the Worker origin (defaults in [`MasonryGallery`](src/components/MasonryGallery.jsx)). |

Create a local `.env` or `.env.local` if you use these (both are gitignored). **You can remove any old Netlify variables** such as `VITE_GOOGLE_DRIVE_API_KEY`, `VITE_GOOGLE_DRIVE_FOLDER_ID`, or related keys — the app no longer uses the Google Drive client API for galleries.

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
| `/gallery-one` | Gallery One (alias: `/maternity`  `/gallery-one`) |
| `/gallery-two` | Gallery Two (alias: `/baby-shower`  `/gallery-two`) |

Unknown paths redirect to `/`.

## Content and configuration

- **Hero, section copy, second-folder flag:** [`src/data/mediaConfig.js`](src/data/mediaConfig.js)
- **Fetch `/list`, build `imageSrc` / `thumbnailSrc`:** [`src/services/driveImageProxy.js`](src/services/driveImageProxy.js)
- **Worker source (deploy on Cloudflare):** [`workers/drive-image-proxy.js`](workers/drive-image-proxy.js)

## License

Private project (`"private": true` in `package.json`). Change the license in `package.json` if you publish this template openly.

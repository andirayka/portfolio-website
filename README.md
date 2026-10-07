# Andi Rayka's portfolio

A static portfolio built with Astro, TypeScript, and Tailwind CSS. It ships no client-side JavaScript. Project details use native HTML disclosures, and fonts are self-hosted.

## Run locally

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

## Check a production build

```sh
npm run check
npm run build
npm test
npm run preview -- --port 4321
node tests/browser.mjs
```

The browser checks use an installed Microsoft Edge. They check four viewport widths, keyboard navigation, accessibility, and operation without JavaScript. Screenshots go to `.amp/in/artifacts/`.

With Maestro installed, run the navigation flow against the preview:

```sh
maestro test --platform web --headless --screen-size 1440x1000 tests/portfolio.yaml
maestro test --platform web --headless --screen-size 390x844 tests/portfolio.yaml
```

## Update the content

- Edit experience, capabilities, and the CV link in `src/content.ts`.
- Edit project stories and page content in `src/pages/index.astro`.
- Edit the visual design in `src/styles/global.css`.
- Keep real brand assets in `src/assets/`. Astro optimizes them at build time.

ABBA is a scheduling-system project, not a mobile-app claim. Its metrics come from the CV and are approximate. The image assets for Ecoloop and Mabaat are logos from the previous portfolio, not screenshots of interfaces. Do not replace them with invented product screens.

The contact section links to email, LinkedIn, GitHub, and the Google Docs CV. It has no backend, form, analytics, or phone number.

## Prepare for hosting

The build output is `dist/`. No hosting provider is configured. Before publishing, set Astro's `site` to the chosen production URL and add canonical metadata. If hosting under a path such as GitHub Pages `/portfolio-website/`, also configure Astro's `base` and verify asset URLs under that path.

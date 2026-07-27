# Phase 6 — Performance and asset optimization

## Reproducible profile

Measurements use the production-optimized Vite build with deterministic mock catalog data.
Production builds separately reject mock records with `npm run build:verify`.

- Desktop: 1440×900, 1× CPU, unthrottled local network.
- Mobile: 390×844 at 3× DPR, Fast 4G, 4× CPU slowdown.
- Route: `/catalog`, cold navigation with cache bypass.
- Tool: Chrome DevTools MCP performance trace.

| Metric | Baseline | Optimized | Result |
| --- | ---: | ---: | --- |
| Desktop LCP | 917 ms | 380 ms | 59% faster |
| Desktop CLS | 0.12 | 0.00 | Good |
| Mobile LCP | 1,659 ms | 1,389 ms | 16% faster |
| Mobile CLS | 0.00 | 0.00 | Good |
| Desktop search INP | Not recorded | 35 ms | Good |
| Largest entry chunk | 551 KB | 375 KB | 32% smaller |

These are lab results, not field data. Production CrUX data was unavailable.

## Implemented

- Lazy-loaded product detail, services, and every admin screen.
- Kept mock catalog data in a test-only dynamic chunk and verified it is absent from
  production.
- Removed the Google Fonts request chain and adopted privacy-preserving system font stacks.
- Added intrinsic dimensions to logo, product-card, and product-detail images.
- Added high fetch priority and eager loading to the first catalog card only.
- Generated 640 px WebP card variants for all 83 canonical photos.
- Extended admin image processing to create separate full and thumbnail uploads.
- Added `image_thumbnail_path`, cleanup, rollback, orphan detection, and seed support.
- Replaced the non-composited skeleton background animation with opacity animation.
- Added immutable cache rules for hashed assets and stable static imagery, plus a
  stale-while-revalidate policy for detail images.
- Increased Supabase object cache metadata from one hour to one year for immutable,
  UUID-named uploads.

## Image results and standard

The canonical full image set is 53,377 KB. Generated card variants total 1,020 KB, a 98%
reduction. The average card image is 12.3 KB and the largest is 21.2 KB.

Admin uploads are decoded with orientation applied, converted to WebP, constrained to 1,920
px for detail use, and accompanied by a 640 px WebP thumbnail. Both are UUID-named immutable
objects. Replacing, removing, or deleting a product cleans up both objects; failed database
saves roll back both uploads.

Run `npm run images:generate` after changing canonical static product photos.

## Budgets

`npm run perf:budget` fails when:

- The initial entry chunk exceeds 400,000 bytes.
- Any generated card thumbnail exceeds 100,000 bytes.
- The build does not contain exactly one identifiable entry script.

The normal build no longer emits Vite's unexplained 500 KB chunk warning.

## Remaining production validation

Apply migration `202607270006_image_variants.sql` before deploying the frontend. After
deployment, repeat these traces against the real Cloudflare/Supabase environment to capture
server latency, CDN cache headers, and field data when available.

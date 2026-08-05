# BidRide

Ride. Bid. Save.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/dashboard`.

## What's built — all 12 screens

- `/landing` — hero, live-bid preview cards, "How BidRide works", trust badges
- `/login` — two-panel auth (single column on mobile)
- `/dashboard` — Home / "Where are you going?"
- `/request-ride` — Request a Ride form
- `/live-bidding` — the flagship screen: countdown ring, live driver cards, animated
  odometer-style fare digits (`components/FareTicker.tsx`), gold pulse when a lower
  bid arrives (simulated after 6s so you can see it without wiring a backend)
- `/compare-drivers` — side-by-side comparison table with Best Value / Closest badges
- `/ride-confirmed` — success state, driver card, safety panel
- `/live-tracking` — map, driver marker, trip progress, live fare
- `/ride-complete` — rating, tip selection, receipt, subtle confetti accent
- `/ride-history` — stats cards, ride list, filters
- `/wallet` — balance, payment methods, transaction history, rewards
- `/profile` — profile header, saved places, preferences, achievements, security

`/` redirects to `/landing`. Nav links in the sidebar also point at `/saved-places`,
`/notifications`, `/help-center` — those three weren't in the 12-screen spec so
they're stubbed as links only; say the word if you want them built too.

Shared chrome lives in `components/layout/Sidebar.tsx` and `components/layout/TopBar.tsx`,
wrapped by `components/layout/AppShell.tsx`.

## A note on how this was built

I don't have internet/npm access in this sandbox, so I wrote every file by hand
and checked them for balanced braces/parens and a default export each, but I
was **not able to run `next build` or a type-check** here. Run `npm run build`
locally as your first step — if TypeScript flags anything, paste the error back
to me and I'll fix it immediately.

## ⚠️ Image assets you still need to drop in `/public/images`

I only had your logo to work with. Everything else referenced in the code is
missing — the app will show broken images until these exist (exact filenames
below, pulled directly from the code so nothing is guessed):

```
achievements.png
driver-ada.png
driver-david.png
driver-michael.png
driver-tunde.png
gift.png
honda-accord.png
landing-hero.png
map-placeholder.png
profile-placeholder.png
route-placeholder.png
toyota-camry.png
toyota-corolla.png
```

Fastest path: generate these with an image model (Nigerian driver portraits,
the three car models, map/route placeholders, a gift illustration, an
achievement badge) and drop them in at the exact filenames above — nothing
else needs to change.

## Design tokens

All colors, radii, and fonts live in `tailwind.config.ts` exactly per spec
(navy `#14213D`, gold `#F0A202`, success `#2E8B57`, urgency `#E85D4C`, 20px
card radius, 16px button/input radius, Space Grotesk / Inter / IBM Plex Mono
via `next/font/google` in `app/layout.tsx`).

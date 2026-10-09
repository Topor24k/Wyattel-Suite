# Wyattel Suite

React + TypeScript (strict) + Tailwind CSS v4 website with a focused homepage and
separate suites, gallery, journal, dining/celebrations, offers, planning, and
story pages.

## Run locally

```sh
npm ci
npm run dev        # local site + enquiry API
npm run typecheck  # strict TypeScript
npm test
npm run build      # optimises images, type-checks, then bundles
```

Routes use browser history. Vite supports direct page loads in development.
For production, configure your host to serve `index.html` for page routes without
rewriting image/assets or `/api/*` requests. `vercel.json` provides the Vercel
SPA fallback, and `api/enquiry.js` is a Vercel Node.js function.

## Enquiry delivery

Copy `.env.example` to an ignored `.env.local` and configure:

- `VITE_ENQUIRY_EMAIL`: approved address for the optional user-sent email draft.
  This value is public in the browser bundle; never put a secret here.
- `RESERVATION_TO_EMAIL`: approved destination for server-sent enquiries.
- `RESERVATION_FROM_EMAIL`: sender on an email-service-verified domain.
- `RESEND_API_KEY`: server-only Resend API key. Never use a `VITE_` prefix.

Vite serves the local API in development. On Vercel, configure these environment
variables in the deployment settings. Static-only hosting does not run the API.
Without all server credentials, the form clearly says **not sent** and prepares
an email draft or copyable enquiry. Guests must send drafts themselves.
Only an accepted API response produces an enquiry-submitted status; it never
claims the reservation is confirmed. Mail-provider acceptance is not a guarantee
of inbox delivery.

The endpoint validates contact details, consent, room choices, connected future
stay dates, and event details. It has a honeypot, payload limits, same-origin
checks, a best-effort per-instance rate limit, and idempotency keys. Configure
host-level abuse/rate-limit protections before public launch; the in-memory
limiter is not shared across serverless instances. No live test emails are sent
by the test suite.

## Design system

All styling lives in `src/styles/tailwind.css`. Its `@theme` block defines the
only colours available (porcelain navy, cream, gold, and a lacquer-red accent),
the type scale, and motion timings; every text/background pairing is documented
with its WCAG contrast ratio. Shared building blocks are in `src/components/ui/`
(`Button`, `Eyebrow`, `Section`, `PageHeader`, `Picture`, `Logo`). Overlays use
`src/hooks/useDialog.ts` for focus trapping, Escape, and focus return.

## Phone app experience

Below 768px the site behaves like a native app: a bottom tab bar (Home, Suites,
Book, Gallery, More), an app-style top bar with back buttons and a title that
appears as you scroll, swipeable card rails, and bottom sheets (booking and More)
that can be dragged down to close. Suite pages swap the tab bar for a pinned
request bar. Desktop layouts are unchanged.

The site is installable ("Add to Home Screen") through `public/manifest.webmanifest`
and opens full-screen with safe-area padding for notched phones. Icons in
`public/icons/` are generated from the wordmark by `node scripts/app-icons.mjs`.
There is no offline mode (no service worker), so pages still need a connection.

## Photographs

Originals stay in `public/`. `npm run images` (also run by `npm run build`)
writes responsive WebP copies to `public/optimized/` and a manifest to
`src/data/imageManifest.json`; `<Picture>` serves the right size automatically.
After adding or replacing a photo, run `npm run images` and commit both outputs.
A photo missing from the manifest still renders from its original file.

Suites without their own photographs show a clearly labelled representative
image until real photography is added to `src/data/suiteGalleries.js`.

## Maintaining content

- `src/data.ts`: listed suite details (`rate` is a number in PHP per night).
  Rates, capacity, accessibility, bed setup, and amenities must be approved by
  the hotel before being presented as confirmed.
- `src/data/photos.ts`: local hotel collection and captions. Logos are not photos.
- `src/data/journal.ts`: original editorial planning guides, not testimonials.
- `src/data/offers.ts`: only add approved, dated offers with clear terms. Unapproved,
  future, or expired entries are not shown.
- `src/pages/PlanStayPage.tsx`: FAQs. Unknown policies remain explicitly unconfirmed.

Do not invent guest reviews, discounts, hotel policies, or claims of live availability.
Publish guest stories only with permission and real source material.


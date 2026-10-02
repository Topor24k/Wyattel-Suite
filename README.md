# Wyattel Suite

React + Vite website with a focused homepage and separate suites, gallery,
journal, dining/celebrations, offers, planning, and story pages.

## Run locally

```sh
npm ci
npm run dev
npm test
npm run build
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

## Maintaining content

- `src/data.ts`: listed suite details. Rates, capacity, accessibility, bed setup,
  and amenities must be approved by the hotel before being presented as confirmed.
- `src/data/photos.ts`: local hotel collection and captions. Logos are not photos.
- `src/data/journal.ts`: original editorial planning guides, not testimonials.
- `src/data/offers.ts`: only add approved, dated offers with clear terms. Unapproved,
  future, or expired entries are not shown.
- `src/pages/PlanStayPage.tsx`: FAQs. Unknown policies remain explicitly unconfirmed.

Do not invent guest reviews, discounts, hotel policies, or claims of live availability.
Publish guest stories only with permission and real source material.

All sections and page actions use their own class names. Shared styling provides
layout foundations and reusable save controls, not blanket white hover effects.
Body text in articles, FAQs, forms, and useful contact information remains selectable.

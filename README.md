# Marlon Armado Portfolio

React + Vite starter for a minimal database/system-themed portfolio.

## Run
npm install
npm run dev

## Supabase
Run `supabase/schema.sql` in Supabase SQL Editor, then copy `.env.example` to `.env.local` and add your project URL and anon key.

The UI works in local preview even before Supabase is connected.


## Applied from supplied portfolio
Content now reflects the supplied Marlon Armado portfolio: 4+ years experience; HTML, CSS, JavaScript, PHP, MySQL and React Native; six services; and Human Resources, Car Rental/Transport, and Barangay Management projects.

## UI enhancement update
- Every project screenshot from the old marlonarmado03.github.io site is now in `public/gallery/{hr,carrental,brgy}/` and wired into the `projects` data in `src/main.jsx` as an `images` array per project.
- Projects section was redesigned from a table into a card grid. Each card shows a cover screenshot plus a thumbnail strip.
- Clicking any cover image or thumbnail opens a full-screen **Lightbox** (see the `Lightbox` component in `src/main.jsx`): prev/next arrows, image counter, caption, closes on the X button, backdrop click, or Escape key. Works on desktop and mobile.
- The graduation photo (`public/marlon-grad.png`) is a small clickable badge on the hero photo — also opens in the lightbox.
- Fonts and spacing were bumped up across the site (hero bio, project text, skills, timeline, services, contact form) for readability, and cards/links/buttons now have hover and focus states plus a subtle scroll-reveal animation (`prefers-reduced-motion` is respected).
- Two stock photos bundled in the old repo (`background.png`, `about.jpg`) were left out since they were placeholder images of someone else, not Marlon.

To add or reorder screenshots for a project, edit the `images` array for that project in `src/main.jsx` — each entry is `{ src, caption }`.

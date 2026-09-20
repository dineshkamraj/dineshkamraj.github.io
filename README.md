# Invictus Enterprises — Website

A lightweight, static website (HTML/CSS/JS only — no build step, no paid
services required).

## What's inside

```
index.html          The whole site (one page, anchor-linked sections)
styles.css           All styling
script.js             Nav, scroll reveals, approach timeline, contact form
assets/
  invictus-icon.png        Standalone monogram (web-optimised, transparent)
  invictus-full-logo.png   Full "Invictus Enterprises" lockup (web-optimised)
  favicon-32.png            Browser tab icon
  favicon-180.png            Apple touch icon
```

Both logos are your original files, used exactly as provided — only
losslessly compressed and resized for the web (full quality, ~170KB total
for both, down from ~1.5MB) so the site loads fast on mobile data.

## Preview it locally

Double-click `index.html`, or from a terminal in this folder:

```
python3 -m http.server 8000
```

then open `http://localhost:8000` in a browser.

## Deploy for free (pick one)

**Netlify (drag-and-drop, easiest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this whole folder onto the page
3. You get a live `https://…netlify.app` link instantly. Add a custom
   domain later from Site settings if you want one.

**Cloudflare Pages**
1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. "Create a project" → "Direct upload" → drag this folder in
3. Deploy — free, fast global CDN.

**GitHub Pages**
1. Create a new GitHub repository and push these files to it
2. Repo → Settings → Pages → set source to the `main` branch, root folder
3. Your site publishes at `https://<username>.github.io/<repo>`

All three are permanently free for a site this size and need no backend,
credit card, or paid plan.

## Things you may want to personalise later

- **Contact email:** the enquiry form opens the visitor's email app addressed
  to `contact@invictushq.in`. To change it, open `script.js` and edit the
  `ENQUIRY_EMAIL` value near the bottom.
- **Phone number:** it now appears in two places — the WhatsApp button in the
  Contact section (`href="https://wa.me/919150890808"`) and the footer
  (`href="tel:+919150890808"`). Update both in `index.html`, plus the visible
  text `+91 - 91508 90808` in each spot, if the number changes.
- **WhatsApp icon:** the icon next to the phone number is a simplified icon
  I drew myself (not Meta's official logo file) to avoid reproducing
  trademarked brand artwork. If you'd prefer Meta's official WhatsApp badge,
  you can download an approved one from
  [Meta's brand resources](https://about.meta.com/brand/resources/whatsapp/whatsapp-brand)
  and swap it in.
- **Open Graph image URL:** once you have a live domain, update the
  `og:image` tag in `index.html`'s `<head>` to a full absolute URL (e.g.
  `https://yourdomain.com/assets/invictus-full-logo.png`) so link previews
  on WhatsApp/LinkedIn pick it up correctly.

## Notes

- No backend, database, or paid API is used anywhere. The contact "form"
  is a `mailto:` handoff to the visitor's own email client, as requested —
  it does not silently pretend to submit anywhere.
- All animations respect `prefers-reduced-motion` and are built with plain
  CSS transitions + `IntersectionObserver` (no animation libraries).
- No statistics, testimonials, client names, or claims beyond what you
  provided are included anywhere on the site.

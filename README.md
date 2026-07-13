# Caldwell & Partners — Law Firm Website

A premium, production-quality law firm website built with **pure HTML5, CSS3, and Vanilla JavaScript** — zero external frameworks, libraries, or dependencies (except Google Fonts).

---

## Project Structure

```
Law Firm Website/
├── index.html              Home page (all sections)
├── about.html              About Us
├── practice-areas.html     Practice Area details
├── attorneys.html          Attorney profiles
├── blog.html               Legal Insights & News
├── contact.html            Contact form & office info
├── css/
│   └── style.css           Main stylesheet (~4000+ lines)
├── js/
│   └── script.js           All interactive functionality (~600 lines)
├── assets/
│   └── favicon.svg         SVG favicon (C&P mark)
└── README.md               This file
```

---

## Technology Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Markup     | HTML5 (semantic, ARIA, structured data) |
| Styling    | CSS3 (custom properties, Grid, Flexbox) |
| Scripting  | Vanilla JavaScript ES6+ (strict mode)   |
| Fonts      | Google Fonts — Cormorant Garamond + Inter |
| Icons      | Inline SVG (no icon library needed)     |
| SEO        | JSON-LD structured data, OG/Twitter meta|

No Bootstrap. No Tailwind. No React. No Vue. No jQuery. No npm.

---

## Pages

| File                   | Title                        | Key Sections                                                                 |
|------------------------|------------------------------|------------------------------------------------------------------------------|
| `index.html`           | Home                         | Hero, Features, Practice Areas, Stats, About Preview, Attorneys, Testimonials, Pricing, FAQ, Contact |
| `about.html`           | About Us                     | Story, Stats Banner, Core Values, Timeline, CTA                              |
| `practice-areas.html`  | Practice Areas               | 6 full practice cards (Corporate, Criminal, Family, RE, IP, Personal Injury) |
| `attorneys.html`       | Our Attorneys                | 6 attorney profile cards with bios, specialties, skills                      |
| `blog.html`            | Legal Insights & News        | Category filters, Featured article, Article grid, Pagination                 |
| `contact.html`         | Contact Us                   | Contact info cards, Office hours, Map placeholder, Full contact form          |

---

## Features

### Design & UX
- **Dark/Light theme toggle** — system preference auto-detected, persisted in `localStorage`
- **Responsive** — mobile-first, tested from 320px to 1440px+
- **Fluid typography** — `clamp()` for seamless text scaling
- **Smooth scroll** — native + JS-enhanced for full browser support
- **Loading animation** — animated page loader on every page
- **Scroll reveal animations** — `IntersectionObserver` for `.reveal`, `.reveal-left`, `.reveal-right`
- **Back-to-top button** — appears after 300px scroll
- **Ripple button effect** — CSS + JS ripple on all buttons

### Components
- Sticky navigation with transparent-to-solid scroll effect
- Mobile hamburger drawer with focus trap & Escape key close
- Testimonials slider with touch/swipe and auto-play
- Animated statistics counters (requestAnimationFrame)
- FAQ accordion with ARIA expanded state
- Pricing toggle (monthly/annual)
- Blog category filters
- Newsletter signup form

### Accessibility (WCAG 2.1 AA)
- Skip navigation link
- Semantic HTML5 landmarks
- ARIA labels, roles, `aria-expanded`, `aria-hidden`, `aria-current`
- Focus management in mobile menu
- `prefers-reduced-motion` respected
- All interactive elements keyboard-navigable

### Performance
- Google Fonts loaded non-blocking (`preload` + `onload` pattern)
- Zero render-blocking scripts (all `defer`)
- Inline SVG icons (no extra HTTP requests)
- No unused CSS (single stylesheet, no framework overhead)

### SEO & Security
- Full `<meta>` tags (description, OG, Twitter Card, canonical, robots)
- JSON-LD structured data (`LegalService` schema on home page, `ContactPage` on contact)
- XSS prevention — all form inputs sanitized via HTML entity encoding
- No `innerHTML` usage in JavaScript
- Email/phone regex validation at form level

---

## Running Locally

No build step required. Simply open in your browser:

```
index.html  →  double-click or drag into any modern browser
```

Or use a local dev server for a better experience:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code Live Server extension
Right-click index.html → "Open with Live Server"
```

Then visit: `http://localhost:8000`

---

## Deployment

### Option A — Netlify (recommended, free)
1. Go to [netlify.com](https://netlify.com) and create a free account
2. Drag the entire `Law Firm Website` folder onto the Netlify dashboard
3. Your site is live instantly with a `.netlify.app` URL
4. Add a custom domain in Site Settings → Domain Management

### Option B — GitHub Pages (free)
1. Create a new GitHub repository
2. Upload all files (or `git push`)
3. Go to Settings → Pages → Deploy from branch → `main` → `/ (root)`
4. Visit `https://<username>.github.io/<repo-name>`

### Option C — Any Web Host
Upload all files via FTP/SFTP to your hosting provider's `public_html` or `www` directory.

---

## Customization

| What to Change       | Where to Change It                                    |
|----------------------|-------------------------------------------------------|
| Firm name            | All HTML files — search/replace "Caldwell & Partners" |
| Phone number         | All HTML files & `contact.html`                       |
| Email address        | All HTML files & `contact.html`                       |
| Office address       | `index.html` (footer + contact section), `contact.html` |
| Colors               | `css/style.css` — `:root` CSS variables (lines ~1–60) |
| Fonts                | `css/style.css` — `--ff-heading` and `--ff-body`      |
| Attorney profiles    | `attorneys.html` & preview cards in `index.html`      |
| Practice areas       | `practice-areas.html` & cards in `index.html`         |
| Pricing tiers        | `index.html` pricing section                          |
| Blog articles        | `blog.html`                                           |
| SEO metadata         | `<head>` of each HTML file                            |
| JSON-LD schema       | `<script type="application/ld+json">` in `index.html` |

---

## Browser Support

| Browser          | Support |
|------------------|---------|
| Chrome 90+       | ✅       |
| Firefox 88+      | ✅       |
| Safari 14+       | ✅       |
| Edge 90+         | ✅       |
| Opera 76+        | ✅       |
| IE 11            | ❌ (not supported — uses modern CSS/JS features) |

---

## Performance Notes

- Target: **90+ Lighthouse score** on all pages
- No external dependencies beyond Google Fonts
- Images: currently using CSS-generated placeholders (initials/icons) — replace with optimized WebP images for production
- For production: minify `style.css` and `script.js`, enable gzip compression on the server

---

## License

This project is released for personal and commercial use. Attribution is appreciated but not required.

---

*Caldwell & Partners Law Firm Website — Est. 1985 · New York, NY*

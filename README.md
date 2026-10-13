# Rakzs Studio — Official Website

> **"We Capture Memories"**  
> Premium portfolio and enquiry website for Rakzs Studio — covering weddings, pre-weddings, portraits, parties, and corporate events.

---

## 🌟 Overview

Rakzs Studio's website is a high-performance, dark-luxury photography portfolio designed with high aesthetic standards:
- **Rich Aesthetic Design**: Cormorant Garamond & Inter typography, gold accent palette, subtle grain texture, and silky smooth micro-interactions.
- **Optimized Media Architecture**: Standalone lightweight WebP/JPEG assets extracted from inline payloads, reducing initial HTML document size by **99.6%** (from 15MB down to ~24KB).
- **Interactive Lightbox**: Full-screen modal viewer with keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`) and touch swipe gestures.
- **Direct Lead Generation**: Seamless inquiry routing directly to **WhatsApp** and **Instagram DM**, complete with pre-filled event details and custom collection selection.
- **Vercel Edge Ready**: Pre-configured with `vercel.json` for immutable static asset caching and HTTP security headers.

---

## 📁 Project Structure

```
rakzs-studio-website-vercel/
├── assets/
│   ├── css/
│   │   └── styles.css          # Modular production stylesheet
│   ├── js/
│   │   └── main.js             # Filter, lightbox, animations, enquiry JS
│   └── images/                 # Optimized photographic assets & logos
│       ├── logo.jpg
│       ├── hero-wedding.jpg
│       ├── film-wedding-vandhana.jpg
│       ├── portrait-window-light.webp
│       └── ...
├── index.html                  # Semantic, SEO-optimized HTML5 document
├── vercel.json                 # Caching & security headers for Vercel
├── robots.txt                  # Search engine directives
├── sitemap.xml                 # SEO sitemap
├── manifest.webmanifest        # PWA & web application manifest
├── package.json                # Project scripts
└── README.md
```

---

## 🚀 Running Locally

You can run the site using any static web server:

```bash
# Using Node.js / npx:
npx serve .

# Or using Python:
python -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

### Option 1: Vercel CLI
```bash
npx vercel
```

### Option 2: GitHub Integration
1. Push this repository to GitHub.
2. Import the repository in your [Vercel Dashboard](https://vercel.com/new).
3. Framework preset: **Other** / **Static Site**.
4. Click **Deploy**.

---

## 📞 Studio Contact & Socials

- **WhatsApp**: [+91 85220 59034](https://wa.me/918522059034)
- **Instagram**: [@rakzsstudio](https://www.instagram.com/rakzsstudio)

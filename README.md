# Rakzs Studio — Official Website

> **"We Capture Memories"**  
> Luxury photography and cinema portfolio for Rakzs Studio — covering weddings, pre-weddings, portraits, parties, and corporate events.

---

## 📁 Architectural Separation (`frontend` & `backend`)

This project is organized into dedicated `frontend` and `backend` modules for clean separation of concerns:

```
rakzs-studio-website-vercel/
├── frontend/                     # Client-facing UI & assets
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css        # Luxury dark-gold aesthetic stylesheet
│   │   ├── js/
│   │   │   └── main.js           # Filtering, lightbox, animations & form logic
│   │   └── images/               # Optimized WebP & progressive JPEG assets
│   ├── index.html                # Semantic, SEO-optimized HTML5 entry point
│   ├── manifest.webmanifest      # Mobile PWA web manifest
│   ├── robots.txt                # Search crawler rules
│   └── sitemap.xml               # Search engine index sitemap
│
├── backend/                      # Server & API services
│   ├── api/
│   │   ├── enquiry.js            # Serverless lead validator & router
│   │   └── health.js             # API health check endpoint
│   ├── server.js                 # Zero-dependency local Node.js static & API server
│   └── package.json              # Backend package metadata
│
├── vercel.json                   # Vercel Edge routing (rewrites to frontend & backend)
├── package.json                  # Root scripts (`npm start` launches backend server)
├── .gitignore
└── README.md
```

---

## 🚀 Running Locally

To run the full stack locally:

```bash
# From root directory:
npm start
# or:
node backend/server.js
```

- **Frontend Website**: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- **Backend Health Check**: [http://127.0.0.1:3000/api/health](http://127.0.0.1:3000/api/health)

---

## ☁️ Deploying to Vercel

The project is pre-configured with `vercel.json` rewrites:
- Routes `/(.*)` seamlessly to `/frontend/$1`.
- Routes `/api/(.*)` to `/backend/api/$1`.
- Implements 1-year immutable caching on static assets (`Cache-Control: public, max-age=31536000, immutable`).
- Applies strict HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

To deploy:
```bash
npx vercel
```
Or connect this GitHub repository in your Vercel dashboard.

---

## 📞 Studio Contact & Socials

- **WhatsApp**: [+91 85220 59034](https://wa.me/918522059034)
- **Instagram**: [@rakzsstudio](https://www.instagram.com/rakzsstudio)

# FluxCast 📺

A modern, fast, and responsive IPTV streaming web application built with React and powered by the [IPTV-org](https://github.com/iptv-org/iptv) database. Watch live TV channels from around the world with an intuitive grid-based interface.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://tv.abhiyanpa.in/)
[![Portfolio Demo](https://img.shields.io/badge/portfolio-demo-blue)](https://fluxcast-1cbb7.web.app)
[![License: Custom](https://img.shields.io/badge/License-Custom-red.svg)](LICENSE)

> **⚠️ IMPORTANT:** This repository is for **portfolio and educational purposes only**. See [LICENSE](LICENSE) for usage restrictions.

## ✨ Features

- 🌍 **8,625+ Live Channels** - Access channels from 179 countries worldwide
- 🎯 **Smart Filtering** - Filter by country (with full names) and category
- 🔍 **Real-time Search** - Instantly search through thousands of channels
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🎬 **HLS Streaming** - Adaptive streaming with HLS.js
- 🚀 **Blazing Fast** - Lazy loading and performance optimizations
- 🗺️ **SEO Optimized** - Comprehensive sitemaps for search engines
- 📡 **Live API** - Always up-to-date with IPTV-org database
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fluxcast-frontend.git
   cd fluxcast-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📦 Build for Production

```bash
# Build the project (automatically generates sitemaps)
npm run build

# Preview production build
npm run preview
```

The build files will be in the `dist` folder.

## 🌐 Deployment

### Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

### Other Platforms

The `dist` folder can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **Video Player:** HLS.js
- **Icons:** Lucide React
- **SEO:** React Helmet Async
- **API:** IPTV-org Database
- **Hosting:** Firebase Hosting

## 📂 Project Structure

```
fluxcast-frontend/
├── public/             # Static files
│   ├── manifest.json   # PWA manifest
│   ├── robots.txt      # SEO robots file
│   └── sitemap*.xml    # Auto-generated sitemaps
├── scripts/
│   └── generate-sitemap.js  # Live sitemap generator
├── src/
│   ├── components/     # Reusable components
│   │   └── Layout.jsx  # Main layout wrapper
│   ├── pages/          # Page components
│   │   ├── Home.jsx    # Channel grid
│   │   ├── Channel.jsx # Channel player
│   │   ├── About.jsx   # About page
│   │   ├── Legal.jsx   # Legal disclaimers
│   │   └── Privacy.jsx # Privacy policy
│   ├── utils/
│   │   └── countries.js # Country code mapping
│   ├── App.jsx         # Main app component
│   ├── firebase.js     # Firebase config
│   ├── main.jsx        # App entry point
│   └── style.css       # Global styles
├── .gitignore
├── firebase.json       # Firebase config
├── index.html
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

## 🎯 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes sitemap generation)
- `npm run preview` - Preview production build
- `npm run generate-sitemap` - Manually generate sitemaps from live API

## 🌍 Features in Detail

### Live API Integration
FluxCast fetches real-time data from the IPTV-org database, ensuring:
- Always current channel listings
- Active streams only (verified availability)
- Automatic updates with each build

### SEO Optimization
- Automatically generated sitemaps (12 files)
- 8,625 individual channel pages
- 179 country filter pages
- 29 category filter pages
- Proper meta tags and structured data
- Daily lastmod updates

### Country Name Display
Full country names displayed instead of codes:
- `IN` → `India`
- `US` → `United States`
- `GB` → `United Kingdom`
- 179 total countries supported

## ⚖️ Legal

**Important Disclaimer:**

This project is a web interface for publicly available IPTV streams from the [IPTV-org](https://github.com/iptv-org/iptv) database. FluxCast:

- Does NOT host any video content
- Does NOT provide any streaming infrastructure
- Does NOT modify or redistribute copyrighted content
- Only aggregates publicly available stream URLs

**All content is the property of their respective copyright holders.** Users are responsible for complying with local laws and respecting intellectual property rights.

### IPTV-org Attribution

This project uses the [IPTV-org](https://github.com/iptv-org/iptv) database, which is licensed under the [Unlicense](https://github.com/iptv-org/iptv/blob/master/LICENSE). We are grateful to the IPTV-org community for maintaining this comprehensive database.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License & Usage

**This is NOT open-source software.** This repository is published for **portfolio and educational purposes only**.

### ⚠️ Usage Restrictions

- ✅ **Allowed:** View, study, and learn from the code
- ✅ **Allowed:** Use for educational purposes and personal learning
- ❌ **Restricted:** Production use without proper attribution
- ❌ **Restricted:** Commercial use without permission

### 📋 If You & Licensing

- **Production Site:** https://tv.abhiyanpa.in/
- **For Licensing Inquiries:** Contact through GitHub issues
- **Report Unauthorized Use:** Open an issue with evidence

---

## ⚠️ DISCLAIMERS

### Content Disclaimer
This application only provides access to publicly available streams from the IPTV-org database. All streaming content is the property of their respective copyright holders. Users are solely responsible for their use of this application and must comply with applicable laws in their jurisdiction.

### Code Usage Disclaimer  
This repository is for **portfolio demonstration only**. Any production use requires explicit attribution as detailed in the [LICENSE](LICENSE). The author reserves all rights to enforce takedown of unauthorized derivative works.

**Portfolio Project by Abhiyan PA © 2026**
   - About/Credits page
   - FAQ page

2. **Attribution Format:**
   ```
   Built using FluxCast by Abhiyan PA
   https://tv.abhiyanpa.in/
   ```

3. **Include a working hyperlink** to:
   - Production site: https://tv.abhiyanpa.in/
   - OR this GitHub repository

### ⚖️ Enforcement

The copyright holder reserves the right to **take down any website** using this code without proper attribution. Violations will result in:
- DMCA takedown notices
- Hosting provider complaints
- Legal action if necessary

**See [LICENSE](LICENSE) file for complete terms.**

### 🔗 Production Site

Live production version: **https://tv.abhiyanpa.in/**

## 🙏 Acknowledgments

- [IPTV-org](https://github.com/iptv-org/iptv) - For the comprehensive IPTV database
- [HLS.js](https://github.com/video-dev/hls.js/) - For HLS streaming support
- [Lucide Icons](https://lucide.dev/) - For beautiful icons
- [Vite](https://vitejs.dev/) - For blazing fast builds

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**⚠️ Content Disclaimer:** This application only provides access to publicly available streams. All streaming content is the property of their respective copyright holders. Users are solely responsible for their use of this application and must comply with applicable laws in their jurisdiction.

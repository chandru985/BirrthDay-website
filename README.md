# Premium Birthday Celebration — Static Website

A luxurious, fully responsive static birthday website built with vanilla **HTML, CSS, and JavaScript** — no frameworks, no backend.

## ✨ Features
- Cinematic dark-romantic aesthetic with gold, burgundy, champagne & rose tones
- Animated background particles + twinkling stars
- Glassmorphism cards with gold accents
- Premium countdown timer
- Lightbox photo gallery (masonry, keyboard + button navigation)
- "Why You Are Special" card grid with hover effects
- Vertical timeline of memories
- Surprise reveal with confetti + floating hearts
- Animated CSS birthday cake with blow-out candles
- Floating hearts + confetti canvas
- Scroll-reveal animations
- Back-to-top button
- Music toggle (does not autoplay; gracefully handles missing audio file)
- Fully responsive (mobile / tablet / desktop)

## 📁 Project Structure
```
birthday-website/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── birthday-music.mp3   (optional — site works without it)
│   └── photos...            (replace photo URLs in script or HTML)
└── README.md
```

## 🛠 Customization

Open `index.html` and edit the configuration block at the top of the page:

```js
window.BIRTHDAY_CONFIG = {
    name: "Alex",
    from: "Your Best Friend",
    date: "September 14, 2026",
    targetISO: "2026-09-14T00:00:00",
    profileImage: "https://...",
    photos: [
        "https://...",
        "https://...",
        ...
    ]
};
```

### Timeline entries
Edit the markup inside `<section id="timeline">` in `index.html`.

### Special message text
Edit the paragraphs inside `<section id="message">`.

### Surprise message
Edit the markup inside `<section id="surprise">`.

## 🎵 Music
Drop a file named `birthday-music.mp3` into the `assets/` folder and click the music button in the corner. The site works normally without it.

## 🚀 Run Locally
Just open `index.html` in any modern browser. No build step required.

## 📱 Browser Support
Tested on the latest Chrome, Firefox, Safari, and Edge. Uses CSS `backdrop-filter` for glassmorphism.

---

© 2026 Birthday Celebration
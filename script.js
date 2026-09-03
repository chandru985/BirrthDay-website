/* =========================================================
   Premium Birthday — Interactions
   ========================================================= */

(function () {
    'use strict';

    const CFG = window.BIRTHDAY_CONFIG || {};

    /* -------------------------------------------------
       Helpers
    ------------------------------------------------- */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    function applyBindings() {
        $$('[data-bind]').forEach(el => {
            const key = el.dataset.bind;
            if (CFG[key] !== undefined) el.textContent = CFG[key];
        });
        const profile = $('#profileImg');
        if (profile && CFG.profileImage) profile.src = CFG.profileImage;
    }

    /* -------------------------------------------------
       Background canvas: particles + stars
    ------------------------------------------------- */
    function initBackgroundCanvas() {
        const canvas = $('#bgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h;
        const particles = [];
        const stars = [];
        const COUNT = Math.min(60, Math.floor(window.innerWidth / 18));

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function spawn() {
            for (let i = 0; i < COUNT; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.6 + 0.4,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    hue: Math.random() > 0.5 ? '232, 201, 138' : '201, 122, 138',
                    a: Math.random() * 0.5 + 0.2
                });
            }
            for (let i = 0; i < 30; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 0.8 + 0.3,
                    twinkle: Math.random() * Math.PI * 2
                });
            }
        }

        function tick() {
            ctx.clearRect(0, 0, w, h);

            // Stars
            stars.forEach(s => {
                s.twinkle += 0.02;
                const a = 0.4 + Math.sin(s.twinkle) * 0.4;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 201, 138, ${a})`;
                ctx.fill();
            });

            // Particles
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.hue}, ${p.a})`;
                ctx.fill();
            });

            requestAnimationFrame(tick);
        }

        window.addEventListener('resize', () => { resize(); });
        resize();
        spawn();
        tick();
    }

    /* -------------------------------------------------
       Countdown
    ------------------------------------------------- */
    function pad(n) { return String(n).padStart(2, '0'); }

    function initCountdown() {
        const days = $('#days'), hours = $('#hours'), mins = $('#minutes'), secs = $('#seconds');
        const msg = $('#countdownMessage');
        if (!days) return;

        const target = new Date(CFG.targetISO || Date.now() + 86400000).getTime();

        function update() {
            const diff = target - Date.now();
            if (diff <= 0) {
                days.textContent = hours.textContent = mins.textContent = secs.textContent = '00';
                if (msg) msg.classList.remove('hidden');
                clearInterval(timer);
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            days.textContent = pad(d);
            hours.textContent = pad(h);
            mins.textContent = pad(m);
            secs.textContent = pad(s);
        }

        update();
        const timer = setInterval(update, 1000);
    }

    /* -------------------------------------------------
       Gallery + Lightbox
    ------------------------------------------------- */
    function initGallery() {
        const grid = $('#galleryGrid');
        if (!grid || !Array.isArray(CFG.photos)) return;

        CFG.photos.forEach((src, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = i;
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.alt = `Memory ${i + 1}`;
            img.src = src;
            item.appendChild(img);
            grid.appendChild(item);
        });

        const lb = $('#lightbox');
        const lbImg = $('#lbImg');
        const lbCounter = $('#lbCounter');
        let current = 0;

        function open(i) {
            current = i;
            lbImg.src = CFG.photos[current];
            lbCounter.textContent = `${current + 1} / ${CFG.photos.length}`;
            lb.classList.add('open');
            lb.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
        function close() {
            lb.classList.remove('open');
            lb.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
        function next() { open((current + 1) % CFG.photos.length); }
        function prev() { open((current - 1 + CFG.photos.length) % CFG.photos.length); }

        grid.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (item) open(parseInt(item.dataset.index, 10));
        });
        $('.lb-close', lb).addEventListener('click', close);
        $('.lb-next', lb).addEventListener('click', next);
        $('.lb-prev', lb).addEventListener('click', prev);
        lb.addEventListener('click', e => { if (e.target === lb) close(); });
        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        });
    }

    /* -------------------------------------------------
       Surprise reveal
    ------------------------------------------------- */
    function initSurprise() {
        const btn = $('#surpriseBtn');
        const reveal = $('#surpriseReveal');
        if (!btn || !reveal) return;
        btn.addEventListener('click', () => {
            reveal.classList.remove('hidden');
            btn.style.display = 'none';
            burstConfetti();
            burstHearts(40);
            reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    /* -------------------------------------------------
       Cake — blow candles
    ------------------------------------------------- */
    function initCake() {
        const btn = $('#blowBtn');
        const wish = $('#wishText');
        const candles = $$('.candle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            candles.forEach(c => c.classList.add('blown'));
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'default';
            if (wish) wish.classList.remove('hidden');
            burstConfetti();
            burstHearts(25);
        });
    }

    /* -------------------------------------------------
       Floating hearts
    ------------------------------------------------- */
    function burstHearts(count = 20) {
        const container = $('#floatingHearts');
        if (!container) return;
        const symbols = ['❤', '💕', '✨', '🌟', '💖'];
        for (let i = 0; i < count; i++) {
            const h = document.createElement('span');
            h.className = 'float-heart';
            h.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            h.style.left = Math.random() * 100 + '%';
            h.style.fontSize = (Math.random() * 18 + 14) + 'px';
            h.style.animationDuration = (Math.random() * 4 + 5) + 's';
            h.style.animationDelay = (Math.random() * 1.5) + 's';
            container.appendChild(h);
            setTimeout(() => h.remove(), 9000);
        }
    }

    /* Ambient floating hearts */
    function ambientHearts() {
        setInterval(() => burstHearts(2), 4000);
    }

    /* -------------------------------------------------
       Confetti
    ------------------------------------------------- */
    function initConfetti() {
        const canvas = $('#confettiCanvas');
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    function burstConfetti() {
        const canvas = $('#confettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const pieces = [];
        const colors = ['#e8c98a', '#7a1f3d', '#c97a8a', '#f5e0b3', '#efe6d2'];

        for (let i = 0; i < 160; i++) {
            pieces.push({
                x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 14,
                vy: Math.random() * -16 - 4,
                w: Math.random() * 8 + 4,
                h: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * Math.PI * 2,
                vr: (Math.random() - 0.5) * 0.3,
                life: 0,
                maxLife: 180
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            pieces.forEach(p => {
                p.vy += 0.35;
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vr;
                p.life++;
                const alpha = Math.max(0, 1 - p.life / p.maxLife);
                if (p.life < p.maxLife && p.y < canvas.height + 40) alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            if (alive) requestAnimationFrame(draw);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        draw();
    }

    /* -------------------------------------------------
       Scroll reveal
    ------------------------------------------------- */
    function initReveal() {
        const els = $$('.reveal');
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(el => io.observe(el));
    }

    /* -------------------------------------------------
       Back to top
    ------------------------------------------------- */
    function initBackToTop() {
        const btn = $('#backToTop');
        if (!btn) return;
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 500);
        });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* -------------------------------------------------
       Music control
    ------------------------------------------------- */
    function initMusic() {
        const btn = $('#musicBtn');
        const audio = $('#bgMusic');
        if (!btn || !audio) return;

        audio.volume = 0.5;

        btn.addEventListener('click', () => {
            if (audio.paused) {
                const p = audio.play();
                if (p && p.catch) p.catch(() => {
                    // File missing or blocked — silent fallback
                    btn.classList.remove('playing');
                });
                btn.classList.add('playing');
            } else {
                audio.pause();
                btn.classList.remove('playing');
            }
        });

        audio.addEventListener('error', () => {
            btn.style.opacity = '0.4';
            btn.title = 'Add assets/birthday-music.mp3 to enable music';
        });
    }

    /* -------------------------------------------------
       Greeting Card
    ------------------------------------------------- */
    function initGreetingCard() {
        const card = $('#greetingCard');
        const audio = $('#bgMusic');
        const btn = $('#musicBtn');
        if (!card) return;
        function open() {
            card.classList.add('opened');
            burstConfetti();
            burstHearts(30);
            setTimeout(() => card.remove(), 900);
            if (audio && audio.paused) {
                const p = audio.play();
                if (p && p.catch) p.catch(() => {});
            }
            if (btn) btn.classList.add('playing');
        }
        card.addEventListener('click', open);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
    }

    /* -------------------------------------------------
       Smooth scroll for in-page anchors
    ------------------------------------------------- */
    function initSmoothScroll() {
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const id = a.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    }

    /* -------------------------------------------------
       Premium Interactions
    ------------------------------------------------- */
    function initPremiumEffects() {
        const hero = document.querySelector('.hero-inner');
        if (hero) {
            let ticking = false;
            document.addEventListener('mousemove', e => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        const x = (e.clientX / window.innerWidth - 0.5) * 20;
                        const y = (e.clientY / window.innerHeight - 0.5) * 20;
                        hero.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        const cards = document.querySelectorAll('.special-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* -------------------------------------------------
       Init
    ------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
        applyBindings();
        initBackgroundCanvas();
        initCountdown();
        initGallery();
        initSurprise();
        initCake();
        initConfetti();
        initReveal();
        initBackToTop();
        initMusic();
        initGreetingCard();
        initSmoothScroll();
        initPremiumEffects();
        ambientHearts();
    });
})();
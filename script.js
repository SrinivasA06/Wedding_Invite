/* ============ Wedding Invitation — Script ============ */
(function () {
    'use strict';

    // ---- Countdown Timer ----
    const weddingDate = new Date('2026-07-02T10:00:00-04:00').getTime();
    const $days = document.getElementById('countDays');
    const $hours = document.getElementById('countHours');
    const $mins = document.getElementById('countMinutes');
    const $secs = document.getElementById('countSeconds');

    function updateCountdown() {
        const now = Date.now();
        const diff = weddingDate - now;
        if (diff <= 0) {
            $days.textContent = '🎉';
            $hours.textContent = '🎉';
            $mins.textContent = '🎉';
            $secs.textContent = '🎉';
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        $days.textContent = String(d).padStart(2, '0');
        $hours.textContent = String(h).padStart(2, '0');
        $mins.textContent = String(m).padStart(2, '0');
        $secs.textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ---- Navigation ----
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        nav.classList.toggle('scrolled', y > 100);
        nav.classList.toggle('visible', y > 300);
        lastScroll = y;
    });

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    // Close mobile menu on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 200;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = links.querySelector(`a[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    });

    // ---- Scroll Animations ----
    const animElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    animElements.forEach(el => observer.observe(el));

    // ---- Floating Petals ----
    const petalsContainer = document.getElementById('petalsContainer');
    const petalColors = [
        '#E07B39', '#C9A84C', '#F5C518', '#E8D48B',
        '#ff6b6b', '#ff8787', '#ffa07a', '#FFD700'
    ];

    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = 8 + Math.random() * 14;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.backgroundColor = petalColors[Math.floor(Math.random() * petalColors.length)];
        petal.style.animationDuration = (8 + Math.random() * 12) + 's';
        petal.style.animationDelay = Math.random() * 4 + 's';
        petal.style.opacity = 0.3 + Math.random() * 0.4;
        petalsContainer.appendChild(petal);
        setTimeout(() => petal.remove(), 22000);
    }

    // Create petals periodically
    setInterval(createPetal, 1500);
    // Initial burst
    for (let i = 0; i < 8; i++) setTimeout(createPetal, i * 300);

    // ---- Parallax on hero ----
    const heroOverlay = document.querySelector('.hero-overlay');
    window.addEventListener('scroll', () => {
        if (heroOverlay) {
            const y = window.scrollY;
            heroOverlay.style.transform = `translateY(${y * 0.3}px)`;
        }
    });
    // ---- RSVP Form Handler ----
    const rsvpForm = document.getElementById('rsvpForm');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz64LZvQIZpml5h2ZRD9HFfTbUG1Jtolfvn9azSjIHbNmMsh_io8cAasvqUi7HEUIUCBQ/exec'; // <-- PASTE YOUR URL HERE

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', e => {
            e.preventDefault();

            // Get all selected events
            const checkedEvents = Array.from(document.querySelectorAll('input[name="events"]:checked'))
                .map(cb => cb.value)
                .join(', ');

            // Create form data
            const formData = new FormData(rsvpForm);
            formData.set('events', checkedEvents); // Replace array with string

            // Change button text while loading
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    rsvpForm.style.display = 'none';
                    document.getElementById('rsvpSuccess').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Oops! Something went wrong. Please try again.');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }


})();

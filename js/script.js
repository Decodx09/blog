document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle (initialize first so it works even if Lenis fails)
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navList) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navList.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navList.contains(e.target) && navList.classList.contains('active')) {
                navList.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // Smooth Scroll (Lenis) — wrapped so a load failure doesn't break the page
    try {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    } catch (e) {
        console.warn('Lenis smooth scroll unavailable:', e);
    }

    // Custom Cursor (hidden on touch devices)
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');

    if (cursorDot && cursorOutline && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // Dot follows instantly (compositor-only transform)
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }, { passive: true });

        // Outline trails via a single rAF loop instead of spawning an animation per move
        (function trailCursor() {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(trailCursor);
        })();
    }

    // Reveal on Scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section, footer');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Add fade styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .fade-in-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            will-change: opacity, transform;
        }
        .fade-in-section.visible {
            opacity: 1;
            transform: none;
        }
    `;
    document.head.appendChild(styleSheet);

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                if (response.ok) {
                    btn.textContent = 'Sent!';
                    contactForm.reset();
                    setTimeout(() => { btn.textContent = originalText; }, 3000);
                } else {
                    console.error('Send failed:', await response.text());
                    btn.textContent = 'Failed - Try Again';
                    setTimeout(() => { btn.textContent = originalText; }, 3000);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                btn.textContent = 'Failed - Try Again';
                setTimeout(() => { btn.textContent = originalText; }, 3000);
            } finally {
                btn.disabled = false;
            }
        });
    }
});

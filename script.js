document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    document.querySelectorAll('.reveal-text, .reveal-up').forEach(el => observer.observe(el));
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        const sphere1 = document.querySelector('.sphere-1');
        const sphere2 = document.querySelector('.sphere-2');
        if (sphere1 && sphere2) {
            sphere1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            sphere2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
        }
    });
    const titleElement = document.querySelector('.profile-title');
    if (titleElement) {
        titleElement.style.transition = "opacity 0.4s ease-in-out";
        const phrases = [
            'B.Tech CS Student',
            'Aspiring Django Developer',
            'UI/UX Design Enthusiast',
            'Passionate about App Dev'
        ];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % phrases.length;
            titleElement.style.opacity = 0;
            setTimeout(() => {
                titleElement.textContent = phrases[idx];
                titleElement.style.opacity = 1;
            }, 400);
        }, 3500);
    }
    const form = document.querySelector('.contact-form');
    const formSuccess = document.getElementById('formSuccess');
    form.addEventListener('submit', (e) => {
        const btn = form.querySelector('button');
        btn.innerText = "Sending...";
        btn.style.opacity = "0.7";
        setTimeout(() => {
            form.reset();
            btn.innerText = "Send Message";
            btn.style.opacity = "1";
            formSuccess.classList.add('active');
            setTimeout(() => {
                formSuccess.classList.remove('active');
            }, 4000);
        }, 1000);
    });
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});
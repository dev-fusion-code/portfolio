document.addEventListener('DOMContentLoaded', () =>
{
    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    // CGPA meter
    const cgpaMeter = document.getElementById('cgpaMeter');
    if (cgpaMeter)
    {
        const value = parseFloat(cgpaMeter.getAttribute('data-value'));
        for (let i = 0; i < 10; i++)
        {
            const dot = document.createElement('i');
            const fill = Math.max(0, Math.min(1, value - i));
            if (fill >= 1) dot.className = 'is-on';
            else if (fill > 0)
            {
                dot.className = 'is-part';
                dot.style.setProperty('--f', (fill * 100).toFixed(0) + '%');
            }
            cgpaMeter.appendChild(dot);
        }
    }

    // Degree progress
    const years = document.getElementById('years');
    if (years)
    {
        const start = new Date(years.getAttribute('data-start')).getTime();
        const end = new Date(years.getAttribute('data-end')).getTime();
        const p = Math.max(0, Math.min(1, (Date.now() - start) / (end - start)));
        years.style.setProperty('--p', p.toFixed(3));
    }

    // Mobile menu with tactile stationery drop & screentone overlay
    const menu = document.getElementById('menu');
    const menuBtn = document.getElementById('menuBtn');
    const menuBackdrop = document.getElementById('menuBackdrop');
    let menuTimer = null;
    const setMenu = (open) =>
    {
        clearTimeout(menuTimer);
        if (open)
        {
            menu.hidden = false;
            if (menuBackdrop) menuBackdrop.hidden = false;
            requestAnimationFrame(() =>
            {
                menu.classList.add('is-open');
                if (menuBackdrop) menuBackdrop.classList.add('is-open');
            });
        }
        else
        {
            menu.classList.remove('is-open');
            if (menuBackdrop) menuBackdrop.classList.remove('is-open');
            menuTimer = setTimeout(() =>
            {
                if (!menu.classList.contains('is-open'))
                {
                    menu.hidden = true;
                    if (menuBackdrop) menuBackdrop.hidden = true;
                }
            }, 240);
        }
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', () => setMenu(menu.hidden || !menu.classList.contains('is-open')));
    if (menuBackdrop) menuBackdrop.addEventListener('click', () => setMenu(false));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

    // Dynamic topbar brand text: "PORTFOLIO" -> "SAKETH P" when scrolling past namebox
    const brand = document.getElementById('brandText');
    const brandTag = brand ? brand.querySelector('.brand__tag') : null;
    const heroNamebox = document.getElementById('heroNamebox');
    if (brand && brandTag && heroNamebox)
    {
        const updateBrand = () =>
        {
            const rect = heroNamebox.getBoundingClientRect();
            // When user scrolls down past the hero namebox (bottom < 50px)
            if (rect.bottom < 50)
            {
                if (!brand.classList.contains('is-scrolled'))
                {
                    brand.classList.add('is-scrolled');
                    brandTag.textContent = 'SAKETH P';
                }
            }
            else
            {
                if (brand.classList.contains('is-scrolled'))
                {
                    brand.classList.remove('is-scrolled');
                    brandTag.textContent = 'PORTFOLIO';
                }
            }
        };
        window.addEventListener('scroll', updateBrand, { passive: true });
        updateBrand();
    }

    // Smooth anchors
    document.querySelectorAll('a[href^="#"]').forEach((anchor) =>
    {
        anchor.addEventListener('click', (e) =>
        {
            const hash = anchor.getAttribute('href');
            if (!hash || hash === '#') return;
            if (hash === '#hero' || hash === '#top')
            {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
                history.pushState(null, '', hash);
                return;
            }
            const target = document.getElementById(hash.slice(1));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth' });
            history.pushState(null, '', hash);
        });
    });

    // Active nav link
    const links = Array.from(document.querySelectorAll('.nav__link'));
    const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
    let ticking = false;
    function updateActive()
    {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let current = sections[0].id;
        sections.forEach((s) => { if (s.offsetTop <= marker) current = s.id; });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) current = sections[sections.length - 1].id;

        links.forEach((l) =>
        {
            const on = l.dataset.nav === current;
            l.classList.toggle('is-active', on);
            if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
    }
    window.addEventListener('scroll', () =>
    {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateActive(); ticking = false; });
    }, { passive: true });
    updateActive();

    // Project accordion
    const projects = Array.from(document.querySelectorAll('.proj'));
    function setProject(project, open)
    {
        const btn = project.querySelector('.proj__head');
        const panel = project.querySelector('.proj__panel');
        if (!btn || !panel) return;
        project.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.inert = !open;
    }
    projects.forEach((project) =>
    {
        setProject(project, project.classList.contains('is-open'));
        const btn = project.querySelector('.proj__head');
        if (btn)
        {
            btn.addEventListener('click', () =>
            {
                const willOpen = !project.classList.contains('is-open');
                projects.forEach((other) => setProject(other, other === project ? willOpen : false));
            });
        }
    });

    // Lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxClose = document.getElementById('lightboxClose');
    let lastFocus = null;

    function closeLightbox()
    {
        if (lightbox.hidden) return;
        lightbox.classList.remove('is-open');
        root.classList.remove('is-locked');
        setTimeout(() => { lightbox.hidden = true; }, reduced.matches ? 0 : 250);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    document.querySelectorAll('[data-lightbox]').forEach((trigger) =>
    {
        trigger.addEventListener('click', () =>
        {
            const img = trigger.querySelector('img');
            lastFocus = trigger;
            lightboxImg.src = trigger.getAttribute('data-lightbox');
            lightboxImg.alt = img ? img.alt : '';
            lightboxTitle.textContent = trigger.getAttribute('data-lightbox-title') || '';
            lightbox.hidden = false;
            root.classList.add('is-locked');
            requestAnimationFrame(() => { lightbox.classList.add('is-open'); lightboxClose.focus({ preventScroll: true }); });
        });
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) =>
    {
        if (e.key !== 'Escape') return;
        closeLightbox();
        setMenu(false);
    });

    // IST clock
    const clock = document.getElementById('clock');
    if (clock)
    {
        const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
        const tick = () => { clock.textContent = fmt.format(new Date()); };
        tick();
        setInterval(tick, 1000);
    }

    // Contact form (posts to Google Form via hidden iframe)
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    const submitLabel = document.getElementById('submitLabel');
    if (form && success && submitBtn)
    {
        let timer = null;
        form.addEventListener('submit', () =>
        {
            const original = submitLabel.textContent;
            submitLabel.textContent = 'SENDING...';
            submitBtn.disabled = true;
            success.classList.remove('is-visible');
            setTimeout(() =>
            {
                form.reset();
                submitLabel.textContent = original;
                submitBtn.disabled = false;
                success.classList.add('is-visible');
                clearTimeout(timer);
                timer = setTimeout(() => success.classList.remove('is-visible'), 6000);
            }, 1200);
        });
    }
});
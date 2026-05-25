const App = {
    state: {
        scrollY: 0,
        isScrolling: false,
        activeSection: null
    },

    init() {
        this.initScrollReveal();
        this.initNavigation();
        this.initModals();
        this.initSmoothScroll();
        this.initParallax();
        this.initTypingEffect();
        this.initCursorEffect();
        this.initGlitchEffect();
        this.initMobileMenu();
        this.initContactForm();
        this.initProjectModal();
        this.initThemeToggle();
        this.initScrollProgress();
        this.initLazyLoading();
        this.initBackToTop();
    },

    initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        revealElements.forEach(el => observer.observe(el));
    },

    initNavigation() {
        const navbar = document.querySelector('.navbar');
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let lastScroll = 0;

        const updateNav = () => {
            const currentScroll = window.pageYOffset;
            
            navbar.classList.toggle('scrolled', currentScroll > 50);
            navbar.classList.toggle('hidden', currentScroll > lastScroll && currentScroll > 200);
            
            lastScroll = currentScroll;
            this.state.scrollY = currentScroll;

            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                    current = section.id;
                }
            });

            if (current !== this.state.activeSection) {
                this.state.activeSection = current;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
                });
            }
        };

        window.addEventListener('scroll', updateNav, { passive: true });
        updateNav();
    },

    initModals() {
        const modal = document.getElementById('modal');
        const certImg = document.getElementById('certImg');
        const modalImg = document.getElementById('modalImg');
        const closeBtn = document.querySelector('.close');

        const openModal = () => {
            if (!certImg) return;
            modalImg.src = certImg.src;
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => modal.classList.add('active'), 10);
        };

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        certImg?.addEventListener('click', openModal);
        closeBtn?.addEventListener('click', closeModal);
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                this.closeProjectModal();
            }
        });
    },

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || !href) return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const offset = 80;
                const targetPosition = target.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    },

    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const offset = scrolled * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        };

        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', handleParallax, { passive: true });
        }
    },

    initTypingEffect() {
        const typingElement = document.querySelector('[data-typing]');
        if (!typingElement) return;

        const text = typingElement.dataset.typing;
        const speed = parseInt(typingElement.dataset.speed) || 100;
        let index = 0;

        typingElement.textContent = '';

        const type = () => {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
        });

        observer.observe(typingElement);
    },

    initCursorEffect() {
        if (window.innerWidth < 768) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dotX = e.clientX;
            dotY = e.clientY;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            
            requestAnimationFrame(animateCursor);
        };

        animateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    },

    initGlitchEffect() {
        const glitchElements = document.querySelectorAll('[data-glitch]');
        
        glitchElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.classList.add('glitching');
                setTimeout(() => el.classList.remove('glitching'), 500);
            });
        });
    },

    initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!hamburger || !navMenu) return;

        const closeMenu = () => {
            navMenu.classList.remove('show');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        };

        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    },

    initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => input.parentElement.classList.add('focused'));
            input.addEventListener('blur', () => {
                if (!input.value) input.parentElement.classList.remove('focused');
            });

            input.addEventListener('input', () => {
                this.validateField(input);
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!this.validateForm(form)) {
                this.showNotification('PLEASE FILL ALL REQUIRED FIELDS', 'error');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const data = new FormData(form);
            const originalText = btn.textContent;

            btn.textContent = 'SENDING...';
            btn.disabled = true;
            btn.classList.add('loading');

            try {
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    this.showNotification('MESSAGE SENT SUCCESSFULLY ✓', 'success');
                    form.reset();
                    inputs.forEach(input => input.parentElement.classList.remove('focused'));
                } else {
                    this.showNotification('FAILED TO SEND. TRY AGAIN.', 'error');
                }
            } catch {
                this.showNotification('NETWORK ERROR. TRY AGAIN.', 'error');
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.classList.remove('loading');
            }
        });
    },

    validateField(input) {
        const isValid = input.checkValidity();
        input.parentElement.classList.toggle('error', !isValid && input.value);
        return isValid;
    },

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input) || !input.value) {
                isValid = false;
            }
        });

        return isValid;
    },

    initProjectModal() {
        const projectModal = document.getElementById('projectModal');
        const projectModalClose = document.getElementById('projectModalClose');

        if (!projectModal) return;

        document.querySelectorAll('.project-card').forEach((card, i) => {
            const detailLink = card.querySelector('.link:last-child');
            detailLink?.addEventListener('click', (e) => {
                e.preventDefault();
                this.openProjectModal(projects[i]);
            });

            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translate(-8px, -8px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translate(0, 0)';
            });
        });

        projectModalClose?.addEventListener('click', () => this.closeProjectModal());
        projectModal?.addEventListener('click', (e) => {
            if (e.target === projectModal) this.closeProjectModal();
        });
    },

    openProjectModal(project) {
        const projectModal = document.getElementById('projectModal');
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalTech').textContent = project.tech;
        document.getElementById('modalDesc').textContent = project.desc;
        document.getElementById('modalLessons').textContent = project.lessons;
        document.getElementById('modalDemo').href = project.demo;
        
        projectModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => projectModal.classList.add('active'), 10);
    },

    closeProjectModal() {
        const projectModal = document.getElementById('projectModal');
        if (!projectModal) return;
        
        projectModal.classList.remove('active');
        setTimeout(() => {
            projectModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    },

    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);

        themeToggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            this.showNotification(`THEME: ${newTheme.toUpperCase()}`, 'info');
        });
    },

    initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
    },

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

   

    showNotification(message, type) {
        const notif = document.createElement('div');
        notif.className = `notification notification-${type}`;
        notif.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        `;
        
        document.body.appendChild(notif);

        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 3500);
    },

    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
};

const projects = [
    {
        title: 'TASKFLOW',
        tech: 'JAVASCRIPT · LOCAL STORAGE',
        desc: 'A minimalist task management application designed to help users organize daily activities efficiently with task creation, editing, and completion tracking. Built entirely with vanilla JavaScript and Local Storage — no backend required.',
        lessons: 'Learned how to manage UI state manually without a framework, and explored the limitations of Local Storage for client-side data persistence.',
        demo: 'https://to-do-list-rosy-eight-12.vercel.app/'
    },
    {
        title: 'PPDB SMK BINA HARAPAN',
        tech: 'PHP · MYSQL',
        desc: 'An online student admission system built to simplify registration, applicant verification, and structured administrative data management for SMK Bina Harapan.',
        lessons: 'Gained hands-on experience with real-world admission workflows, relational database management, and the importance of server-side data validation.',
        demo: 'https://smkbinaharapan.rf.gd'
    },
    {
        title: 'SEDEKAHIN',
        tech: 'LARAVEL · CHART.JS',
        desc: 'A donation and fundraising platform designed to support transparent campaigns, donation tracking, and community-based social contributions — built with Laravel and visualized with Chart.js.',
        lessons: 'The biggest challenge was building a transparent, real-time donation tracking system and integrating Chart.js to create meaningful campaign data visualizations.',
        demo: 'https://sedekahin.page.gd'
    },
    {
        title: 'SMDIS',
        tech: 'LOCAL STORAGE · CRUD',
        desc: 'A web-based student management system featuring secure CRUD operations, structured data handling, and an administrative dashboard — built entirely on the frontend without a backend.',
        lessons: 'Deepened understanding of pure frontend CRUD architecture and strategies for maintaining data consistency using Local Storage.',
        demo: 'https://sm-dis.vercel.app/'
    },
    {
        title: 'WEDDING INVITATION',
        tech: 'HTML · CSS · JAVASCRIPT',
        desc: 'A modern wedding invitation website featuring interactive event details, smooth animations, and a fully responsive user experience.',
        lessons: 'The main challenge was creating smooth page transitions and maintaining responsive layouts across different screen sizes and devices.',
        demo: 'https://your-demo-link.com'
    },
    {
        title: 'PORTFOLIO',
        tech: 'HTML · CSS · JAVASCRIPT',
        desc: 'Personal developer portfolio built entirely from scratch using pure HTML, CSS, and vanilla JavaScript. Features scroll-reveal animations, a bold neobrutalist design system, and smooth interactive elements — no frameworks, no dependencies.',
        lessons: 'Deepened understanding of CSS custom properties, scroll-driven animations, and building a cohesive design system from scratch without relying on frameworks.',
        demo: '#hero'
    }
];

document.addEventListener('DOMContentLoaded', () => App.init());

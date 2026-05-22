document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const isVisible = el.getBoundingClientRect().top < window.innerHeight - 100;
            if (isVisible) el.classList.add('active');
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // 2. Sticky Navbar + Active Nav Link
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateNav = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - section.clientHeight / 3) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(current));
        });
    };

    window.addEventListener('scroll', updateNav, { passive: true });

    // 3. Certificate Modal
    const modal = document.getElementById('modal');
    const certImg = document.getElementById('certImg');
    const modalImg = document.getElementById('modalImg');
    const closeBtn = document.querySelector('.close');

    const openModal = () => {
        modalImg.src = certImg.src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    certImg?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

const form = document.querySelector('.contact-form');

form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const data = new FormData(form);

    btn.textContent = 'SENDING...';
    btn.disabled = true;

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            showNotif('MESSAGE SENT SUCCESSFULLY ✓', 'success');
            form.reset();
        } else {
            showNotif('FAILED TO SEND. TRY AGAIN.', 'error');
        }
    } catch {
        showNotif('NETWORK ERROR. TRY AGAIN.', 'error');
    } finally {
        btn.textContent = 'SEND MESSAGE →';
        btn.disabled = false;
    }
});

function showNotif(message, type) {
    const notif = document.createElement('div');
    notif.className = `notif notif-${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('notif-show'), 10);
    setTimeout(() => {
        notif.classList.remove('notif-show');
        setTimeout(() => notif.remove(), 300);
    }, 3500);
}

document.addEventListener('click', (e) => {
    if (
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        navMenu.classList.remove('show');
    }
});
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');

document.querySelectorAll('.project-card').forEach((card, i) => {
    const detailLink = card.querySelector('.link:last-child');
    detailLink?.addEventListener('click', (e) => {
        e.preventDefault();
        const p = projects[i];
        document.getElementById('modalTitle').textContent = p.title;
        document.getElementById('modalTech').textContent = p.tech;
        document.getElementById('modalDesc').textContent = p.desc;
        document.getElementById('modalLessons').textContent = p.lessons;
        document.getElementById('modalDemo').href = p.demo;
        projectModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

projectModalClose?.addEventListener('click', () => {
    projectModal.style.display = 'none';
    document.body.style.overflow = '';
});

projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});
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
    }
];
// ========================================
// PORTFOLIO INTERACTIVE FEATURES
// Author: Mahmood Mohamad
// ========================================

'use strict';

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeLucideIcons();
    initializeNavigation();
    initializeParticles();
    initializeScrollAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeActiveNavLinks();
    initializeSmoothScroll();
    initializeProjectFilters();
    initializeLazyLoading();
    initializeKeyboardNavigation();
    initializePageLoader();
    initializeThemeToggle();
});

// ========================================
// PAGE LOADER
// ========================================

function initializePageLoader() {
    window.addEventListener('load', () => {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });
}

// ========================================
// THEME TOGGLE
// ========================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon(true);
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon(isLight);
    });
    
    function updateThemeIcon(isLight) {
        const icon = themeToggle.querySelector('svg');
        if (!icon) return;
        
        if (isLight) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
        }
    }
}

// ========================================
// LUCIDE ICONS INITIALIZATION
// ========================================

function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// NAVIGATION
// ========================================

function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const nav = document.getElementById('mainNav');

    if (!mobileMenuBtn || !mobileMenu || !nav) return;

    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Animate icon change
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        initializeLucideIcons();
    });

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            initializeLucideIcons();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                initializeLucideIcons();
            }
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, 100));
}

// ========================================
// PARTICLE CANVAS ANIMATION
// ========================================

function initializeParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(14, 165, 233, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create particles (reduce count on mobile)
    function createParticles() {
        const divisor = window.innerWidth < 768 ? 30000 : 15000;
        const particleCount = Math.floor((canvas.width * canvas.height) / divisor);
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections (skip on mobile for performance)
        if (window.innerWidth >= 768) {
            particles.forEach((particleA, indexA) => {
                particles.slice(indexA + 1).forEach(particleB => {
                    const dx = particleA.x - particleB.x;
                    const dy = particleA.y - particleB.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(14, 165, 233, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particleA.x, particleA.y);
                        ctx.lineTo(particleB.x, particleB.y);
                        ctx.stroke();
                    }
                });
            });
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrameId);
        } else {
            animate();
        }
    });
}

// ========================================
// PROJECT FILTERS
// ========================================

function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0 || projects.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-gradient-to-r', 'from-sky-500', 'to-emerald-500', 'text-white');
                b.classList.add('bg-slate-800', 'border-2', 'border-slate-700', 'text-slate-400');
            });
            
            btn.classList.remove('bg-slate-800', 'border-2', 'border-slate-700', 'text-slate-400');
            btn.classList.add('active', 'bg-gradient-to-r', 'from-sky-500', 'to-emerald-500', 'text-white');
            
            // Filter projects
            projects.forEach(project => {
                const category = project.dataset.category;
                if (filter === 'all' || category === filter) {
                    project.classList.remove('filter-hidden', 'hidden');
                    project.style.animation = 'scaleIn 0.5s ease';
                } else {
                    project.classList.add('filter-hidden', 'hidden');
                }
            });
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.info-card, .timeline-item, .project-card, .skill-category-card'
    );

    animateElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ========================================
// SKILL BARS ANIMATION
// ========================================

function initializeSkillBars() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.setProperty('--progress', progress + '%');
                        bar.classList.add('animate');
                    }, index * 150);
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe skill sections
    const skillSections = document.querySelectorAll('#about, #skills');
    skillSections.forEach(section => observer.observe(section));
}

// ========================================
// ACTIVE NAVIGATION LINKS
// ========================================

function initializeActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    function updateActiveLink() {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', debounce(updateActiveLink, 50));
    updateActiveLink();
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const navHeight = 80;
            const targetPosition = targetElement.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// CONTACT FORM
// ========================================

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Validate
        if (!formData.name || !formData.email || !formData.message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(formData.email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }

        try {
            // Disable form during submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            // Replace with your actual endpoint
            // Option 1: Formspree
            // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Option 2: Your Laravel API
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1500));

            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();

            // Re-enable form
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;

        } catch (error) {
            console.error('Form submission error:', error);
            showFormStatus('Something went wrong. Please try again later.', 'error');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
        }
    });
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.classList.remove('hidden');

    if (type === 'success') {
        formStatus.className = 'mt-6 p-4 rounded-xl border-2 bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold';
    } else {
        formStatus.className = 'mt-6 p-4 rounded-xl border-2 bg-rose-500/10 border-rose-500 text-rose-400 font-bold';
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// LAZY LOADING
// ========================================

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) {
        // If no data-src, add native lazy loading to all images
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
        return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

function initializeKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            
            if (mobileMenu && mobileMenuBtn && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    initializeLucideIcons();
                }
            }
        }
    });

    // Add tab focus visible styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// ANALYTICS (Optional)
// ========================================

function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
    
    console.log('Event tracked:', { category, action, label });
}

// Track navigation clicks
document.addEventListener('click', (e) => {
    const navLink = e.target.closest('a[href^="#"]');
    if (navLink) {
        trackEvent('Navigation', 'Click', navLink.getAttribute('href'));
    }
    
    const projectLink = e.target.closest('.project-link');
    if (projectLink) {
        const projectCard = projectLink.closest('.project-card');
        const projectTitle = projectCard?.querySelector('.project-title')?.textContent;
        if (projectTitle) {
            trackEvent('Project', 'View', projectTitle);
        }
    }
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ========================================
// CONSOLE MESSAGE
// ========================================

console.log(
    '%c👋 Hello Developer!',
    'font-size: 20px; font-weight: bold; color: #0ea5e9;'
);

console.log(
    '%cLooking for a talented Laravel developer? Let\'s connect!',
    'font-size: 14px; color: #10b981;'
);

console.log(
    '%c📧 mamod.mohamed@gmail.com',
    'font-size: 12px; color: #94a3b8;'
);

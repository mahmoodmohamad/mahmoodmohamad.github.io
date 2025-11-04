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
});

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
    const mobileLinks = mobileMenu.querySelectorAll('a');
    const nav = document.getElementById('mainNav');

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
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            initializeLucideIcons();
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
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
    window.addEventListener('resize', resizeCanvas);

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

    // Create particles
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    createParticles();
    window.addEventListener('resize', createParticles);

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Draw connections
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
        // Keep elements visible by default
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

        // Simulate form submission (replace with actual API call)
        try {
            // Disable form during submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Here you would normally send the data to your backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();

            // Re-enable form
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            initializeLucideIcons();

        } catch (error) {
            showFormStatus('Something went wrong. Please try again later.', 'error');
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
        }
    });
}

function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    const icon = formStatus.querySelector('i');
    const text = formStatus.querySelector('p');

    formStatus.classList.remove('hidden');
    text.textContent = message;

    if (type === 'success') {
        formStatus.style.background = 'rgba(16, 185, 129, 0.1)';
        formStatus.style.borderColor = '#10b981';
        formStatus.style.color = '#10b981';
        icon.setAttribute('data-lucide', 'check-circle');
    } else {
        formStatus.style.background = 'rgba(239, 68, 68, 0.1)';
        formStatus.style.borderColor = '#ef4444';
        formStatus.style.color = '#ef4444';
        icon.setAttribute('data-lucide', 'alert-circle');
    }

    initializeLucideIcons();

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
// UTILITY FUNCTIONS
// ========================================

// Debounce function to limit function calls
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
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
            
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                initializeLucideIcons();
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
// ANALYTICS (Optional)
// ========================================

function trackEvent(category, action, label) {
    // Implement your analytics tracking here
    // Example with Google Analytics:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
    
    console.log('Event tracked:', { category, action, label });
}

// Track important interactions
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Navigation', 'Click', link.getAttribute('href'));
    });
});

document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Project', 'View', link.closest('.project-card')?.querySelector('.project-title')?.textContent);
    });
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // You can send error reports to your logging service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send error reports to your logging service here
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
    '%c📧 mahmood@example.com',
    'font-size: 12px; color: #94a3b8;'
);

// ========================================
// EXPORT FUNCTIONS (if using modules)
// ========================================

// If you're using ES6 modules, you can export these functions
// export { initializeNavigation, initializeParticles, initializeContactForm };
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projects.forEach(project => {
                const category = project.dataset.category;
                if (filter === 'all' || category === filter) {
                    project.classList.remove('hidden');
                    project.style.animation = 'scaleIn 0.5s ease';
                } else {
                    project.classList.add('hidden');
                }
            });
        });
    });
}

const projectImages = document.querySelectorAll('.project-image');
projectImages.forEach(img => {
    img.loading = 'lazy'; // Native lazy loading
});


if (window.innerWidth < 768) {
    // Reduce particle count
    const particleCount = Math.floor((canvas.width * canvas.height) / 30000);
}
async function submitContactForm(formData) {
    try {
        const response = await fetch('https://formspree.io/f/YOUR_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showFormStatus('Message sent successfully!', 'success');
        }
    } catch (error) {
        showFormStatus('Failed to send message', 'error');
    }
}

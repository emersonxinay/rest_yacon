/**
 * YACON RESTAURANT - ANIMACIONES MODERNAS
 * Sistema de animaciones optimizado para performance
 */

class ModernAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
        this.setupNavbarEffects();
        this.setupPageTransitions();
        this.setupLoadingAnimations();
    }

    // Intersection Observer para animaciones al scroll
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animación escalonada para elementos hermanos
                    const siblings = entry.target.parentElement?.children;
                    if (siblings) {
                        Array.from(siblings).forEach((sibling, index) => {
                            if (sibling.classList.contains('stagger-animation')) {
                                setTimeout(() => {
                                    sibling.classList.add('visible');
                                }, index * 100);
                            }
                        });
                    }
                }
            });
        }, observerOptions);

        // Observar elementos con clases de animación
        document.querySelectorAll('.fade-in-up, .scale-in, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    // Animaciones de scroll suaves
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            
            // Parallax para elementos específicos
            document.querySelectorAll('.parallax-element').forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top + scrollY;
                const elementHeight = rect.height;
                
                if (elementTop < scrollY + windowHeight && elementTop + elementHeight > scrollY) {
                    const yPos = -(scrollY - elementTop) * speed;
                    element.style.transform = `translate3d(0, ${yPos}px, 0)`;
                }
            });

            // Efecto de flotación para cards
            document.querySelectorAll('.floating-card').forEach((card, index) => {
                const offset = Math.sin(Date.now() * 0.001 + index) * 5;
                card.style.transform = `translateY(${offset}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Efectos parallax avanzados
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // Animaciones de hover avanzadas
    setupHoverAnimations() {
        // Cards con efecto magnético
        document.querySelectorAll('.magnetic-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.1;
                const rotateX = (y / rect.height) * strength * 10;
                const rotateY = -(x / rect.width) * strength * 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    scale3d(1.02, 1.02, 1.02)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        // Botones con efecto de ondas
        document.querySelectorAll('.ripple-effect').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Efectos de navbar dinámicos
    setupNavbarEffects() {
        const navbar = document.querySelector('.navbar-modern');
        let lastScrollY = window.scrollY;
        
        const handleNavbarScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Agregar clase cuando se hace scroll
            if (currentScrollY > 50) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
            
            // Ocultar/mostrar navbar basado en dirección del scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar?.style.setProperty('transform', 'translateY(-100%)');
            } else {
                navbar?.style.setProperty('transform', 'translateY(0)');
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    }

    // Transiciones de página suaves
    setupPageTransitions() {
        // Animación de carga inicial
        const pageLoader = document.createElement('div');
        pageLoader.className = 'page-loader';
        pageLoader.innerHTML = `
            <div class="loader-content">
                <div class="loader-logo">🍱</div>
                <div class="loader-text">Yacon Restaurant</div>
                <div class="loader-progress">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
        
        if (document.readyState === 'loading') {
            document.body.appendChild(pageLoader);
            
            window.addEventListener('load', () => {
                setTimeout(() => {
                    pageLoader.classList.add('loaded');
                    setTimeout(() => {
                        pageLoader.remove();
                    }, 500);
                }, 500);
            });
        }

        // Transiciones entre enlaces internos
        document.querySelectorAll('a[href^="/"], a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) return;
                
                e.preventDefault();
                
                // Efecto de salida
                document.body.style.opacity = '0';
                document.body.style.transform = 'scale(0.98)';
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            });
        });
    }

    // Animaciones de carga de contenido
    setupLoadingAnimations() {
        // Lazy loading de imágenes con animación
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    
                    if (src) {
                        img.style.opacity = '0';
                        img.src = src;
                        
                        img.onload = () => {
                            img.style.transition = 'opacity 0.3s ease';
                            img.style.opacity = '1';
                            img.classList.add('loaded');
                        };
                        
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Animación de texto con efecto typewriter
        const typewriterElements = document.querySelectorAll('.typewriter-effect');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            
            let index = 0;
            const timer = setInterval(() => {
                element.textContent += text[index];
                index++;
                
                if (index >= text.length) {
                    clearInterval(timer);
                }
            }, 100);
        });
    }

    // Utilidades de animación
    static animateCSS(element, animationName, callback) {
        const node = document.querySelector(element);
        node.classList.add('animate__animated', `animate__${animationName}`);
        
        function handleAnimationEnd() {
            node.classList.remove('animate__animated', `animate__${animationName}`);
            node.removeEventListener('animationend', handleAnimationEnd);
            
            if (typeof callback === 'function') callback();
        }
        
        node.addEventListener('animationend', handleAnimationEnd);
    }

    static createParticleEffect(container, options = {}) {
        const defaults = {
            count: 50,
            colors: ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569', '#f8b500'],
            size: { min: 2, max: 6 },
            speed: { min: 1, max: 3 },
            lifetime: 3000
        };
        
        const config = { ...defaults, ...options };
        
        for (let i = 0; i < config.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * (config.size.max - config.size.min) + config.size.min;
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const speed = Math.random() * (config.speed.max - config.speed.min) + config.speed.min;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                animation: particleFloat ${config.lifetime}ms ease-out forwards;
                left: ${Math.random() * 100}%;
                top: 100%;
            `;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, config.lifetime);
        }
    }
}

// CSS dinámico para animaciones
const animationStyles = `
    .page-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    
    .page-loader.loaded {
        opacity: 0;
        visibility: hidden;
    }
    
    .loader-content {
        text-align: center;
        color: white;
    }
    
    .loader-logo {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    .loader-text {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 2rem;
        opacity: 0.9;
    }
    
    .loader-progress {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
    }
    
    .loader-bar {
        width: 0%;
        height: 100%;
        background: white;
        border-radius: 2px;
        animation: loadProgress 2s ease-out infinite;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
    }
    
    .slide-in-left {
        opacity: 0;
        transform: translateX(-50px);
        transition: all 0.6s ease;
    }
    
    .slide-in-right {
        opacity: 0;
        transform: translateX(50px);
        transition: all 0.6s ease;
    }
    
    .slide-in-left.visible,
    .slide-in-right.visible {
        opacity: 1;
        transform: translateX(0);
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes loadProgress {
        0% { width: 0%; }
        100% { width: 100%; }
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .magnetic-card {
        transition: transform 0.1s ease;
    }
    
    .floating-card {
        transition: transform 0.3s ease;
    }
    
    .stagger-animation {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
    }
    
    .stagger-animation.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernAnimations();
    });
} else {
    new ModernAnimations();
}

// Exportar para uso global
window.ModernAnimations = ModernAnimations;
/**
 * COUNTER ANIMATION
 * Sistema de animación de contadores para estadísticas
 */

class CounterAnimation {
    constructor() {
        this.counters = [];
        this.init();
    }

    init() {
        this.setupCounters();
        this.setupIntersectionObserver();
        this.setupParticleSystem();
    }

    setupCounters() {
        const counterElements = document.querySelectorAll('.stat-number[data-count]');
        
        counterElements.forEach(element => {
            const targetValue = parseInt(element.dataset.count);
            this.counters.push({
                element: element,
                target: targetValue,
                current: 0,
                hasAnimated: false
            });
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counterData = this.counters.find(counter => 
                        counter.element === entry.target
                    );
                    
                    if (counterData && !counterData.hasAnimated) {
                        this.animateCounter(counterData);
                        counterData.hasAnimated = true;
                    }
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => {
            observer.observe(counter.element);
        });
    }

    animateCounter(counterData) {
        const { element, target } = counterData;
        const duration = 2000; // 2 segundos
        const startTime = performance.now();
        const startValue = 0;

        // Agregar clase de animación
        element.classList.add('counting');

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Usar función de easing para suavizar la animación
            const easedProgress = this.easeOutQuart(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            
            // Formatear el número con separadores de miles
            element.textContent = this.formatNumber(currentValue);
            counterData.current = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Asegurar que el valor final sea exacto
                element.textContent = this.formatNumber(target);
                
                // Crear efecto de partículas al completar
                this.createCompletionEffect(element);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }

    createCompletionEffect(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Crear partículas de celebración
        for (let i = 0; i < 12; i++) {
            this.createParticle(centerX, centerY, i);
        }
    }

    createParticle(x, y, index) {
        const particle = document.createElement('div');
        particle.className = 'celebration-particle';
        
        const colors = ['#ff6b6b', '#ff8e53', '#ff6b9d', '#c44569', '#f8b500'];
        const color = colors[index % colors.length];
        
        const angle = (index / 12) * Math.PI * 2;
        const velocity = 50 + Math.random() * 30;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 6px;
            height: 6px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            transform-origin: center;
        `;
        
        document.body.appendChild(particle);
        
        // Animar la partícula
        particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${vx}px, ${vy}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }

    setupParticleSystem() {
        // Sistema de partículas para el hero
        const heroParticles = document.getElementById('heroParticles');
        
        if (heroParticles) {
            this.createHeroParticles(heroParticles);
            
            // Regenerar partículas cada 10 segundos
            setInterval(() => {
                this.createHeroParticles(heroParticles);
            }, 10000);
        }
    }

    createHeroParticles(container) {
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createFloatingParticle(container);
            }, i * 500); // Escalonar la aparición
        }
    }

    createFloatingParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        
        const size = 2 + Math.random() * 4;
        const x = Math.random() * 100;
        const duration = 8000 + Math.random() * 4000;
        const delay = Math.random() * 2000;
        
        const colors = [
            'rgba(255, 107, 107, 0.6)',
            'rgba(255, 142, 83, 0.6)',
            'rgba(255, 107, 157, 0.6)',
            'rgba(196, 69, 105, 0.6)',
            'rgba(248, 181, 0, 0.6)'
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            bottom: -10px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
        `;
        
        container.appendChild(particle);
        
        // Animar la partícula flotante
        particle.animate([
            { 
                transform: 'translateY(0) rotate(0deg)', 
                opacity: 0 
            },
            { 
                transform: 'translateY(-20px) rotate(45deg)', 
                opacity: 1,
                offset: 0.1
            },
            { 
                transform: `translateY(-${window.innerHeight + 100}px) rotate(360deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            delay: delay,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Estilos CSS para las partículas
const particleStyles = `
    .celebration-particle {
        box-shadow: 0 0 6px currentColor;
    }
    
    .hero-particle {
        filter: blur(0.5px);
        box-shadow: 0 0 8px currentColor;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .celebration-particle,
        .hero-particle {
            display: none;
        }
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CounterAnimation();
    });
} else {
    new CounterAnimation();
}

// Exportar para uso global
window.CounterAnimation = CounterAnimation;
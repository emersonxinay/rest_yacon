// Funcionalidades interactivas para el restaurante Yacon

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initFormValidation();
    initOrderFunctionality();
    initSmoothScrolling();
    initImageLazyLoading();
    initTooltips();
});

// Validación de formularios
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Por favor, complete todos los campos requeridos.', 'error');
            }
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    return isValid;
}

// Funcionalidad de pedidos
function initOrderFunctionality() {
    const orderButtons = document.querySelectorAll('.add-to-order');
    const orderSummary = document.getElementById('order-summary');
    let orderItems = [];
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice);
            
            addToOrder(productId, productName, productPrice);
            updateOrderSummary();
        });
    });
}

function addToOrder(id, name, price) {
    const existingItem = orderItems.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        orderItems.push({ id, name, price, quantity: 1 });
    }
    
    showNotification(`${name} agregado al pedido`, 'success');
}

function updateOrderSummary() {
    const summaryElement = document.getElementById('order-summary');
    if (!summaryElement) return;
    
    let total = 0;
    let html = '<h3 class="text-lg font-bold mb-2">Resumen del Pedido</h3>';
    
    orderItems.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        
        html += `
            <div class="flex justify-between items-center mb-2">
                <span>${item.name} x${item.quantity}</span>
                <span>$${subtotal.toFixed(2)}</span>
                <button onclick="removeFromOrder('${item.id}')" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    html += `<div class="border-t pt-2 font-bold">Total: $${total.toFixed(2)}</div>`;
    summaryElement.innerHTML = html;
}

function removeFromOrder(id) {
    orderItems = orderItems.filter(item => item.id !== id);
    updateOrderSummary();
    showNotification('Producto eliminado del pedido', 'info');
}

// Desplazamiento suave
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Carga perezosa de imágenes
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('opacity-0');
                img.classList.add('opacity-100');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this, this.dataset.tooltip);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bg-black text-white text-sm px-2 py-1 rounded shadow-lg z-50';
    tooltip.textContent = text;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${getNotificationClass(type)}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('opacity-100', 'translate-y-0');
    }, 100);
    
    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationClass(type) {
    switch (type) {
        case 'success': return 'bg-green-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        case 'warning': return 'bg-yellow-500 text-black';
        default: return 'bg-blue-500 text-white';
    }
}

// Funcionalidad de búsqueda en tiempo real
function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const productCards = document.querySelectorAll('.product-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const productName = card.dataset.productName?.toLowerCase() || '';
                const productDescription = card.dataset.productDescription?.toLowerCase() || '';
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Funcionalidad para el carrusel de imágenes
function initImageCarousel() {
    const carousels = document.querySelectorAll('.image-carousel');
    
    carousels.forEach(carousel => {
        const images = carousel.querySelectorAll('img');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentIndex = 0;
        
        function showImage(index) {
            images.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                showImage(currentIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                showImage(currentIndex);
            });
        }
        
        // Auto-play
        setInterval(() => {
            currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
            showImage(currentIndex);
        }, 5000);
        
        showImage(0);
    });
}

// Validación de reservas en tiempo real
function initReservationValidation() {
    const dateInput = document.getElementById('reservation-date');
    const timeInput = document.getElementById('reservation-time');
    
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 60);
            
            if (selectedDate < today || selectedDate > maxDate) {
                this.setCustomValidity('La fecha debe estar entre hoy y los próximos 2 meses.');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    if (timeInput) {
        timeInput.addEventListener('change', function() {
            const selectedTime = this.value;
            const validTimes = [
                { start: '13:00', end: '17:00' },
                { start: '18:00', end: '21:30' }
            ];
            
            let isValidTime = false;
            validTimes.forEach(timeRange => {
                if (selectedTime >= timeRange.start && selectedTime <= timeRange.end) {
                    isValidTime = true;
                }
            });
            
            if (!isValidTime) {
                this.setCustomValidity('El horario debe estar entre 1:00 PM - 5:00 PM o 6:00 PM - 9:30 PM.');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Inicializar funcionalidades adicionales cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initSearchFunctionality();
    initImageCarousel();
    initReservationValidation();
});
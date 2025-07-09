// Cart Manager Global - Gestión unificada del carrito
class CartManager {
    constructor() {
        this.storageKey = 'hazuki_cart_data';
        this.cartItems = new Map();
        this.cartCount = 0;
        this.loadCartFromStorage();
        this.bindEvents();
    }

    // Cargar datos del carrito desde localStorage
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem(this.storageKey);
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                this.cartItems = new Map(cartData.items || []);
                this.cartCount = cartData.count || 0;
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.cartItems = new Map();
            this.cartCount = 0;
        }
    }

    // Guardar datos del carrito en localStorage
    saveCartToStorage() {
        try {
            const cartData = {
                items: Array.from(this.cartItems.entries()),
                count: this.cartCount,
                timestamp: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(cartData));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    // Agregar o quitar producto
    toggleProduct(productId) {
        const checkbox = document.getElementById(`product_${productId}`);
        const button = document.querySelector(`button[data-product-id="${productId}"]`);
        const card = document.querySelector(`div[data-product-id="${productId}"]`);
        
        if (!checkbox || !button || !card) {
            console.error('Elementos no encontrados para producto:', productId);
            return;
        }

        const buttonText = button.querySelector('span');
        const buttonIcon = button.querySelector('svg path');
        const quantityInput = document.getElementById(`quantity_${productId}`);
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        if (this.cartItems.has(productId)) {
            // Quitar producto
            this.cartItems.delete(productId);
            checkbox.checked = false;
            
            // Cambiar apariencia a "Agregar"
            this.updateButtonStyle(button, buttonText, buttonIcon, 'add');
            
            // Remover estado visual del card
            this.updateCardStyle(card, false);
            
            this.showNotification('Producto eliminado del pedido', 'info');
        } else {
            // Agregar producto
            this.cartItems.set(productId, {
                quantity: quantity,
                name: card.querySelector('h4').textContent.trim(),
                price: this.extractPrice(card)
            });
            checkbox.checked = true;
            
            // Cambiar apariencia a "Quitar"
            this.updateButtonStyle(button, buttonText, buttonIcon, 'remove');
            
            // Agregar estado visual al card
            this.updateCardStyle(card, true);
            
            this.showNotification('Producto agregado al pedido', 'success');
        }
        
        this.updateCartCounter();
        this.saveCartToStorage();
    }

    // Cambiar cantidad de producto
    changeQuantity(productId, change) {
        const displayQty = document.getElementById(`display_quantity_${productId}`);
        const hiddenQty = document.getElementById(`quantity_${productId}`);
        
        if (!displayQty || !hiddenQty) return;
        
        let currentQty = parseInt(displayQty.textContent);
        let newQty = currentQty + change;
        
        // Validar límites
        if (newQty < 1) newQty = 1;
        if (newQty > 10) newQty = 10;
        
        // Actualizar display
        displayQty.textContent = newQty;
        hiddenQty.value = newQty;
        
        // Si el producto está en el carrito, actualizar la cantidad
        if (this.cartItems.has(productId)) {
            const item = this.cartItems.get(productId);
            item.quantity = newQty;
            this.cartItems.set(productId, item);
            this.updateCartCounter();
            this.saveCartToStorage();
        }
    }

    // Actualizar contador del carrito
    updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        if (!counter) return;
        
        this.cartCount = 0;
        
        // Calcular total de productos
        this.cartItems.forEach(item => {
            this.cartCount += item.quantity;
        });
        
        if (this.cartCount > 0) {
            counter.textContent = this.cartCount;
            counter.classList.remove('hidden');
            
            // Animación del contador
            counter.classList.add('animate-bounce');
            setTimeout(() => {
                counter.classList.remove('animate-bounce');
            }, 600);
        } else {
            counter.classList.add('hidden');
        }
    }

    // Restaurar estado del carrito en la página
    restoreCartState() {
        this.cartItems.forEach((item, productId) => {
            const checkbox = document.getElementById(`product_${productId}`);
            const button = document.querySelector(`button[data-product-id="${productId}"]`);
            const card = document.querySelector(`div[data-product-id="${productId}"]`);
            const quantityDisplay = document.getElementById(`display_quantity_${productId}`);
            const quantityInput = document.getElementById(`quantity_${productId}`);
            
            if (checkbox && button && card) {
                checkbox.checked = true;
                
                // Actualizar cantidad
                if (quantityDisplay) quantityDisplay.textContent = item.quantity;
                if (quantityInput) quantityInput.value = item.quantity;
                
                // Actualizar estilos
                const buttonText = button.querySelector('span');
                const buttonIcon = button.querySelector('svg path');
                this.updateButtonStyle(button, buttonText, buttonIcon, 'remove');
                this.updateCardStyle(card, true);
            }
        });
        
        this.updateCartCounter();
    }

    // Actualizar estilo del botón
    updateButtonStyle(button, buttonText, buttonIcon, action) {
        if (action === 'add') {
            button.classList.remove('bg-red-500', 'hover:bg-red-600');
            button.classList.add('bg-blue-500', 'hover:bg-blue-600');
            if (buttonText) {
                buttonText.textContent = buttonText.textContent.includes('Oferta') ? 'Agregar Oferta' : 'Agregar';
            }
            if (buttonIcon) {
                buttonIcon.setAttribute('d', 'M12 6v6m0 0v6m0-6h6m-6 0H6');
            }
        } else {
            button.classList.remove('bg-blue-500', 'hover:bg-blue-600', 'bg-orange-500', 'hover:bg-orange-600');
            button.classList.add('bg-red-500', 'hover:bg-red-600');
            if (buttonText) {
                buttonText.textContent = buttonText.textContent.includes('Oferta') ? 'Quitar Oferta' : 'Quitar';
            }
            if (buttonIcon) {
                buttonIcon.setAttribute('d', 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16');
            }
        }
    }

    // Actualizar estilo del card
    updateCardStyle(card, isSelected) {
        if (isSelected) {
            card.classList.remove('bg-gray-50', 'bg-gradient-to-br', 'from-yellow-50', 'to-orange-50');
            card.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');
        } else {
            card.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'ring-orange-500', 'from-orange-100', 'to-yellow-100');
            
            // Restaurar el estilo original según el tipo de card
            if (card.classList.contains('border-orange-200')) {
                // Es un card de promoción
                card.classList.add('bg-gradient-to-br', 'from-yellow-50', 'to-orange-50');
            } else {
                // Es un card de producto normal
                card.classList.add('bg-gray-50');
            }
        }
    }

    // Extraer precio del producto
    extractPrice(card) {
        const priceElement = card.querySelector('.text-orange-500, .text-orange-600');
        if (priceElement) {
            return parseFloat(priceElement.textContent.replace('$', ''));
        }
        return 0;
    }

    // Mostrar resumen del carrito
    showProductSummary() {
        const summaryContent = document.getElementById('summary-content');
        if (!summaryContent) return;
        
        if (this.cartItems.size === 0) {
            this.showNotification('Por favor selecciona al menos un producto', 'warning');
            return;
        }
        
        summaryContent.innerHTML = '';
        let total = 0;
        
        this.cartItems.forEach((item, productId) => {
            const totalPrice = item.price * item.quantity;
            total += totalPrice;
            
            const productSummary = document.createElement('tr');
            productSummary.innerHTML = `
                <td class="px-4 py-2 text-sm text-gray-800">${item.name}</td>
                <td class="px-4 py-2 text-sm text-gray-800">
                    <input type="number" value="${item.quantity}" min="1" max="10" 
                           class="w-16 border-gray-300 rounded-md text-center summary-quantity"
                           data-product-id="${productId}">
                </td>
                <td class="px-4 py-2 text-sm text-gray-800">$${item.price.toFixed(2)}</td>
                <td class="px-4 py-2 text-sm text-gray-800">$${totalPrice.toFixed(2)}</td>
                <td class="px-4 py-2">
                    <button type="button" class="text-red-500 hover:text-red-700 font-medium delete-product"
                            onclick="window.cartManager.removeFromSummary('${productId}')">
                        Eliminar
                    </button>
                </td>
            `;
            
            summaryContent.appendChild(productSummary);
        });
        
        const totalElement = document.createElement('tr');
        totalElement.classList.add('font-bold', 'bg-gray-100');
        totalElement.innerHTML = `
            <td colspan="3" class="px-4 py-2 text-sm text-gray-800 text-right">Total:</td>
            <td class="px-4 py-2 text-sm text-gray-800" id="totalAmount">$${total.toFixed(2)}</td>
            <td></td>
        `;
        
        summaryContent.appendChild(totalElement);
        
        const modal = document.getElementById('summary-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
        
        // Reinicializar event listeners para el modal
        this.initializeSummaryEventListeners();
    }

    // Eliminar producto desde el resumen
    removeFromSummary(productId) {
        this.toggleProduct(productId);
        this.showProductSummary();
    }

    // Inicializar event listeners del modal
    initializeSummaryEventListeners() {
        document.querySelectorAll('.summary-quantity').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.productId;
                const newQuantity = parseInt(e.target.value);
                
                if (this.cartItems.has(productId)) {
                    const item = this.cartItems.get(productId);
                    item.quantity = newQuantity;
                    this.cartItems.set(productId, item);
                    
                    // Actualizar display en la página principal
                    const displayQty = document.getElementById(`display_quantity_${productId}`);
                    const hiddenQty = document.getElementById(`quantity_${productId}`);
                    if (displayQty) displayQty.textContent = newQuantity;
                    if (hiddenQty) hiddenQty.value = newQuantity;
                    
                    // Actualizar total del producto
                    const row = e.target.closest('tr');
                    const totalCell = row.querySelector('td:nth-child(4)');
                    const newTotalPrice = item.price * newQuantity;
                    totalCell.textContent = `$${newTotalPrice.toFixed(2)}`;
                    
                    // Actualizar total general
                    this.updateGrandTotal();
                    this.updateCartCounter();
                    this.saveCartToStorage();
                }
            });
        });
    }

    // Actualizar total general en el modal
    updateGrandTotal() {
        const summaryContent = document.getElementById('summary-content');
        if (!summaryContent) return;
        
        const productRows = summaryContent.querySelectorAll('tr:not(.bg-gray-100)');
        let total = 0;
        
        productRows.forEach(row => {
            const totalCell = row.querySelector('td:nth-child(4)');
            if (totalCell) {
                total += parseFloat(totalCell.textContent.replace('$', ''));
            }
        });
        
        const totalAmount = document.getElementById('totalAmount');
        if (totalAmount) {
            totalAmount.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Limpiar carrito
    clearCart() {
        this.cartItems.clear();
        this.cartCount = 0;
        this.saveCartToStorage();
        this.updateCartCounter();
    }

    // Función de notificación
    showNotification(message, type = 'info') {
        if (typeof HazukiRestaurantApp !== 'undefined' && HazukiRestaurantApp.showNotification) {
            HazukiRestaurantApp.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    // Vincular eventos globales
    bindEvents() {
        // Limpiar carrito al cerrar la ventana (opcional)
        window.addEventListener('beforeunload', () => {
            this.saveCartToStorage();
        });
    }
}

// Instancia global del cart manager
window.cartManager = new CartManager();

// Funciones globales para compatibilidad
window.toggleProduct = (productId) => window.cartManager.toggleProduct(productId);
window.changeQuantity = (productId, change) => window.cartManager.changeQuantity(productId, change);
window.showProductSummary = () => window.cartManager.showProductSummary();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Restaurar estado del carrito después de un breve delay
    setTimeout(() => {
        window.cartManager.restoreCartState();
    }, 100);
});
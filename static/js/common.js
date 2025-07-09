// Funciones comunes para la aplicación Yacon Restaurant

// Configuración de WhatsApp
const WHATSAPP_CONFIG = {
    phone: '56975452897',
    baseUrl: 'https://wa.me/'
};

// Función unificada para enviar mensajes por WhatsApp
function sendWhatsAppMessage(message, phone = WHATSAPP_CONFIG.phone) {
    if (!message || message.trim() === '') {
        alert('No hay mensaje para enviar');
        return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `${WHATSAPP_CONFIG.baseUrl}${phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Función para toggle de categorías
function initializeCategoryToggles() {
    document.querySelectorAll('.toggle-category').forEach(button => {
        button.addEventListener('click', function () {
            const categoryDiv = button.parentElement.nextElementSibling;
            categoryDiv.classList.toggle('hidden');
            
            // Actualizar texto del botón
            const isHidden = categoryDiv.classList.contains('hidden');
            button.textContent = isHidden ? 'Mostrar' : 'Ocultar';
        });
    });
}

// Función para manejar formularios de productos
function initializeProductForms() {
    const viewSummaryBtn = document.getElementById('view-summary');
    const summaryModal = document.getElementById('summary-modal');
    const closeSummaryBtn = document.getElementById('close-summary');
    const printSummaryBtn = document.getElementById('print-summary');
    const sendWhatsAppBtn = document.getElementById('send-whatsapp');
    
    if (viewSummaryBtn) {
        viewSummaryBtn.addEventListener('click', showProductSummary);
    }
    
    if (closeSummaryBtn) {
        closeSummaryBtn.addEventListener('click', () => {
            summaryModal.classList.add('hidden');
        });
    }
    
    if (printSummaryBtn) {
        printSummaryBtn.addEventListener('click', printSummary);
    }
    
    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', sendProductSummaryWhatsApp);
    }
}

// Función para mostrar resumen de productos
function showProductSummary() {
    const products = document.querySelectorAll('input[name="products[]"]:checked');
    const summaryContent = document.getElementById('summary-content');
    
    if (products.length === 0) {
        alert('Por favor selecciona al menos un producto');
        return;
    }
    
    summaryContent.innerHTML = '';
    let total = 0;
    let totalQuantity = 0;
    
    products.forEach(product => {
        const productId = product.value;
        const productElement = product.closest('.p-4');
        const productName = productElement.querySelector('.font-semibold').textContent.trim();
        const productPrice = parseFloat(productElement.querySelector('.text-orange-500').textContent.replace('$', ''));
        const quantityInput = document.querySelector(`input[name="quantities[]"][id="quantity_${productId}"]`);
        let quantity = quantityInput && quantityInput.value.trim() !== '' ? parseInt(quantityInput.value) : 1;
        
        const totalPrice = productPrice * quantity;
        total += totalPrice;
        totalQuantity += quantity;
        
        const productSummary = document.createElement('tr');
        productSummary.innerHTML = `
            <td class="px-4 py-2 text-sm text-gray-800">${productName}</td>
            <td class="px-4 py-2 text-sm text-gray-800">
                <input type="number" value="${quantity}" min="1" max="10" 
                       class="w-16 border-gray-300 rounded-md text-center summary-quantity"
                       data-product-id="${productId}">
            </td>
            <td class="px-4 py-2 text-sm text-gray-800">$${productPrice.toFixed(2)}</td>
            <td class="px-4 py-2 text-sm text-gray-800">$${totalPrice.toFixed(2)}</td>
            <td class="px-4 py-2">
                <button type="button" class="text-red-500 hover:text-red-700 font-medium delete-product">
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
    
    document.getElementById('summary-modal').classList.remove('hidden');
    
    // Reinicializar event listeners
    initializeSummaryEventListeners();
}

// Función para inicializar event listeners del resumen
function initializeSummaryEventListeners() {
    document.querySelectorAll('.summary-quantity').forEach(input => {
        input.addEventListener('change', function () {
            updateProductTotal(this);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function () {
            deleteProductFromSummary(this);
        });
    });
}

// Función para actualizar total de producto
function updateProductTotal(input) {
    const row = input.closest('tr');
    const priceCell = row.querySelector('td:nth-child(3)');
    const totalCell = row.querySelector('td:nth-child(4)');
    const productPrice = parseFloat(priceCell.textContent.replace('$', ''));
    const newQuantity = parseInt(input.value);
    const newTotalPrice = productPrice * newQuantity;
    
    totalCell.textContent = `$${newTotalPrice.toFixed(2)}`;
    
    // Actualizar total general
    updateGrandTotal();
}

// Función para eliminar producto del resumen
function deleteProductFromSummary(button) {
    const row = button.closest('tr');
    row.remove();
    updateGrandTotal();
}

// Función para actualizar total general
function updateGrandTotal() {
    const summaryContent = document.getElementById('summary-content');
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

// Función para imprimir resumen
function printSummary() {
    const summaryModal = document.getElementById('summary-modal');
    const modalContent = summaryModal.querySelector('.bg-white');
    
    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resumen de Pedido - Yacon Restaurant</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { font-weight: bold; background-color: #f9f9f9; }
                .header { text-align: center; margin-bottom: 20px; }
                .date { text-align: right; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Yacon Restaurant</h1>
                <h2>Resumen de Pedido</h2>
            </div>
            <div class="date">
                Fecha: ${new Date().toLocaleDateString()}
            </div>
            ${modalContent.innerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Función para enviar resumen por WhatsApp
function sendProductSummaryWhatsApp() {
    const summaryContent = document.getElementById('summary-content');
    const productRows = summaryContent.querySelectorAll('tr:not(.bg-gray-100)');
    
    if (productRows.length === 0) {
        alert('No hay productos en el resumen');
        return;
    }
    
    let message = '🍣 *Pedido - Yacon Restaurant* 🍣\n\n';
    let total = 0;
    let totalQuantity = 0;
    
    productRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const productName = cells[0].textContent.trim();
        const quantity = parseInt(cells[1].querySelector('input').value);
        const unitPrice = parseFloat(cells[2].textContent.replace('$', ''));
        const totalPrice = parseFloat(cells[3].textContent.replace('$', ''));
        
        total += totalPrice;
        totalQuantity += quantity;
        
        message += `• ${productName} x${quantity} - $${unitPrice.toFixed(2)} = $${totalPrice.toFixed(2)}\n`;
    });
    
    message += `\n💰 *Total: $${total.toFixed(2)}*\n`;
    message += `📦 *Cantidad total de productos: ${totalQuantity}*\n\n`;
    message += `📅 Fecha: ${new Date().toLocaleDateString()}\n`;
    message += `⏰ Hora: ${new Date().toLocaleTimeString()}\n\n`;
    message += '¡Gracias por su pedido! 🙏';
    
    sendWhatsAppMessage(message);
}

// Función para validar formularios
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
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

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${getNotificationClass(type)}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Función para obtener clase de notificación
function getNotificationClass(type) {
    switch (type) {
        case 'success':
            return 'bg-green-500 text-white';
        case 'error':
            return 'bg-red-500 text-white';
        case 'warning':
            return 'bg-yellow-500 text-white';
        default:
            return 'bg-blue-500 text-white';
    }
}

// Función para formatear números como moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(amount);
}

// Función para confirmar acciones
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryToggles();
    initializeProductForms();
    
    // Inicializar tooltips si existen
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
});

// Funciones de tooltip
function showTooltip(event) {
    const tooltip = event.target;
    const tooltipText = tooltip.getAttribute('data-tooltip');
    
    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'absolute bg-black text-white p-2 rounded text-sm z-50';
    tooltipElement.textContent = tooltipText;
    tooltipElement.id = 'tooltip';
    
    document.body.appendChild(tooltipElement);
    
    const rect = tooltip.getBoundingClientRect();
    tooltipElement.style.top = `${rect.bottom + 5}px`;
    tooltipElement.style.left = `${rect.left}px`;
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Función para manejar errores
function handleError(error, userMessage = 'Ha ocurrido un error') {
    console.error('Error:', error);
    showNotification(userMessage, 'error');
}

// Exportar funciones principales para uso global
window.YaconApp = {
    sendWhatsAppMessage,
    showNotification,
    validateForm,
    formatCurrency,
    confirmAction,
    handleError
};
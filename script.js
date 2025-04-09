document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count');
        countElements.forEach(el => {
            el.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        });
    }
    
    function updateCartTable() {
        const cartTable = document.getElementById('cart-table');
        if (!cartTable) return;
        
        cartTable.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price} руб. x ${item.quantity}</td>
                <td>
                    <button class="remove-item" data-index="${index}">Удалить</button>
                </td>
            `;
            
            cartTable.appendChild(row);
        });
        
        document.getElementById('cart-total').textContent = `${total} руб.`;
    }
    
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price: parseInt(price),
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        if (window.location.pathname.includes('cart.html')) {
            updateCartTable();
        }
    }
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            
            addToCart(id, name, price);
            alert(`${name} добавлен в корзину!`);
        });
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTable();
            updateCartCount();
        }
    });
    
    document.getElementById('clear-cart')?.addEventListener('click', function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTable();
        updateCartCount();
    });
    
    document.getElementById('checkout')?.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Заказ оформлен! Сумма: ${total} руб.`);
        
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTable();
        updateCartCount();
    });
    
    updateCartCount();
    updateCartTable();
});
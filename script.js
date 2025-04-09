document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.createElement('div');
    burgerMenu.className = 'burger-menu';
    burgerMenu.innerHTML = '☰';
    burgerMenu.style.display = 'none';
    burgerMenu.style.cursor = 'pointer';
    burgerMenu.style.fontSize = '1.5rem';
    
    const header = document.querySelector('header');
    header.insertBefore(burgerMenu, header.firstChild);
    
    const nav = document.querySelector('nav');
    
    function toggleMenu() {
        nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
    }
    
    burgerMenu.addEventListener('click', toggleMenu);
    
    function checkScreenSize() {
        if (window.innerWidth < 768) {
            burgerMenu.style.display = 'block';
            nav.style.display = 'none';
        } else {
            burgerMenu.style.display = 'none';
            nav.style.display = 'block';
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    
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
    
    function showSuccessModal(message) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close">&times;</button>
                <h3 class="modal-title">Успешно!</h3>
                <div class="modal-content">
                    <p class="success-message">${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }
    
    function showCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal">
                <button class="modal-close">&times;</button>
                <h3 class="modal-title">Оформление заказа</h3>
                <div class="modal-content">
                    <form id="checkout-form">
                        <div class="form-group">
                            <label for="name">ФИО:</label>
                            <input type="text" id="name" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Телефон:</label>
                            <input type="tel" id="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label for="address">Адрес авто:</label>
                            <input type="text" id="address">
                        </div>
                        <div class="form-group">
                            <label for="comments">Комментарии:</label>
                            <textarea id="comments" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn">Подтвердить заказ</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.querySelector('#checkout-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                showSuccessModal(`Заказ оформлен! Сумма: ${total} руб. Мы свяжемся с вами в ближайшее время.`);
                
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartTable();
                updateCartCount();
            }, 300);
        });
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
        showSuccessModal(`${name} добавлен в корзину!`);
        
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
        });
    });
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            const itemName = cart[index].name;
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartTable();
            updateCartCount();
            showSuccessModal(`${itemName} удалён из корзины`);
        }
    });
    
    document.getElementById('clear-cart')?.addEventListener('click', function() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartTable();
        updateCartCount();
        showSuccessModal('Корзина очищена');
    });
    
    document.getElementById('checkout')?.addEventListener('click', function() {
        if (cart.length === 0) {
            showSuccessModal('Корзина пуста!');
            return;
        }
        
        showCheckoutModal();
    });
    
    updateCartCount();
    updateCartTable();
});
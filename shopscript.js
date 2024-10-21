document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.Cart');
    const checkoutButton = document.getElementById('checkout-button');
    const modal = document.getElementById('receipt-modal');
    const closeButton = document.querySelector('.close-button');
    const receiptDetails = document.getElementById('receipt-details');
    const receiptTotal = document.getElementById('receipt-total');
    const confirmCheckout = document.getElementById('confirm-checkout');

    // Load cart items from localStorage and display them in cart.html
    loadCartItems();

    cartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemDiv = event.target.closest('.item');

            // Get the product details
            const productImage = itemDiv.querySelector('img').src;
            const productName = itemDiv.querySelector('h2').textContent;
            const productPrice = itemDiv.querySelector('.price').textContent;

            // Add to cart and store in localStorage
            addToCart(productName, productImage, productPrice);

            alert('Product added to cart!');
        });
    });

    // Add product to localStorage
    function addToCart(productName, productImage, productPrice) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Check if the item is already in the cart
        const existingItemIndex = cartItems.findIndex(item => item.name === productName);
        if (existingItemIndex !== -1) {
            cartItems[existingItemIndex].quantity += 1;
        } else {
            cartItems.push({ name: productName, image: productImage, price: productPrice, quantity: 1 });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Load cart items from localStorage in cart.html
    function loadCartItems() {
        const cartDiv = document.getElementById('cart-div');
        const totalPriceElement = document.getElementById('total-price');
        let totalPrice = 0;
        if (!cartDiv) return;

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartDiv.innerHTML = '';

        cartItems.forEach((item, index) => {
            const itemPrice = parseFloat(item.price.replace('$', '')); // Convert price to number
            const itemSubtotal = itemPrice * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `

                <div class="cart-product">
                    <img src="${item.image}" alt="${item.name}" class="cart-product-img" style="width: 100px; height: 100px; margin: 20px; border-radius: 15px; box-shadow: 0px 5px 5px 0px black;">
                </div>
                <div class="product-con">
                    <h6>${item.name}</h6>
                </div>
                <div class="num-quantity">
                    <span class="decrease-quantity" data-index="${index}">-</span>
                    <h6>${item.quantity}</h6>
                    <span class="increase-quantity" data-index="${index}">+</span>
                </div>
                <div class="sub-total">
                    <h6>$${itemSubtotal.toFixed(2)}</h6>
                </div>
                <div class="action-b">
                    <h6 class="delete-b" data-index="${index}">Remove</h6>
                </div>
            `;

            // Append the cart item to the cart div
            cartDiv.appendChild(cartItem);
            totalPrice += itemSubtotal;
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        // Attach event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.delete-b');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeCartItem);
        });

        // Attach event listeners to quantity buttons
        const increaseButtons = document.querySelectorAll('.increase-quantity');
        increaseButtons.forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });

        const decreaseButtons = document.querySelectorAll('.decrease-quantity');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
    }

    // Increase item quantity
    function increaseQuantity(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Increase quantity of the item
        cartItems[index].quantity += 1;

        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Reload the cart items to reflect changes
        loadCartItems();
    }

    // Decrease item quantity
    function decreaseQuantity(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Decrease quantity of the item if greater than 1
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;

            // Update localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
            // If quantity is 1, ask if they want to remove it
            if (confirm('Remove this item from your cart?')) {
                cartItems.splice(index, 1);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        }

        // Reload the cart items to reflect changes
        loadCartItems();
    }

    // Remove item from the cart
    function removeCartItem(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Remove the item at the specified index
        cartItems.splice(index, 1);

        // Update localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Reload the cart items
        loadCartItems();
    }

    checkoutButton.addEventListener('click', showReceipt);

    function showReceipt() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let totalPrice = 0;
        receiptDetails.innerHTML = ''; // Clear previous details

        cartItems.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('$', '')); // Convert price to number
            const itemSubtotal = itemPrice * item.quantity;
            totalPrice += itemSubtotal;

            // Add item details to the receipt
            receiptDetails.innerHTML += `
                <p>${item.name} - $${itemPrice.toFixed(2)} x ${item.quantity} ........................................................................................... $${itemSubtotal.toFixed(2)}</p>
            `;
        });

        // Set total price in receipt
        receiptTotal.innerHTML = `<h4>Total: $${totalPrice.toFixed(2)}</h4>`;

        // Display the modal
        modal.style.display = 'block';
    }

    // Close modal when close button is clicked
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Optional: Confirm checkout logic
    confirmCheckout.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        localStorage.removeItem('cartItems'); // Clear cart after purchase
        loadCartItems(); // Refresh cart display
        modal.style.display = 'none'; // Close modal
    });
});

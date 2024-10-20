
document.addEventListener('DOMContentLoaded', () => {
    loadCartItems();

    // Load cart items from localStorage
    function loadCartItems() {
        const cartDiv = document.getElementById('cart-div');
        const totalPriceElement = document.getElementById('total-price');
        let totalPrice = 0;
        
        // Retrieve cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        cartDiv.innerHTML = ''; // Clear previous cart items

        if (cartItems.length === 0) {
            cartDiv.innerHTML = '<p>Your cart is empty.</p>';
            totalPriceElement.textContent = '$0.00'; // Set total price to 0 if empty
            return;
        }
        // Attach event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeCartItem);
        });
    }
    

    // Remove item from the cart
    function removeCartItem(event) {
        const index = event.target.getAttribute('data-index');
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        cartItems.splice(index, 1); // Remove item at the clicked index

        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update localStorage
        loadCartItems(); // Reload cart items
    }
});

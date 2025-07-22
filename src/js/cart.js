import { getLocalStorage, setLocalStorage, loadHeaderFooter, updateCartCount } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");
  
  // Handle legacy single-item cart format (convert to array)
  if (cartItems && !Array.isArray(cartItems)) {
    cartItems = [cartItems];
    setLocalStorage("so-cart", cartItems); // Update to new format
  }
  
  // Update cart count display
  updateCartCount();
  
  // Check if cart is empty or null
  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = `
      <li class="cart-empty">
        <p>Your cart is empty</p>
        <a href="/index.html">Continue Shopping</a>
      </li>`;
    // Hide the cart total
    document.querySelector(".cart-footer").classList.add("hide");
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  
  // Add event listeners to remove buttons
  addRemoveListeners();
  
  // Calculate and display total
  renderCartTotal(cartItems);
}

function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    return total + parseFloat(item.FinalPrice);
  }, 0);
}

function renderCartTotal(cartItems) {
  const total = calculateTotal(cartItems);
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");
  
  if (cartFooter && cartTotal) {
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  }
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
  <span class="cart-remove" data-id="${item.Id}">X</span>
</li>`;

  return newItem;
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];
  
  // Find and remove the first item with matching ID
  const itemIndex = cartItems.findIndex(item => item.Id === productId);
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    
    // Re-render the cart
    renderCartContents();
  }
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-remove");
  removeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      removeFromCart(productId);
    });
  });
}

renderCartContents();
addRemoveListeners();

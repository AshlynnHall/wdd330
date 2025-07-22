import { getLocalStorage, setLocalStorage, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import { showCartBreadcrumb } from "./breadcrumb.mjs";

// Load header and footer
loadHeaderFooter().then(() => {
  // Show cart breadcrumb after header loads
  setTimeout(() => {
    showCartBreadcrumb();
  }, 200);
});

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
  
  // Add event listeners to quantity buttons
  addQuantityListeners();
  
  // Calculate and display total
  renderCartTotal(cartItems);
}

function calculateTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.FinalPrice || item.ListPrice || 0);
    const quantity = item.quantity || 1;
    return total + (price * quantity);
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
  // Get different image sizes for responsive display
  const imageMedium = item.Images?.PrimaryMedium || item.Image || '';
  const imageSmall = item.Images?.PrimarySmall || item.Images?.PrimaryMedium || item.Image || '';
  
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <picture>
      <source media="(min-width: 480px)" srcset="${imageMedium}">
      <img src="${imageSmall}" alt="${item.Name}" />
    </picture>
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors?.[0]?.ColorName || 'N/A'}</p>
  <div class="cart-card__quantity">
    <button class="qty-btn" data-id="${item.Id}" data-action="decrease">-</button>
    <span class="qty-display">${item.quantity || 1}</span>
    <button class="qty-btn" data-id="${item.Id}" data-action="increase">+</button>
  </div>
  <p class="cart-card__price">$${(item.FinalPrice || item.ListPrice || 0) * (item.quantity || 1)}</p>
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

function addQuantityListeners() {
  const quantityButtons = document.querySelectorAll(".qty-btn");
  quantityButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      const action = e.target.getAttribute("data-action");
      updateQuantity(productId, action);
    });
  });
}

function updateQuantity(productId, action) {
  let cartItems = getLocalStorage("so-cart") || [];
  
  // Find the item in the cart
  const itemIndex = cartItems.findIndex(item => item.Id === productId);
  if (itemIndex > -1) {
    const item = cartItems[itemIndex];
    const currentQuantity = item.quantity || 1;
    
    if (action === "increase") {
      item.quantity = currentQuantity + 1;
    } else if (action === "decrease") {
      if (currentQuantity > 1) {
        item.quantity = currentQuantity - 1;
      } else {
        // If quantity would go to 0, remove the item
        cartItems.splice(itemIndex, 1);
        setLocalStorage("so-cart", cartItems);
        renderCartContents();
        return;
      }
    }
    
    // Update localStorage and re-render
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

renderCartContents();
addRemoveListeners();

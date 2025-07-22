import { getLocalStorage, setLocalStorage, loadHeaderFooter, updateCartCount } from "./utils.mjs";
import { showCartBreadcrumb } from "./breadcrumb.mjs";

loadHeaderFooter().then(() => {
  setTimeout(() => {
    showCartBreadcrumb();
  }, 200);
});

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart");
  
  if (cartItems && !Array.isArray(cartItems)) {
    cartItems = [cartItems];
    setLocalStorage("so-cart", cartItems); 
  }
  

  updateCartCount();
  

  if (!cartItems || cartItems.length === 0) {
    document.querySelector(".product-list").innerHTML = `
      <li class="cart-empty">
        <p>Your cart is empty</p>
        <a href="/index.html">Continue Shopping</a>
      </li>`;
    document.querySelector(".cart-footer").classList.add("hide");
    return;
  }
  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  
  addRemoveListeners();
  
  addQuantityListeners();
  
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
  const itemIndex = cartItems.findIndex(item => item.Id === productId);
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
    setLocalStorage("so-cart", cartItems);
    
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
        cartItems.splice(itemIndex, 1);
        setLocalStorage("so-cart", cartItems);
        renderCartContents();
        return;
      }
    }
    
    setLocalStorage("so-cart", cartItems);
    renderCartContents();
  }
}

renderCartContents();
addRemoveListeners();

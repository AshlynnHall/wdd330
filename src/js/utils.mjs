// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Get URL parameter
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Template rendering functions
export function renderWithTemplate(templateFn, parentElement, data, callback) {
  templateFn().then((html) => {
    parentElement.innerHTML = html;
    if (callback) {
      callback(data);
    }
  });
}

export function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}

export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  
  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#main-footer");
  
  const promises = [];
  
  if (headerEl) {
    const headerPromise = new Promise((resolve) => {
      renderWithTemplate(headerTemplateFn, headerEl, null, () => {
        // Update cart count after header is loaded
        updateCartCount();
        // Setup search functionality
        setupSearch();
        resolve();
      });
    });
    promises.push(headerPromise);
  }
  
  if (footerEl) {
    const footerPromise = new Promise((resolve) => {
      renderWithTemplate(footerTemplateFn, footerEl, null, resolve);
    });
    promises.push(footerPromise);
  }
  
  // Wait for both header and footer to load
  await Promise.all(promises);
}

// Cart animation function
export function animateCartIcon() {
  // Try to find the cart element, wait a bit if not found (header might still be loading)
  function tryAnimate(attempts = 0) {
    const cartElement = document.querySelector(".cart");
    
    if (cartElement) {
      cartElement.classList.add("cart-animate");
      // Remove the animation class after animation completes
      setTimeout(() => {
        cartElement.classList.remove("cart-animate");
      }, 1000); // Animation duration
    } else if (attempts < 5) {
      setTimeout(() => tryAnimate(attempts + 1), 100);
    }
  }
  
  tryAnimate();
}

// Update cart count display
export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCountElement = document.getElementById("cart-count");
  
  if (cartCountElement) {
    const count = cartItems.length;
    cartCountElement.textContent = count;
    
    // Hide the count if cart is empty
    if (count === 0) {
      cartCountElement.classList.add("hide");
    } else {
      cartCountElement.classList.remove("hide");
    }
  }
}

// Setup search functionality
export function setupSearch() {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm) {
        // Redirect to product-list page with search parameter
        window.location.href = `/product-list/index.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
}
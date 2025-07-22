export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderWithTemplate(templateFn, parentElement, data, callback) {
  templateFn().then((html) => {
    parentElement.innerHTML = html;
    if (callback) {
      requestAnimationFrame(() => {
        callback(data);
      });
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
      renderWithTemplate(headerTemplateFn, headerEl, null, async () => {
        updateCartCount();
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
  
  await Promise.all(promises);
}

// Cart animation function
export function animateCartIcon() {
  function tryAnimate(attempts = 0) {
    const cartElement = document.querySelector(".cart");
    
    if (cartElement) {
      cartElement.classList.add("cart-animate");
      setTimeout(() => {
        cartElement.classList.remove("cart-animate");
      }, 1000); 
    } else if (attempts < 5) {
      setTimeout(() => tryAnimate(attempts + 1), 100);
    }
  }
  
  tryAnimate();
}

export function updateCartCount() {
  const cartItems = getLocalStorage("so-cart") || [];
  const cartCountElement = document.getElementById("cart-count");
  
  if (cartCountElement) {
    const count = cartItems.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
    
    cartCountElement.textContent = count;
    
    if (count === 0) {
      cartCountElement.classList.add("hide");
    } else {
      cartCountElement.classList.remove("hide");
    }
  }
}

export function setupSearch() {
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const searchInput = document.getElementById("search-input");
      const searchTerm = searchInput.value.trim();
      
      if (searchTerm) {
        window.location.href = `/product-list/index.html?search=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
}
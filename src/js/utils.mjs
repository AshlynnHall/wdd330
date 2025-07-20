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

export function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  
  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("#main-footer");
  
  if (headerEl) {
    renderWithTemplate(headerTemplateFn, headerEl);
  }
  if (footerEl) {
    renderWithTemplate(footerTemplateFn, footerEl);
  }
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
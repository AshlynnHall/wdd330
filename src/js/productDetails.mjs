import { findProductById } from "./productData.mjs";
import { setLocalStorage, getLocalStorage, animateCartIcon, updateCartCount } from "./utils.mjs";

let product = {};

function addToCart() {
  // Get existing cart items or start with an empty array
  let cartItems = getLocalStorage("so-cart") || [];
  
  // Add the current product to the cart
  cartItems.push(product);
  
  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cartItems);
  
  // Update cart count display
  updateCartCount();
  
  // Animate the cart icon to show something was added
  animateCartIcon();
}

function renderProductDetails() {
  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
  
  const productImage = document.getElementById("productImage");
  productImage.src = product.Image;
  productImage.alt = product.Name;
  
  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").setAttribute("data-id", product.Id);
  
  // Add discount indicator if there's a discount (same style as main page)
  if (product.SuggestedRetailPrice > product.FinalPrice) {
    const discountPercent = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
    
    // Make the product detail section relative for positioning
    const productDetailSection = document.querySelector(".product-detail");
    if (productDetailSection) {
      productDetailSection.style.position = "relative";
    }
    
    // Create and add discount badge (same style as main page)
    const discountBadge = document.createElement("div");
    discountBadge.style.cssText = "background: red; color: white; padding: 2px 4px; font-size: 12px; position: absolute; top: 75px; right: 15px; border: 2px solid black; z-index: 10;";
    discountBadge.textContent = `-${discountPercent}%`;
    productDetailSection.appendChild(discountBadge);
  }
}

function renderProductNotFound(productId) {
  const productDetailSection = document.querySelector(".product-detail");
  if (productDetailSection) {
    productDetailSection.style.display = "none";
  }
  
  const main = document.querySelector("main");
  if (main) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "error-container";
    errorContainer.innerHTML = `
      <div class="error-message">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
      </div>
    `;
    main.appendChild(errorContainer);
  }
}

export default async function productDetails(productId) {
  try {
    // use findProductById to get the details for the current product
    product = await findProductById(productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      renderProductNotFound(productId);
      return;
    }
    
    // once we have the product details we can render out the HTML
    renderProductDetails();
    
    // add a listener to Add to Cart button
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", addToCart);
    }
  } catch (error) {
    console.error("Error in productDetails:", error);
    // Show error message to user if there's any other error
    renderProductNotFound(productId || "unknown");
  }
}

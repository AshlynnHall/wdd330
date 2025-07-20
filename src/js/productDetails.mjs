import { findProductById } from "./productData.mjs";
import { setLocalStorage, getLocalStorage, animateCartIcon } from "./utils.mjs";

let product = {};

function addToCart() {
  // Get existing cart items or start with an empty array
  let cartItems = getLocalStorage("so-cart") || [];
  
  // Add the current product to the cart
  cartItems.push(product);
  
  // Save the updated cart back to localStorage
  setLocalStorage("so-cart", cartItems);
  
  // Animate the cart icon to show something was added
  animateCartIcon();
}

function renderProductDetails() {
  document.getElementById("productName").textContent = product.Name;
  document.getElementById("productNameWithoutBrand").textContent = product.NameWithoutBrand;
  document.getElementById("productImage").src = product.Image;
  document.getElementById("productImage").alt = product.Name;
  document.getElementById("productFinalPrice").textContent = `$${product.FinalPrice}`;
  document.getElementById("productColorName").textContent = product.Colors[0].ColorName;
  document.getElementById("productDescriptionHtmlSimple").innerHTML = product.DescriptionHtmlSimple;
  document.getElementById("addToCart").setAttribute("data-id", product.Id);
}

export default async function productDetails(productId) {
  try {
    // use findProductById to get the details for the current product
    product = await findProductById(productId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
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
  }
}

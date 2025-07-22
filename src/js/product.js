import { getParam, loadHeaderFooter } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

// Load header and footer
loadHeaderFooter();

// Get product ID from URL parameter first
let productId = getParam("product");

// If no URL parameter, try to get from data attribute in the page
if (!productId) {
  // Wait a moment for the DOM to be ready, then check for data-id
  setTimeout(() => {
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      productId = addToCartButton.dataset.id;
      console.log("Found product ID in data attribute:", productId);
      
      if (productId) {
        productDetails(productId);
      }
    }
  }, 100);
} else {
  // Load product details if we have a product ID from URL
  productDetails(productId);
}

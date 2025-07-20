import { getParam, loadHeaderFooter } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

console.log("Product.js loaded");

// Load header and footer
loadHeaderFooter();

// Get product ID from URL
const productId = getParam("product");
console.log("Product ID from URL:", productId);

// Load product details if we have a product ID
if (productId) {
  console.log("Calling productDetails with:", productId);
  productDetails(productId);
} else {
  console.log("No product ID found in URL");
}

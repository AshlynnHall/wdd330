import { getParam, loadHeaderFooter } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

// Load header and footer
loadHeaderFooter();

// Get product ID from URL
const productId = getParam("product");

// Load product details if we have a product ID
if (productId) {
  productDetails(productId);
}

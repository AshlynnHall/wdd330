import { getParam, loadHeaderFooter } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

loadHeaderFooter();

let productId = getParam("product");

if (!productId) {
  setTimeout(() => {
    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      productId = addToCartButton.dataset.id;

      
      if (productId) {
        productDetails(productId);
      }
    }
  }, 100);
} else {
  productDetails(productId);
}

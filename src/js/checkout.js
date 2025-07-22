import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";
import { showCheckoutBreadcrumb } from "./breadcrumb.mjs";

// Load header and footer
loadHeaderFooter().then(() => {
  // Show checkout breadcrumb after header loads
  setTimeout(() => {
    showCheckoutBreadcrumb();
  }, 200);
});

// Initialize checkout process
checkoutProcess.init("so-cart", ".order-summary");

// Handle form submission
const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // HTML form validation
    const isValid = checkoutForm.checkValidity();
    checkoutForm.reportValidity();
    
    if (!isValid) {
      return; // Don't proceed if form is invalid
    }
    
    try {
      const response = await checkoutProcess.checkout(checkoutForm);
      console.log("Checkout successful:", response);
    } catch (error) {
      console.error("Checkout failed:", error);
      // Error message is already shown in checkoutProcess
    }
  });
}

import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";
import { showCheckoutBreadcrumb } from "./simpleBreadcrumb.mjs";

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
    
    try {
      const response = await checkoutProcess.checkout(checkoutForm);
      console.log("Checkout successful:", response);
      
      // For now, just show an alert. In the next assignment, we'll handle this properly
      alert("Order submitted successfully! Order ID: " + (response.orderId || "Generated"));
      
      // Optionally redirect to success page
      // window.location.href = "success.html";
      
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("There was an error processing your order. Please try again.");
    }
  });
}

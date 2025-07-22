import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";
import { showCheckoutBreadcrumb } from "./breadcrumb.mjs";

loadHeaderFooter().then(() => {
  setTimeout(() => {
    showCheckoutBreadcrumb();
  }, 200);
});

checkoutProcess.init("so-cart", ".order-summary");


const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }
    
    try {
      await checkoutProcess.checkout(checkoutForm);
    } catch (error) {
    }
  });
}

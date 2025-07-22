import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import Alert from "./Alert.mjs";
import { hideBreadcrumb } from "./breadcrumb.mjs";

// Load header and footer, then initialize alerts
async function initializePage() {
  // Load header and footer first
  await loadHeaderFooter();
  
  // Hide breadcrumb on home page
  setTimeout(() => {
    hideBreadcrumb();
  }, 200);
  
  // Initialize and display alerts
  const alertManager = new Alert();
  await alertManager.displayAlerts("main");
}

// Initialize the page
initializePage();

// Handle newsletter signup (does nothing)
document.addEventListener('DOMContentLoaded', () => {
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Do nothing - just prevent the form from submitting
    });
  }
});

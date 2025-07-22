import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import Alert from "./Alert.mjs";

// Load header and footer, then initialize alerts
async function initializePage() {
  // Load header and footer first
  await loadHeaderFooter();
  
  // Initialize and display alerts
  const alertManager = new Alert();
  await alertManager.displayAlerts("main");
}

// Initialize the page
initializePage();

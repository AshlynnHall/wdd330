import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import productList from "./productList.mjs";
import Alert from "./Alert.mjs";

// Load header and footer, then initialize alerts and products
async function initializePage() {
  // Load header and footer first
  await loadHeaderFooter();
  
  // Initialize and display alerts
  const alertManager = new Alert();
  await alertManager.displayAlerts("main");
  
  // Load the product list for tents
  productList("tents", ".product-list");
}

// Initialize the page
initializePage();

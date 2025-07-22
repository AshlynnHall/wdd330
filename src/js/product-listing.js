import { loadHeaderFooter, getParam } from "./utils.mjs";
import productList from "./productList.mjs";

// Load header and footer
loadHeaderFooter();

// Get the category from URL parameter
const category = getParam("category");

console.log("Category from URL:", category);

// Update the page title based on category
if (category) {
  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  document.getElementById("category-title").textContent = title;
  document.title = `Sleep Outside | ${title}`;
  
  console.log("Loading products for category:", category);
  // Load products for the category
  productList(category, ".product-list");
} else {
  console.log("No category specified");
  document.getElementById("category-title").textContent = "All Products";
}

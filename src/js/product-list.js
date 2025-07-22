import { loadHeaderFooter, getParam } from "./utils.mjs";
import productList from "./productList.mjs";
import { getSearchResults } from "./productData.mjs";

// Load header and footer
loadHeaderFooter();

// Get parameters from URL
const category = getParam("category");
const searchTerm = getParam("search");

// Update the page title and load products based on parameter type
if (searchTerm) {
  // Handle search results
  document.getElementById("category-title").textContent = `Search Results: "${searchTerm}"`;
  document.title = `Sleep Outside | Search: ${searchTerm}`;
  
  // Load search results
  loadSearchResults(searchTerm);
} else if (category) {
  // Handle category browsing
  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  document.getElementById("category-title").textContent = `Top Products: ${title}`;
  document.title = `Sleep Outside | ${title}`;
  
  // Load products for the category
  productList(category, ".product-list");
} else {
  document.getElementById("category-title").textContent = "Top Products";
}

// Function to load and display search results
async function loadSearchResults(searchTerm) {
  try {
    const results = await getSearchResults(searchTerm);
    const element = document.querySelector(".product-list");
    
    if (results && results.length > 0) {
      // Use the same template as productList
      const { renderList } = await import("./productList.mjs");
      renderList(results, ".product-list");
    } else {
      element.innerHTML = `<li><p>No products found for "${searchTerm}". Try a different search term.</p></li>`;
    }
  } catch (error) {
    console.error("Error loading search results:", error);
    document.querySelector(".product-list").innerHTML = `<li><p>Error loading search results. Please try again.</p></li>`;
  }
}

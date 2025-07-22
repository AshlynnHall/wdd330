import { loadHeaderFooter, getParam } from "./utils.mjs";
import productList from "./productList.mjs";
import { getSearchResults } from "./productData.mjs";

// Load header and footer
loadHeaderFooter();

// Get parameters from URL
const category = getParam("category");
const searchTerm = getParam("search");

// Store current products for sorting
let currentProducts = [];

// Function to sort products based on sort type
function sortProducts(products, sortType) {
  const sortedProducts = [...products]; // Create a copy to avoid mutating original
  
  switch (sortType) {
    case "name-asc":
      return sortedProducts.sort((a, b) => {
        const nameA = (a.NameWithoutBrand || a.Name || "").toLowerCase();
        const nameB = (b.NameWithoutBrand || b.Name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    case "name-desc":
      return sortedProducts.sort((a, b) => {
        const nameA = (a.NameWithoutBrand || a.Name || "").toLowerCase();
        const nameB = (b.NameWithoutBrand || b.Name || "").toLowerCase();
        return nameB.localeCompare(nameA);
      });
    case "price-asc":
      return sortedProducts.sort((a, b) => {
        const priceA = parseFloat(a.FinalPrice || a.ListPrice || 0);
        const priceB = parseFloat(b.FinalPrice || b.ListPrice || 0);
        return priceA - priceB;
      });
    case "price-desc":
      return sortedProducts.sort((a, b) => {
        const priceA = parseFloat(a.FinalPrice || a.ListPrice || 0);
        const priceB = parseFloat(b.FinalPrice || b.ListPrice || 0);
        return priceB - priceA;
      });
    default:
      return sortedProducts; // Return original order for "default"
  }
}

// Function to setup sort dropdown event listener
async function setupSortControls() {
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", async (e) => {
      const sortType = e.target.value;
      const sortedProducts = sortProducts(currentProducts, sortType);
      
      // Re-render the product list with sorted products
      const { renderList } = await import("./productList.mjs");
      renderList(sortedProducts, ".product-list");
    });
  }
}

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
  loadCategoryProducts(category);
} else {
  document.getElementById("category-title").textContent = "Top Products";
}

// Function to load category products and setup sorting
async function loadCategoryProducts(category) {
  try {
    const { getData } = await import("./productData.mjs");
    const products = await getData(category);
    currentProducts = products; // Store for sorting
    
    const { renderList } = await import("./productList.mjs");
    renderList(products, ".product-list");
    
    // Setup sort controls after products are loaded
    setupSortControls();
  } catch (error) {
    console.error("Error loading product list:", error);
  }
}

// Function to load and display search results
async function loadSearchResults(searchTerm) {
  try {
    const results = await getSearchResults(searchTerm);
    const element = document.querySelector(".product-list");
    
    if (results && results.length > 0) {
      currentProducts = results; // Store for sorting
      
      // Use the same template as productList
      const { renderList } = await import("./productList.mjs");
      renderList(results, ".product-list");
      
      // Setup sort controls after products are loaded
      setupSortControls();
    } else {
      element.innerHTML = `<li><p>No products found for "${searchTerm}". Try a different search term.</p></li>`;
    }
  } catch (error) {
    console.error("Error loading search results:", error);
    document.querySelector(".product-list").innerHTML = `<li><p>Error loading search results. Please try again.</p></li>`;
  }
}

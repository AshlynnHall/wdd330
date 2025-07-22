import { loadHeaderFooter, getParam } from "./utils.mjs";
import productList from "./productList.mjs";
import { getSearchResults } from "./externalServices.mjs";
import { showCategoryBreadcrumb, showSearchBreadcrumb } from "./breadcrumb.mjs";

loadHeaderFooter();

const category = getParam("category");
const searchTerm = getParam("search");

let currentProducts = [];


function sortProducts(products, sortType) {
  const sortedProducts = [...products]; 
  
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
      return sortedProducts;
  }
}

async function setupSortControls() {
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", async (e) => {
      const sortType = e.target.value;
      const sortedProducts = sortProducts(currentProducts, sortType);
      
      const { renderList } = await import("./productList.mjs");
      renderList(sortedProducts, ".product-list");
    });
  }
}

if (searchTerm) {
  document.getElementById("category-title").textContent = `Search Results: "${searchTerm}"`;
  document.title = `Sleep Outside | Search: ${searchTerm}`;
  
  loadSearchResults(searchTerm);
} else if (category) {
  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  document.getElementById("category-title").textContent = `Top Products: ${title}`;
  document.title = `Sleep Outside | ${title}`;
  
  loadCategoryProducts(category);
} else {
  document.getElementById("category-title").textContent = "Top Products";
}

async function loadCategoryProducts(category) {
  try {
    const { getProductsByCategory } = await import("./externalServices.mjs");
    const products = await getProductsByCategory(category);
    currentProducts = products; 
    
    const { renderList } = await import("./productList.mjs");
    renderList(products, ".product-list");
    
    setTimeout(() => {
      showCategoryBreadcrumb(category, products.length);
    }, 500);
    
    setupSortControls();
  } catch (error) {
    const element = document.querySelector(".product-list");
    if (element) {
      element.innerHTML = '<li><p>Unable to load products at this time. Please try again later.</p></li>';
    }
  }
}

async function loadSearchResults(searchTerm) {
  try {
    const results = await getSearchResults(searchTerm);
    const element = document.querySelector(".product-list");
    
    if (results && results.length > 0) {
      currentProducts = results; 
      
      const { renderList } = await import("./productList.mjs");
      renderList(results, ".product-list");
      
      setTimeout(() => {
        showSearchBreadcrumb(searchTerm, results.length);
      }, 500);
      
      setupSortControls();
    } else {
      element.innerHTML = `<li><p>No products found for "${searchTerm}". Try a different search term.</p></li>`;
      setTimeout(() => {
        showSearchBreadcrumb(searchTerm, 0);
      }, 500);
    }
  } catch (error) { 
    document.querySelector(".product-list").innerHTML = `<li><p>Error loading search results. Please try again.</p></li>`;
  }
}

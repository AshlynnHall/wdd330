import { getData } from "./productData.mjs";

// Template function to create product card HTML
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img
        src="${product.Image}"
        alt="${product.Name}"
      />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

// Function to render the list of products
function renderList(productList, selector) {
  const element = document.querySelector(selector);
  if (element) {
    const htmlStrings = productList.map(productCardTemplate);
    element.innerHTML = htmlStrings.join("");
  }
}

// Main productList function
export default async function productList(category, selector) {
  try {
    // Get the product data for the specified category
    const products = await getData(category);
    
    // Render the product list to the specified selector
    renderList(products, selector);
  } catch (error) {
    console.error("Error loading product list:", error);
  }
}

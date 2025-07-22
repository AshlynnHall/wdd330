import { loadHeaderFooter, getParam } from "./utils.mjs";
import productList from "./productList.mjs";

loadHeaderFooter();

const category = getParam("category");

if (category) {
  const title = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
  document.getElementById("category-title").textContent = title;
  document.title = `Sleep Outside | ${title}`;
  
  productList(category, ".product-list");
} else {
  document.getElementById("category-title").textContent = "All Products";
}

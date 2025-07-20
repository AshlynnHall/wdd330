import { loadHeaderFooter, updateCartCount } from "./utils.mjs";
import productList from "./productList.mjs";

// Load header and footer
loadHeaderFooter();

// Load the product list for tents
productList("tents", ".product-list");

import { loadHeaderFooter } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import { getCurrentOrders } from "./currentOrders.mjs";

loadHeaderFooter();

// Check if user is logged in
const token = checkLogin();

if (token) {
    // Load and display orders
    getCurrentOrders(token);
}

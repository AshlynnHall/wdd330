import { loadHeaderFooter } from "./utils.mjs";
import { checkLogin } from "./auth.mjs";
import { getCurrentOrders } from "./currentOrders.mjs";

loadHeaderFooter();

const token = checkLogin();

if (token) {
    getCurrentOrders(token);
}

import { getOrders } from "./externalServices.mjs";

export async function getCurrentOrders(token) {
    try {
        const orders = await getOrders(token);
        displayOrders(orders);
    } catch (error) {
        document.getElementById("orders-list").innerHTML = "<p>Error loading orders.</p>";
    }
}

function displayOrders(orders) {
    const ordersContainer = document.getElementById("orders-list");
    
    if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = "<p>No orders found.</p>";
        return;
    }
    
    const ordersHtml = orders.map(order => `
        <div class="order">
            <h3>Order #${order.id}</h3>
            <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Total: $${order.orderTotal}</p>
        </div>
    `).join("");
    
    ordersContainer.innerHTML = ordersHtml;
}

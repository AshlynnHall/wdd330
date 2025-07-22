import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { checkout } from "./externalServices.mjs";

function packageItems(items) {
  return items.map(item => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice || item.ListPrice || 0,
    quantity: item.quantity || 1
  }));
}

const checkoutProcess = {
  key: "",
  outputSelector: "",
  subtotal: 0,
  shipping: 0,
  tax: 0,
  itemCount: 0,

  init(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.calculateItemSummary();
    this.displayOrderTotals();
    const zipInput = document.getElementById("zip");
    if (zipInput) {
      zipInput.addEventListener("blur", () => {
        this.calculateOrdertotal();
      });
    }
  },

  calculateItemSummary() {
    const cartItems = getLocalStorage(this.key) || [];
    this.itemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    this.subtotal = cartItems.reduce((total, item) => {
      const price = item.FinalPrice || item.ListPrice || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
    
    this.displayOrderTotals();
  },

  calculateOrdertotal() {
    this.shipping = this.itemCount > 0 ? 10 + ((this.itemCount - 1) * 2) : 0;
    
    this.tax = this.subtotal * 0.06;
    
    this.displayOrderTotals();
  },

  displayOrderTotals() {
    const numItemsElement = document.getElementById("num-items");
    const subtotalElement = document.getElementById("cart-subtotal");
    const shippingElement = document.getElementById("shipping-estimate");
    const taxElement = document.getElementById("tax-amount");
    const totalElement = document.getElementById("order-total");

    if (numItemsElement) numItemsElement.textContent = this.itemCount;
    if (subtotalElement) subtotalElement.textContent = `$${this.subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${this.tax.toFixed(2)}`;
    if (totalElement) {
      const total = this.subtotal + this.shipping + this.tax;
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  },

  async checkout(form) {
    const formData = new FormData(form);
    const cartItems = getLocalStorage(this.key) || [];
    
    const rawCardNumber = formData.get("cardNumber");
    const cleanCardNumber = rawCardNumber ? rawCardNumber.replace(/[\s-]/g, '') : '';
    
    const orderData = {
      orderDate: new Date().toISOString(),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      street: formData.get("street"),
      city: formData.get("city"),
      state: formData.get("state"),
      zip: formData.get("zip"),
      cardNumber: cleanCardNumber,
      expiration: formData.get("expiration"),
      code: formData.get("code"),
      items: packageItems(cartItems),
      orderTotal: (this.subtotal + this.shipping + this.tax).toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2)
    };

    try {
      const response = await checkout(orderData);
      
      setLocalStorage(this.key, []);
      window.location.href = "success.html";
      
      return response;
    } catch (error) {
      alert("Order failed. Please try again.");
      throw error;
    }
  }
};

export default checkoutProcess;

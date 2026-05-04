// ============================================
// CHECKOUT PAGE SCRIPT (checkout.html)
// ============================================
// This file handles order summary display and order placement

// ============================================
// GLOBAL VARIABLES
// ============================================

let db = globalDb; // Firestore database instance

// ============================================
// DISPLAY ORDER SUMMARY
// ============================================

/**
 * Loads cart items and displays order summary on checkout page
 */
function displayOrderSummary() {
  const cart = getGlobalCart(); // Using global function
  const container = document.getElementById("orderItemsList");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-3">
        <i class="fas fa-shopping-cart fa-2x text-muted mb-2"></i>
        <p>Your cart is empty</p>
        <a href="index.html" class="btn btn-sm btn-dark">Continue Shopping</a>
      </div>
    `;
    const placeOrderBtn = document.getElementById("placeOrderBtn");
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <div class="order-item">
        <img src="${item.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="order-item-img" alt="${escapeHtml(item.name)}">
        <div class="order-item-details">
          <div class="fw-semibold">${escapeHtml(item.name)}</div>
          <div class="small text-muted">Size: ${item.size || "M"} | Qty: ${item.quantity}</div>
          <div class="small">₨ ${item.price} each</div>
        </div>
        <div class="fw-semibold">₨ ${itemTotal}</div>
      </div>
    `;
  });

  container.innerHTML = html;

  const subtotalEl = document.getElementById("summarySubtotal");
  const totalEl = document.getElementById("summaryTotal");

  if (subtotalEl) subtotalEl.innerText = `₨ ${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `₨ ${subtotal.toFixed(2)}`;
}

// ============================================
// PLACE ORDER FUNCTION
// ============================================

/**
 * Validates form, creates order object, and saves to Firestore
 * @param {Event} e - Form submit event
 */
async function placeOrder(e) {
  e.preventDefault();

  const cart = getGlobalCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    window.location.href = "cart.html";
    return;
  }

  // Get form values
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked',
  )?.value;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !address || !city) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Calculate subtotal
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  // Create order object
  const orderData = {
    customer: {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      phone,
      address,
      city,
      postalCode: postalCode || null,
    },
    items: cart,
    paymentMethod:
      paymentMethod === "cash" ? "Cash on Delivery" : "Bank Transfer",
    subtotal: subtotal,
    shipping: 0,
    total: subtotal,
    status: "pending",
    createdAt: new Date(),
    orderNumber: "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
  };

  // Disable submit button and show loading state
  const btn = document.getElementById("placeOrderBtn");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Processing...';
  btn.disabled = true;

  try {
    // Save order to Firestore
    await db.collection("orders").add(orderData);

    // Clear cart
    localStorage.removeItem("monark_cart");
    updateGlobalCartCount(); // Update cart badge

    // Store order for confirmation page
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Redirect to confirmation page
    window.location.href = "order-confirmation.html";
  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an error placing your order. Please try again.");
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - Escaped string safe for HTML
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize checkout page when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  displayOrderSummary();

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", placeOrder);
  }
});

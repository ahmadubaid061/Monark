// ============================================
// SHOPPING CART PAGE SCRIPT (cart.html)
// ============================================
// This file handles displaying cart items,
// updating quantities, removing items, and checkout

// ============================================
// DISPLAY CART ITEMS
// ============================================

/**
 * Loads and displays all items in the shopping cart
 */
function displayCart() {
  const container = document.getElementById("cartItemsContainer");
  let cart = getGlobalCart(); // Using global function

  if (cart.length === 0) {
    // Empty cart display
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-bag fa-4x text-muted mb-4"></i>
        <h4>Your cart is empty</h4>
        <p class="text-muted mb-4">Looks like you haven't added any items yet.</p>
        <a href="index.html" class="btn btn-dark">
          <i class="fas fa-arrow-left me-2"></i> Start Shopping
        </a>
      </div>
    `;
    updateTotals(0, 0);
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  // Build cart items HTML
  let html = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <div class="cart-item" data-index="${index}">
        <div class="row align-items-center">
          <div class="col-md-2 col-4">
            <img src="${item.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="cart-item-image" alt="${escapeHtml(item.name)}">
          </div>
          <div class="col-md-5 col-8">
            <h6 class="fw-semibold mb-1">${escapeHtml(item.name)}</h6>
            <p class="small text-muted mb-1">Size: ${item.size || "M"}</p>
            <p class="small text-muted">Price: ₨ ${item.price}</p>
          </div>
          <div class="col-md-3 col-6 mt-3 mt-md-0">
            <div class="quantity-control">
              <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
              <span class="quantity-value" id="qty-${index}">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
          </div>
          <div class="col-md-2 col-6 mt-3 mt-md-0 text-end">
            <div class="fw-semibold">₨ ${itemTotal}</div>
            <a href="#" class="remove-item" onclick="removeItem(${index}); return false;">
              <i class="fas fa-trash-alt me-1"></i> Remove
            </a>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateTotals(subtotal, subtotal);

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.disabled = false;
}

/**
 * Updates the quantity of a cart item
 * @param {number} index - Index of the item in cart array
 * @param {number} change - Amount to change (+1 or -1)
 */
function updateQuantity(index, change) {
  updateGlobalCartQuantity(index, change);
  displayCart(); // Refresh display
}

/**
 * Removes an item from the cart
 * @param {number} index - Index of the item to remove
 */
function removeItem(index) {
  removeFromGlobalCart(index);
  displayCart(); // Refresh display
}

/**
 * Updates the subtotal and total displays
 * @param {number} subtotal - Cart subtotal
 * @param {number} total - Cart total (with shipping)
 */
function updateTotals(subtotal, total) {
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  if (subtotalEl) subtotalEl.innerText = `₨ ${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.innerText = `₨ ${total.toFixed(2)}`;
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
// CHECKOUT BUTTON HANDLER
// ============================================

/**
 * Handles checkout button click - redirects to checkout page if cart not empty
 */
function setupCheckoutButton() {
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getGlobalCart();
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize cart page when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  displayCart();
  setupCheckoutButton();
});

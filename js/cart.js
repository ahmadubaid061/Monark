// Shopping Cart JavaScript

// Load and display cart when page loads
document.addEventListener("DOMContentLoaded", function () {
  displayCart();
  updateCartIcon();

  // Setup search icon (placeholder)
  document.getElementById("searchIcon")?.addEventListener("click", () => {
    alert("Search functionality coming soon!");
  });
});

// Display all items in cart
function displayCart() {
  const container = document.getElementById("cartItemsContainer");
  let cart = localStorage.getItem("monark_cart");

  if (!cart) {
    cart = [];
  } else {
    cart = JSON.parse(cart);
  }

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
    document.getElementById("checkoutBtn").disabled = true;
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
                        <img src="${item.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="cart-item-image" alt="${item.name}">
                    </div>
                    <div class="col-md-5 col-8">
                        <h6 class="fw-semibold mb-1">${item.name}</h6>
                        <p class="small text-muted mb-1">Size: ${item.size || "M"}</p>
                        <p class="small text-muted">Price: Rs ${item.price}</p>
                    </div>
                    <div class="col-md-3 col-6 mt-3 mt-md-0">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                            <span class="quantity-value" id="qty-${index}">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-6 mt-3 mt-md-0 text-end">
                        <div class="fw-semibold">Rs ${itemTotal}</div>
                        <a href="#" class="remove-item" onclick="removeItem(${index}); return false;">
                            <i class="fas fa-trash-alt me-1"></i> Remove
                        </a>
                    </div>
                </div>
            </div>
        `;
  });

  container.innerHTML = html;

  // Update totals
  updateTotals(subtotal, subtotal);
  document.getElementById("checkoutBtn").disabled = false;
}

// Update quantity of an item
function updateQuantity(index, change) {
  let cart = localStorage.getItem("monark_cart");
  cart = cart ? JSON.parse(cart) : [];

  if (!cart[index]) return;

  const newQuantity = cart[index].quantity + change;

  if (newQuantity < 1) {
    // If quantity becomes 0, remove the item
    removeItem(index);
    return;
  }

  cart[index].quantity = newQuantity;

  localStorage.setItem("monark_cart", JSON.stringify(cart));

  // Refresh display
  displayCart();
  updateCartIcon();

  // Show feedback
  showToast("Quantity updated");
}

// Remove an item from cart
function removeItem(index) {
  let cart = localStorage.getItem("monark_cart");
  cart = cart ? JSON.parse(cart) : [];

  const itemName = cart[index]?.name || "Item";

  cart.splice(index, 1);

  localStorage.setItem("monark_cart", JSON.stringify(cart));

  // Refresh display
  displayCart();
  updateCartIcon();

  // Show feedback
  showToast(`${itemName} removed from cart`);
}

// Update totals display
function updateTotals(subtotal, total) {
  document.getElementById("subtotal").innerText = `Rs ${subtotal.toFixed(2)}`;
  document.getElementById("total").innerText = `Rs ${total.toFixed(2)}`;
}

// Update cart icon badge (for when returning to homepage)
function updateCartIcon() {
  const cart = localStorage.getItem("monark_cart");
  let count = 0;

  if (cart) {
    const items = JSON.parse(cart);
    count = items.reduce((total, item) => total + item.quantity, 0);
  }

  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    const existingBadge = cartIcon.querySelector(".cart-badge");
    if (existingBadge) existingBadge.remove();

    if (count > 0) {
      const badge = document.createElement("span");
      badge.className = "cart-badge";
      badge.textContent = count;
      badge.style.cssText =
        "position:absolute;background:#b8860b;color:white;border-radius:50%;font-size:10px;padding:2px 6px;margin-left:8px;margin-top:-8px;";
      cartIcon.style.position = "relative";
      cartIcon.appendChild(badge);
    }
  }
}

// Show notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerHTML = `
        <div style="position:fixed;bottom:20px;right:20px;background:#28a745;color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:slideIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
            ${message}
        </div>
    `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Add slide-in animation
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// proceed to  checkout
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
  const cart = localStorage.getItem("monark_cart");
  if (!cart || JSON.parse(cart).length === 0) {
    alert("Your cart is empty!");
  } else {
    window.location.href = "checkout.html";
  }
});

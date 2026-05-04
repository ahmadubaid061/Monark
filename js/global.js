// ============================================
// GLOBAL FUNCTIONS - Shared Across All Pages
// ============================================

/**
 * Updates cart badge count on any page
 */
function updateGlobalCartCount() {
  const cart = localStorage.getItem("monark_cart");
  let count = 0;

  if (cart) {
    const items = JSON.parse(cart);
    count = items.reduce((total, item) => total + item.quantity, 0);
  }

  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    const existing = cartIcon.querySelector(".cart-badge");
    if (existing) existing.remove();

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

/**
 * Shows temporary notification
 */
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  const bgColor = type === "success" ? "#28a745" : "#dc3545";
  const icon = type === "success" ? "fa-check-circle" : "fa-exclamation-circle";

  toast.innerHTML = `
        <div style="position:fixed;bottom:20px;right:20px;background:${bgColor};color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:slideIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
            <i class="fas ${icon} me-2"></i> ${message}
        </div>
    `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Add animation CSS globally
if (!document.querySelector("#globalCartStyles")) {
  const style = document.createElement("style");
  style.id = "globalCartStyles";
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
  document.head.appendChild(style);
}

// Initialize cart count when DOM loads
document.addEventListener("DOMContentLoaded", function () {
  updateGlobalCartCount();

  // Cart icon click handler (if not already set)
  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon && !cartIcon.hasAttribute("data-listener")) {
    cartIcon.setAttribute("data-listener", "true");
    cartIcon.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }
});

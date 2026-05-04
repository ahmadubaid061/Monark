// ============================================
// GLOBAL FUNCTIONS - Shared Across All Pages
// ============================================

// ============================================
// FIREBASE CONFIGURATION (Single source of truth)
// ============================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDNJAKyOPmnNdwxhO6ptqe1EXE9YSOTmjw",
  authDomain: "monark-ecommerce.firebaseapp.com",
  projectId: "monark-ecommerce",
  storageBucket: "monark-ecommerce.firebasestorage.app",
  messagingSenderId: "721924539836",
  appId: "1:721924539836:web:5dfe03a4faa903173257b9",
};

// Initialize Firebase globally if not already initialized
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
  console.log("🔥 Firebase initialized globally!");
}

// Global database reference
let globalDb = null;
if (typeof firebase !== "undefined" && firebase.apps.length) {
  globalDb = firebase.firestore();
}

// ============================================
// CART FUNCTIONS (Global)
// ============================================

/**
 * Updates cart badge count on any page
 * Shows the number of items in cart on the shopping bag icon
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
    // Remove existing badge if present
    const existing = cartIcon.querySelector(".cart-badge");
    if (existing) existing.remove();

    // Add new badge if items exist
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
 * Gets current cart items from localStorage
 * @returns {Array} Array of cart items
 */
function getGlobalCart() {
  const cart = localStorage.getItem("monark_cart");
  return cart ? JSON.parse(cart) : [];
}

/**
 * Saves cart to localStorage and updates badge
 * @param {Array} cart - Array of cart items
 */
function saveGlobalCart(cart) {
  localStorage.setItem("monark_cart", JSON.stringify(cart));
  updateGlobalCartCount();
}

/**
 * Adds an item to the shopping cart
 * @param {string} productId - Unique product ID
 * @param {string} productName - Product name
 * @param {number} productPrice - Product price
 * @param {string} productImage - Product image URL
 * @param {string} selectedSize - Selected size (S, M, L, XL)
 * @param {number} quantity - Quantity to add
 */
function addToCartGlobal(
  productId,
  productName,
  productPrice,
  productImage,
  selectedSize,
  quantity,
) {
  let cart = getGlobalCart();

  // Check if product with same size already exists
  const existingIndex = cart.findIndex(
    (item) => item.id === productId && item.size === selectedSize,
  );

  if (existingIndex !== -1) {
    // Increase quantity if exists
    cart[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      imageUrl: productImage,
      size: selectedSize,
      quantity: quantity,
    });
  }

  saveGlobalCart(cart);
  showGlobalToast(`${productName} added to cart! (${selectedSize})`);
}

/**
 * Removes an item from cart by index
 * @param {number} index - Index of item to remove
 * @returns {Array} Updated cart array
 */
function removeFromGlobalCart(index) {
  let cart = getGlobalCart();
  const itemName = cart[index]?.name || "Item";
  cart.splice(index, 1);
  saveGlobalCart(cart);
  showGlobalToast(`${itemName} removed from cart`);
  return cart;
}

/**
 * Updates quantity of a cart item
 * @param {number} index - Index of item to update
 * @param {number} change - Amount to change (+1 or -1)
 * @returns {Array} Updated cart array
 */
function updateGlobalCartQuantity(index, change) {
  let cart = getGlobalCart();
  if (!cart[index]) return cart;

  const newQuantity = cart[index].quantity + change;
  if (newQuantity < 1) {
    return removeFromGlobalCart(index);
  }

  cart[index].quantity = newQuantity;
  saveGlobalCart(cart);
  showGlobalToast("Quantity updated");
  return cart;
}

// ============================================
// TOAST NOTIFICATION (Global)
// ============================================

/**
 * Shows a temporary notification/toast message
 * @param {string} message - The message to display
 * @param {string} type - 'success' (green) or 'error' (red)
 */
function showGlobalToast(message, type = "success") {
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

// ============================================
// SEARCH FUNCTIONALITY (Global - works on all pages that have product cards)
// ============================================

/**
 * Performs search on current page's product cards
 * Filters products in real-time as user types
 */
function performGlobalSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  if (query === "") {
    // Show all products when search is cleared
    productCards.forEach((card) => {
      const col = card.closest(".col");
      if (col) col.style.display = "";
    });
    return;
  }

  // Filter products - check both product name AND category
  let visibleCount = 0;
  productCards.forEach((card) => {
    const title =
      card.querySelector(".card-title")?.innerText.toLowerCase() || "";
    // Also check if the card is inside a category section
    const categorySection = card.closest(".category-section");
    const categoryName =
      categorySection
        ?.querySelector(".category-title")
        ?.innerText.toLowerCase() || "";

    // Match by product name OR category name
    const matches = title.includes(query) || categoryName.includes(query);

    const col = card.closest(".col");
    if (col) {
      if (matches) {
        col.style.display = "";
        visibleCount++;
      } else {
        col.style.display = "none";
      }
    }
  });

  // Update heading to show search results (only if heading exists)
  const dynamicHeading = document.getElementById("dynamicHeading");
  const dynamicDesc = document.getElementById("dynamicDesc");

  if (dynamicHeading && query !== "") {
    const originalHeading =
      dynamicHeading.getAttribute("data-original") || dynamicHeading.innerText;
    if (!dynamicHeading.hasAttribute("data-original")) {
      dynamicHeading.setAttribute("data-original", originalHeading);
    }
    dynamicHeading.innerText = `Search: "${query}"`;
  }

  if (dynamicDesc && query !== "") {
    dynamicDesc.innerText = `Found ${visibleCount} product(s)`;
  }
}

/**
 * Sets up global search input listener with debounce
 */
function setupGlobalSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  let searchTimeout;
  searchInput.addEventListener("input", () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performGlobalSearch();
    }, 300);
  });
}

// ============================================
// CART ICON CLICK HANDLER (Global)
// ============================================

/**
 * Sets up click handler for cart icon to navigate to cart page
 */
function setupGlobalCartIcon() {
  const cartIcon = document.getElementById("cartIcon");
  if (cartIcon && !cartIcon.hasAttribute("data-listener")) {
    cartIcon.setAttribute("data-listener", "true");
    cartIcon.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }
}

// ============================================
// ANIMATION STYLES (Global)
// ============================================

// Add global animation styles if not already present
if (!document.querySelector("#globalStyles")) {
  const style = document.createElement("style");
  style.id = "globalStyles";
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// INITIALIZATION (Runs on every page)
// ============================================

// Initialize global features when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  updateGlobalCartCount(); // Update cart badge
  setupGlobalCartIcon(); // Setup cart icon click
  setupGlobalSearch(); // Setup search functionality
});

// Export for use in other files (making functions available globally)
window.globalDb = globalDb;
window.getGlobalCart = getGlobalCart;
window.saveGlobalCart = saveGlobalCart;
window.addToCartGlobal = addToCartGlobal;
window.removeFromGlobalCart = removeFromGlobalCart;
window.updateGlobalCartQuantity = updateGlobalCartQuantity;
window.showGlobalToast = showGlobalToast;
window.performGlobalSearch = performGlobalSearch;

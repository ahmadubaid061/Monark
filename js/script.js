// ============================================
// HOMEPAGE SCRIPT (index.html)
// ============================================
// This file handles product loading, category filtering, and search
// Global functions are imported from global.js

// ============================================
// GLOBAL VARIABLES
// ============================================

let db = null; // Firestore database instance
let useFirebase = false; // Flag to check if Firebase is available
let currentCategory = "home"; // Currently selected category
let currentSubFilter = null; // Currently selected subcategory (for accessories)
let allProductsCache = []; // Cache of all products for faster search

// ============================================
// FIREBASE CONNECTION CHECK
// ============================================

/**
 * Checks if Firebase is available and loads products
 * @returns {boolean} True if Firebase connected
 */
function checkFirebase() {
  if (typeof firebase !== "undefined" && firebase.apps.length) {
    useFirebase = true;
    db = firebase.firestore();
    console.log("✅ Firebase connected! Loading products from database...");
    loadProductsFromFirebase("home", null);
    cacheAllProducts();
    return true;
  } else {
    console.log("⚠️ Firebase not available.");
    document.getElementById("productsGrid").innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-database fa-3x text-muted mb-3"></i>
        <h5>Unable to connect to database</h5>
        <p class="text-muted">Please refresh the page or try again later.</p>
      </div>
    `;
    return false;
  }
}

// ============================================
// LOAD PRODUCTS FROM FIRESTORE
// ============================================

/**
 * Loads products from Firestore based on category and subcategory
 * @param {string} category - The product category (home, tops, bottoms, etc.)
 * @param {string|null} subFilter - Subcategory for accessories (bags, socks, etc.)
 */
async function loadProductsFromFirebase(category, subFilter) {
  if (!db) return;

  // Reset search input when changing categories
  const searchInput = document.getElementById("globalSearchInput");
  if (searchInput) searchInput.value = "";

  // Store current category for search
  currentCategory = category;
  currentSubFilter = subFilter;

  // Show loading spinner
  document.getElementById("productsGrid").innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
      <p class="mt-3">Loading products...</p>
    </div>
  `;

  try {
    let query = db.collection("products");

    // Apply filters based on category
    if (category === "accessories" && subFilter) {
      // Accessories with specific subcategory (bags, socks, glasses, etc.)
      query = query
        .where("category", "==", "accessories")
        .where("subcategory", "==", subFilter);
    } else if (category === "accessories") {
      // All accessories (no subcategory filter)
      query = query.where("category", "==", "accessories");
    } else if (category !== "home") {
      // Specific main category (tops, bottoms, formalwear, easywear)
      query = query.where("category", "==", category);
    }
    // For "home" - show all products (no filter)

    const snapshot = await query.get();

    // If no products found
    if (snapshot.empty) {
      document.getElementById("productsGrid").innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h5>No products in this category</h5>
          <p class="text-muted">Check back later for new arrivals!</p>
        </div>
      `;
      return;
    }

    // Update page heading
    updateHeaders(category, subFilter);

    // Build products HTML
    let html = "";
    snapshot.forEach((doc) => {
      const p = doc.data();
      const hasSale = p.sale === true;
      const salePercent =
        hasSale && p.oldPrice
          ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
          : 0;

      // Generate size badges
      let sizeHtml = "";
      if (p.sizes && p.sizes.length > 0) {
        sizeHtml = `<div class="mt-2">${p.sizes.map((sz) => `<span class="size-badge">${sz}</span>`).join("")}</div>`;
      } else {
        sizeHtml = `<div class="mt-2"><span class="size-badge">S</span><span class="size-badge">M</span><span class="size-badge">L</span><span class="size-badge">XL</span></div>`;
      }

      html += `
        <div class="col">
          <div class="product-card h-100" data-id="${doc.id}">
            <img src="${p.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="card-img-top" alt="${p.name}">
            <div class="card-body">
              ${hasSale ? `<div class="mb-2"><span class="badge-sale">-${salePercent}%</span></div>` : '<div class="mb-2">&nbsp;</div>'}
              <h6 class="card-title fw-semibold">${escapeHtml(p.name)}</h6>
              <div class="mt-1">
                ${p.oldPrice ? `<span class="price-old">₨${p.oldPrice}</span>` : ""}
                <span class="price-new">₨${p.price}</span>
              </div>
              ${sizeHtml}
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById("productsGrid").innerHTML = html;

    // Make products clickable - navigate to product details page
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        window.location.href = `product-details.html?id=${id}`;
      });
    });
  } catch (error) {
    console.error("Firebase error:", error);
    document.getElementById("productsGrid").innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
        <h5>Error loading products</h5>
        <p class="text-muted">Please refresh the page.</p>
      </div>
    `;
  }
}

/**
 * Updates the page heading and description based on selected category
 * @param {string} category - The selected category
 * @param {string|null} subFilter - Subcategory filter
 */
function updateHeaders(category, subFilter) {
  const titles = {
    home: {
      title: "NEW ARRIVALS",
      desc: "Discover the latest styles, fresh from the runway.",
    },
    tops: { title: "TOPS", desc: "Elevated shirts, polos, hoodies and more." },
    bottoms: {
      title: "BOTTOMS",
      desc: "Tailored trousers, premium denim and relaxed joggers.",
    },
    formalwear: {
      title: "FORMAL WEAR",
      desc: "Sharp suits, dress shirts, and refined tailoring.",
    },
    easywear: {
      title: "EASY WEAR",
      desc: "Comfort focused, elevated lounge & soft essentials.",
    },
    accessories: {
      title: "ACCESSORIES",
      desc: "Complete your look with refined details.",
    },
  };

  let title = titles[category]?.title || "SHOP";
  let desc = titles[category]?.desc || "Explore our collection.";

  if (category === "accessories" && subFilter) {
    const subDisplay = subFilter.charAt(0).toUpperCase() + subFilter.slice(1);
    title = `${subDisplay} | Accessories`;
    desc = `Explore our curated ${subDisplay} collection.`;
  }

  document.getElementById("dynamicHeading").innerText = title;
  document.getElementById("dynamicDesc").innerText = desc;
}

// ============================================
// SEARCH FUNCTIONALITY (Using cached products)
// ============================================

/**
 * Caches all products from Firestore for faster searching
 * Called once when page loads
 */
async function cacheAllProducts() {
  if (!db) return;
  try {
    const snapshot = await db.collection("products").get();
    allProductsCache = [];
    snapshot.forEach((doc) => {
      allProductsCache.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    console.log(`📦 Cached ${allProductsCache.length} products for search`);
  } catch (error) {
    console.error("Error caching products:", error);
  }
}

/**
 * Filters products based on search query and displays results
 * Uses cached products for faster filtering
 * Searches by: product name, category, and description
 */
function performSearch() {
  const searchInput = document.getElementById("globalSearchInput");
  if (!searchInput) return;

  const query = searchInput.value.trim().toLowerCase();

  if (query === "") {
    // Reload current category when search is cleared
    if (currentCategory === "accessories" && currentSubFilter) {
      loadProductsFromFirebase(currentCategory, currentSubFilter);
    } else {
      loadProductsFromFirebase(currentCategory, null);
    }
    return;
  }

  // Filter products from cache - includes category search
  const filtered = allProductsCache.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      (product.category && product.category.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  });

  displaySearchResults(filtered, query);
}

/**
 * Displays search results on the page
 * @param {Array} products - Array of filtered products
 * @param {string} query - The search term used
 */
function displaySearchResults(products, query) {
  const productsGrid = document.getElementById("productsGrid");
  const dynamicHeading = document.getElementById("dynamicHeading");
  const dynamicDesc = document.getElementById("dynamicDesc");

  dynamicHeading.innerText = `Search Results: "${query}"`;
  dynamicDesc.innerText = `Found ${products.length} product(s)`;

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-search fa-3x text-muted mb-3"></i>
        <h5>No products found</h5>
        <p class="text-muted">Try searching with different keywords.</p>
      </div>
    `;
    return;
  }

  let html = "";
  products.forEach((product) => {
    const hasSale = product.sale === true;
    const salePercent =
      hasSale && product.oldPrice
        ? Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100,
          )
        : 0;

    let sizeHtml = "";
    if (product.sizes && product.sizes.length > 0) {
      sizeHtml = `<div class="mt-2">${product.sizes.map((sz) => `<span class="size-badge">${sz}</span>`).join("")}</div>`;
    } else {
      sizeHtml = `<div class="mt-2"><span class="size-badge">S</span><span class="size-badge">M</span><span class="size-badge">L</span><span class="size-badge">XL</span></div>`;
    }

    html += `
      <div class="col">
        <div class="product-card h-100" data-id="${product.id}">
          <img src="${product.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            ${hasSale ? `<div class="mb-2"><span class="badge-sale">-${salePercent}%</span></div>` : '<div class="mb-2">&nbsp;</div>'}
            <h6 class="card-title fw-semibold">${escapeHtml(product.name)}</h6>
            <div class="mt-1">
              ${product.oldPrice ? `<span class="price-old">₨${product.oldPrice}</span>` : ""}
              <span class="price-new">₨${product.price}</span>
            </div>
            ${sizeHtml}
          </div>
        </div>
      </div>
    `;
  });

  productsGrid.innerHTML = html;

  // Make products clickable
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      window.location.href = `product-details.html?id=${id}`;
    });
  });
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
// NAVIGATION EVENTS
// ============================================

/**
 * Sets up all navigation event listeners (categories, subcategories, footer links)
 */
function initEvents() {
  // Category navigation links (NEW IN, TOPS, BOTTOMS, etc.)
  const navLinks = document.querySelectorAll("[data-category]");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-category");
      if (useFirebase) {
        if (cat === "accessories") {
          loadProductsFromFirebase("accessories", null);
        } else {
          loadProductsFromFirebase(cat, null);
        }
      }

      // Update active nav styling
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active-nav"));
      link.classList.add("active-nav");
    });
  });

  // Accessories subcategory dropdown items (Bags, Socks, Glasses, etc.)
  const subItems = document.querySelectorAll(".dropdown-item-custom");
  subItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const subcat = item.getAttribute("data-subcat");
      if (useFirebase) {
        loadProductsFromFirebase("accessories", subcat);
      }
    });
  });

  // Footer category links
  const footerLinks = document.querySelectorAll(".footer-link");
  footerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-category");
      if (useFirebase) loadProductsFromFirebase(cat, null);
    });
  });
}

// ============================================
// BOOTSTRAP HOVER DROPDOWN (Accessories menu)
// ============================================

const dropdownElement = document.getElementById("accessoriesDropdown");
if (dropdownElement) {
  dropdownElement.addEventListener("mouseenter", function () {
    const btn = this.querySelector(".dropdown-toggle");
    const bsDropdown = bootstrap.Dropdown.getInstance(btn);
    if (bsDropdown) {
      bsDropdown.show();
    } else {
      new bootstrap.Dropdown(btn).show();
    }
  });
  dropdownElement.addEventListener("mouseleave", function () {
    const btn = this.querySelector(".dropdown-toggle");
    const bsDropdown = bootstrap.Dropdown.getInstance(btn);
    if (bsDropdown) bsDropdown.hide();
  });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize everything when DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  initEvents();
  checkFirebase();
});

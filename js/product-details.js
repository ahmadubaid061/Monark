// ============================================
// PRODUCT DETAILS PAGE SCRIPT (product-details.html)
// ============================================
// This file handles displaying single product details,
// size/quantity selection, and adding to cart

// ============================================
// GLOBAL VARIABLES
// ============================================

let db = globalDb; // Firestore database instance
let currentProduct = null; // Currently viewed product
let selectedSize = null; // Selected size (S, M, L, XL)
let quantity = 1; // Selected quantity

// ============================================
// LOAD PRODUCT FROM URL
// ============================================

/**
 * Loads product from Firestore using ID from URL parameter
 * URL format: product-details.html?id=PRODUCT_ID
 */
async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    showError("No product specified");
    return;
  }

  try {
    const doc = await db.collection("products").doc(productId).get();

    if (!doc.exists) {
      showError("Product not found");
      return;
    }

    currentProduct = { id: doc.id, ...doc.data() };
    displayProduct(currentProduct);
    loadRelatedProducts(currentProduct.category);
  } catch (error) {
    console.error("Error loading product:", error);
    showError("Error loading product details");
  }
}

// ============================================
// DISPLAY PRODUCT DETAILS
// ============================================

/**
 * Displays the product details on the page
 * @param {Object} product - Product object from Firestore
 */
function displayProduct(product) {
  const container = document.getElementById("productContainer");

  const hasSale = product.sale === true;
  const salePercent =
    hasSale && product.oldPrice
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  // Generate size options HTML
  let sizeOptions = "";
  if (product.sizes && product.sizes.length > 0) {
    sizeOptions = product.sizes
      .map(
        (size) =>
          `<span class="size-option" data-size="${size}">${size}</span>`,
      )
      .join("");
  } else {
    sizeOptions = `<span class="size-option" data-size="S">S</span>
                   <span class="size-option" data-size="M">M</span>
                   <span class="size-option" data-size="L">L</span>
                   <span class="size-option" data-size="XL">XL</span>`;
  }

  // Update breadcrumb with category name
  const categoryNames = {
    tops: "Tops",
    bottoms: "Bottoms",
    formalwear: "Formal Wear",
    easywear: "Easy Wear",
    accessories: "Accessories",
  };
  document.getElementById("breadcrumbCategory").innerText =
    categoryNames[product.category] || "Product";

  // Build product display HTML
  container.innerHTML = `
    <div class="col-md-6 mb-4">
      <img src="${product.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="product-image" alt="${product.name}">
    </div>
    <div class="col-md-6">
      ${hasSale ? `<span class="badge-sale mb-2 d-inline-block">-${salePercent}%</span>` : ""}
      <h1 class="display-6 fw-semibold">${escapeHtml(product.name)}</h1>
      
      <div class="mt-3">
        ${product.oldPrice ? `<span class="price-old fs-4">₨${product.oldPrice}</span>` : ""}
        <span class="price-new fs-2 fw-bold">₨${product.price}</span>
      </div>
      
      <div class="mt-4">
        <h6>Select Size</h6>
        <div id="sizeOptions">${sizeOptions}</div>
      </div>
      
      <div class="mt-4">
        <h6>Quantity</h6>
        <div class="quantity-selector">
          <button class="quantity-btn" id="decreaseQty">−</button>
          <span class="quantity-value" id="quantityValue">1</span>
          <button class="quantity-btn" id="increaseQty">+</button>
        </div>
      </div>
      
      <div class="mt-4">
        <button class="btn btn-dark btn-lg w-100" id="addToCartBtn">
          <i class="fas fa-shopping-bag me-2"></i> Add to Cart
        </button>
      </div>
      
      <div class="mt-4 pt-3 border-top">
        <h6>Product Description</h6>
        <p class="text-muted">${escapeHtml(product.description) || "No description available."}</p>
      </div>
      
      ${
        product.material
          ? `
      <div class="mt-3">
        <h6>Material</h6>
        <p class="text-muted">${escapeHtml(product.material)}</p>
      </div>
      `
          : ""
      }
      
      ${
        product.careInstructions
          ? `
      <div class="mt-3">
        <h6>Care Instructions</h6>
        <p class="text-muted">${escapeHtml(product.careInstructions)}</p>
      </div>
      `
          : ""
      }
    </div>
  `;

  // Setup size selection event listeners
  document.querySelectorAll(".size-option").forEach((opt) => {
    opt.addEventListener("click", function () {
      document
        .querySelectorAll(".size-option")
        .forEach((o) => o.classList.remove("active"));
      this.classList.add("active");
      selectedSize = this.getAttribute("data-size");
    });
  });

  // Select first size by default
  const firstSize = document.querySelector(".size-option");
  if (firstSize) {
    firstSize.classList.add("active");
    selectedSize = firstSize.getAttribute("data-size");
  }

  // Quantity button event listeners
  document.getElementById("decreaseQty").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      document.getElementById("quantityValue").innerText = quantity;
    }
  });

  document.getElementById("increaseQty").addEventListener("click", () => {
    quantity++;
    document.getElementById("quantityValue").innerText = quantity;
  });

  // Add to cart button event listener
  document
    .getElementById("addToCartBtn")
    .addEventListener("click", () => addToCart());
}

// ============================================
// RELATED PRODUCTS
// ============================================

/**
 * Loads related products from same category
 * @param {string} category - Product category to load related items from
 */
async function loadRelatedProducts(category) {
  try {
    const snapshot = await db
      .collection("products")
      .where("category", "==", category)
      .limit(4)
      .get();

    const relatedGrid = document.getElementById("relatedProductsGrid");

    if (snapshot.empty) {
      relatedGrid.innerHTML = `<div class="col-12 text-center"><p class="text-muted">No related products found.</p></div>`;
      return;
    }

    let html = "";
    snapshot.forEach((doc) => {
      const p = doc.data();
      const productId = doc.id;

      // Skip the current product
      if (currentProduct && currentProduct.id === productId) return;

      const hasSale = p.sale === true;

      html += `
        <div class="col">
          <div class="product-card h-100" data-id="${productId}">
            <img src="${p.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="card-img-top" alt="${escapeHtml(p.name)}">
            <div class="card-body">
              ${hasSale ? `<div class="mb-2"><span class="badge-sale">Sale</span></div>` : '<div class="mb-2">&nbsp;</div>'}
              <h6 class="card-title fw-semibold">${escapeHtml(p.name)}</h6>
              <div class="mt-1">
                <span class="price-new">₨${p.price}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    relatedGrid.innerHTML = html;

    // Make related products clickable
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        window.location.href = `product-details.html?id=${id}`;
      });
    });
  } catch (error) {
    console.error("Error loading related products:", error);
  }
}

// ============================================
// ADD TO CART FUNCTION (Product Details Page)
// ============================================

/**
 * Adds current product to shopping cart
 * Uses the global addToCartGlobal function
 */
function addToCart() {
  if (!selectedSize) {
    alert("Please select a size");
    return;
  }

  // Use the global cart function
  addToCartGlobal(
    currentProduct.id,
    currentProduct.name,
    currentProduct.price,
    currentProduct.imageUrl,
    selectedSize,
    quantity,
  );
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

/**
 * Shows error message when product fails to load
 * @param {string} message - Error message to display
 */
function showError(message) {
  document.getElementById("productContainer").innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
      <h5>${escapeHtml(message)}</h5>
      <a href="index.html" class="btn btn-dark mt-3">Back to Home</a>
    </div>
  `;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize product details page when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  if (db) {
    loadProduct();
  } else {
    console.error("Firebase not loaded!");
    showError("Unable to connect to database. Please refresh the page.");
  }
});

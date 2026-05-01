// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNJAKyOPmnNdwxhO6ptqe1EXE9YSOTmjw",
  authDomain: "monark-ecommerce.firebaseapp.com",
  projectId: "monark-ecommerce",
  storageBucket: "monark-ecommerce.firebasestorage.app",
  messagingSenderId: "721924539836",
  appId: "1:721924539836:web:5dfe03a4faa903173257b9",
};

// Initialize Firebase
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized!");
}

let db = null;
let currentProduct = null;
let selectedSize = null;
let quantity = 1;

// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {
  if (typeof firebase !== "undefined" && firebase.apps.length) {
    db = firebase.firestore();
    loadProduct();
  } else {
    console.error("Firebase not loaded!");
    document.getElementById("productContainer").innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h5>Error loading product</h5>
                <p class="text-muted">Please refresh the page.</p>
            </div>
        `;
  }

  // Cart icon click
  document.getElementById("cartIcon")?.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
});

// Load product from URL parameter
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

// Display product on page
function displayProduct(product) {
  const container = document.getElementById("productContainer");

  const hasSale = product.sale === true;
  const salePercent =
    hasSale && product.oldPrice
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100,
        )
      : 0;

  // Generate size options
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

  // Update breadcrumb
  const categoryNames = {
    tops: "Tops",
    bottoms: "Bottoms",
    formalwear: "Formal Wear",
    easywear: "Easy Wear",
    accessories: "Accessories",
  };
  document.getElementById("breadcrumbCategory").innerText =
    categoryNames[product.category] || "Product";

  container.innerHTML = `
        <div class="col-md-6 mb-4">
            <img src="${product.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="product-image" alt="${product.name}">
        </div>
        <div class="col-md-6">
            ${hasSale ? `<span class="badge-sale mb-2 d-inline-block">-${salePercent}%</span>` : ""}
            <h1 class="display-6 fw-semibold">${product.name}</h1>
            
            <div class="mt-3">
                ${product.oldPrice ? `<span class="price-old fs-4">$${product.oldPrice}</span>` : ""}
                <span class="price-new fs-2 fw-bold">$${product.price}</span>
            </div>
            
            <div class="mt-4">
                <h6>Select Size</h6>
                <div id="sizeOptions">
                    ${sizeOptions}
                </div>
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
                <p class="text-muted">${product.description || "No description available."}</p>
            </div>
            
            ${
              product.material
                ? `
            <div class="mt-3">
                <h6>Material</h6>
                <p class="text-muted">${product.material}</p>
            </div>
            `
                : ""
            }
            
            ${
              product.careInstructions
                ? `
            <div class="mt-3">
                <h6>Care Instructions</h6>
                <p class="text-muted">${product.careInstructions}</p>
            </div>
            `
                : ""
            }
        </div>
    `;

  // Size selection
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

  // Quantity buttons
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

  // Add to cart button
  document
    .getElementById("addToCartBtn")
    .addEventListener("click", () => addToCart());
}

// Load related products (same category)
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

      // Skip current product
      if (currentProduct && currentProduct.id === productId) return;

      const hasSale = p.sale === true;

      html += `
                <div class="col">
                    <div class="product-card h-100" data-id="${productId}">
                        <img src="${p.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="card-img-top" alt="${p.name}">
                        <div class="card-body">
                            ${hasSale ? `<div class="mb-2"><span class="badge-sale">Sale</span></div>` : '<div class="mb-2">&nbsp;</div>'}
                            <h6 class="card-title fw-semibold">${p.name}</h6>
                            <div class="mt-1">
                                <span class="price-new">$${p.price}</span>
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

// Add to cart function
function addToCart() {
  if (!selectedSize) {
    alert("Please select a size");
    return;
  }

  // Get current cart
  let cart = localStorage.getItem("monark_cart");
  cart = cart ? JSON.parse(cart) : [];

  // Check if product already in cart with same size
  const existingIndex = cart.findIndex(
    (item) => item.id === currentProduct.id && item.size === selectedSize,
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      imageUrl: currentProduct.imageUrl,
      size: selectedSize,
      quantity: quantity,
    });
  }

  localStorage.setItem("monark_cart", JSON.stringify(cart));

  // Update cart icon
  updateCartCount();

  // Show success message
  showToast(`${currentProduct.name} added to cart! (${selectedSize})`);
}

// Update cart count badge
function updateCartCount() {
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

// Show notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerHTML = `
        <div style="position:fixed;bottom:20px;right:20px;background:#28a745;color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:slideIn 0.3s ease;">
            ${message}
        </div>
    `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Show error message
function showError(message) {
  document.getElementById("productContainer").innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
            <h5>${message}</h5>
            <a href="index.html" class="btn btn-dark mt-3">Back to Home</a>
        </div>
    `;
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

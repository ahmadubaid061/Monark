// ============================================
// FIREBASE CONFIGURATION FOR HOMEPAGE
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyDNJAKyOPmnNdwxhO6ptqe1EXE9YSOTmjw",
  authDomain: "monark-ecommerce.firebaseapp.com",
  projectId: "monark-ecommerce",
  storageBucket: "monark-ecommerce.firebasestorage.app",
  messagingSenderId: "721924539836",
  appId: "1:721924539836:web:5dfe03a4faa903173257b9",
};

// Initialize Firebase if not already initialized
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized on homepage!");
}

let db = null;
let useFirebase = false;

// ============================================
// ORIGINAL PRODUCT DATA (FALLBACK)
// ============================================

const productData = {
  home: {
    title: "NEW IN / ESSENTIALS",
    desc: "Fresh drops and timeless staples. Explore our curated edit of new arrivals.",
    products: [
      {
        name: "Oversized Blazer",
        price: 129,
        oldPrice: 159,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuTuQ03wuIh3rC4DoPbsMKHfcW4lTotAmiTQ&s",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Merino Wool Sweater",
        price: 89,
        oldPrice: 119,
        img: "https://zed.com.pk/cdn/shop/files/IMG_20250908112439407-1_1000x1000.progressive.jpg?v=1758365677",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Relaxed Cargo Pants",
        price: 79,
        oldPrice: 99,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2xW8Um1rpIDNoCGQbYTLvXfpkKOdPWvoA1g&s",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Leather Loafer",
        price: 149,
        oldPrice: 189,
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScalgxfUXMPgAFz_U3CCb4L_Ln_BGSmwnf-Q&s",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  tops: {
    title: "TOPS",
    desc: "Elevated shirts, polos, hoodies and more.",
    products: [
      {
        name: "Classic Oxford Shirt",
        price: 55,
        oldPrice: 75,
        img: "https://placehold.co/600x800?text=Oxford+Shirt",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Organic Cotton Tee",
        price: 29,
        oldPrice: 45,
        img: "https://placehold.co/600x800?text=Cotton+Tee",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Wool Blend Sweater",
        price: 99,
        oldPrice: 129,
        img: "https://placehold.co/600x800?text=Sweater",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Linen Henley",
        price: 49,
        oldPrice: 69,
        img: "https://placehold.co/600x800?text=Henley",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  bottoms: {
    title: "BOTTOMS",
    desc: "Tailored trousers, premium denim and relaxed joggers.",
    products: [
      {
        name: "Pleated Wool Pants",
        price: 119,
        oldPrice: 159,
        img: "https://placehold.co/600x800?text=Pleated+Pants",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Slim Fit Jeans",
        price: 79,
        oldPrice: 99,
        img: "https://placehold.co/600x800?text=Jeans",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Cargo Joggers",
        price: 65,
        oldPrice: 85,
        img: "https://placehold.co/600x800?text=Joggers",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Bermuda Shorts",
        price: 45,
        oldPrice: 65,
        img: "https://placehold.co/600x800?text=Shorts",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  formalwear: {
    title: "FORMAL WEAR",
    desc: "Sharp suits, dress shirts, and refined tailoring.",
    products: [
      {
        name: "Two-Button Suit",
        price: 299,
        oldPrice: 399,
        img: "https://placehold.co/600x800?text=Suit",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Premium Dress Shirt",
        price: 69,
        oldPrice: 89,
        img: "https://placehold.co/600x800?text=Dress+Shirt",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Wool Overcoat",
        price: 219,
        oldPrice: 279,
        img: "https://placehold.co/600x800?text=Overcoat",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Silk Tie Set",
        price: 39,
        oldPrice: 55,
        img: "https://placehold.co/600x800?text=Tie+Set",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  easywear: {
    title: "EASY WEAR",
    desc: "Comfort focused, elevated lounge & soft essentials.",
    products: [
      {
        name: "French Terry Hoodie",
        price: 69,
        oldPrice: 89,
        img: "https://placehold.co/600x800?text=Hoodie",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Relaxed Jogger Set",
        price: 89,
        oldPrice: 119,
        img: "https://placehold.co/600x800?text=Jogger+Set",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Cotton Modal Tee",
        price: 34,
        oldPrice: 49,
        img: "https://placehold.co/600x800?text=Modal+Tee",
        sale: false,
        sizes: ["S", "M", "L", "XL"],
      },
      {
        name: "Oversized Cardigan",
        price: 79,
        oldPrice: 99,
        img: "https://placehold.co/600x800?text=Cardigan",
        sale: true,
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
  accessories: {
    title: "ACCESSORIES",
    desc: "Complete your look with refined details.",
    products: [
      {
        name: "Leather Backpack",
        price: 129,
        oldPrice: 169,
        img: "https://placehold.co/600x800?text=Backpack",
        sale: true,
        tag: "bags",
        sizes: ["One Size"],
      },
      {
        name: "Aviator Sunglasses",
        price: 99,
        oldPrice: 139,
        img: "https://placehold.co/600x800?text=Sunglasses",
        sale: true,
        tag: "glasses",
        sizes: ["One Size"],
      },
      {
        name: "Silk Pocket Square",
        price: 29,
        oldPrice: 45,
        img: "https://placehold.co/600x800?text=Pocket+Square",
        sale: false,
        tag: "ties",
        sizes: ["One Size"],
      },
      {
        name: "Minimalist Belt",
        price: 49,
        oldPrice: 69,
        img: "https://placehold.co/600x800?text=Belt",
        sale: false,
        tag: "belts",
        sizes: ["S", "M", "L", "XL"],
      },
    ],
  },
};

const accessorySubProducts = {
  bags: [
    {
      name: "Leather Backpack",
      price: 129,
      oldPrice: 169,
      img: "https://placehold.co/600x800?text=Backpack",
      sale: true,
      tag: "bags",
      sizes: ["One Size"],
    },
  ],
  socks: [
    {
      name: "Wool Blend Socks",
      price: 24,
      oldPrice: 35,
      img: "https://placehold.co/600x800?text=Socks",
      sale: true,
      tag: "socks",
      sizes: ["S", "M", "L"],
    },
  ],
  glasses: [
    {
      name: "Aviator Sunglasses",
      price: 99,
      oldPrice: 139,
      img: "https://placehold.co/600x800?text=Aviator",
      sale: true,
      tag: "glasses",
      sizes: ["One Size"],
    },
  ],
  ties: [
    {
      name: "Silk Tie",
      price: 39,
      oldPrice: 59,
      img: "https://placehold.co/600x800?text=Silk+Tie",
      sale: true,
      tag: "ties",
      sizes: ["One Size"],
    },
  ],
  wallets: [
    {
      name: "Leather Wallet",
      price: 45,
      oldPrice: 65,
      img: "https://placehold.co/600x800?text=Wallet",
      sale: true,
      tag: "wallets",
      sizes: ["One Size"],
    },
  ],
  belts: [
    {
      name: "Leather Belt",
      price: 49,
      oldPrice: 69,
      img: "https://placehold.co/600x800?text=Belt",
      sale: false,
      tag: "belts",
      sizes: ["S", "M", "L", "XL"],
    },
  ],
};

const subcatMap = {
  bags: "bags",
  socks: "socks",
  glasses: "glasses",
  ties: "ties",
  wallets: "wallets",
  belts: "belts",
};

// ============================================
// FIREBASE PRODUCT LOADING
// ============================================

function checkFirebase() {
  if (typeof firebase !== "undefined" && firebase.apps.length) {
    useFirebase = true;
    db = firebase.firestore();
    console.log("✅ Firebase connected! Loading products from database...");
    loadProductsFromFirebase("home", null);
    return true;
  } else {
    console.log("⚠️ Firebase not available. Using local data...");
    renderPage("home", null);
    return false;
  }
}

async function loadProductsFromFirebase(category, subFilter) {
  if (!db) {
    renderPage(category, subFilter);
    return;
  }

  document.getElementById("productsGrid").innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="mt-3">Loading products...</p>
        </div>
    `;

  try {
    let query = db.collection("products");

    if (category === "accessories" && subFilter) {
      query = query
        .where("category", "==", "accessories")
        .where("subcategory", "==", subFilter);
    } else if (category === "accessories") {
      query = query.where("category", "==", "accessories");
    } else if (category !== "home") {
      query = query.where("category", "==", category);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      console.log("No products in Firebase, using local data");
      renderPage(category, subFilter);
      return;
    }

    updateHeaders(category, subFilter);

    let html = "";
    snapshot.forEach((doc) => {
      const p = doc.data();
      const hasSale = p.sale === true;
      const salePercent =
        hasSale && p.oldPrice
          ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
          : 0;

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
                            <h6 class="card-title fw-semibold">${p.name}</h6>
                            <div class="mt-1">
                                ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ""}
                                <span class="price-new">$${p.price}</span>
                            </div>
                            ${sizeHtml}
                        </div>
                    </div>
                </div>
            `;
    });

    document.getElementById("productsGrid").innerHTML = html;

    // Make products clickable
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        window.location.href = `product-details.html?id=${id}`;
      });
    });
  } catch (error) {
    console.error("Firebase error:", error);
    renderPage(category, subFilter);
  }
}

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
// ORIGINAL RENDER FUNCTION (FALLBACK)
// ============================================

function renderPage(category, subFilter = null) {
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active-nav"));
  document.querySelectorAll("[data-category]").forEach((link) => {
    if (
      link.getAttribute("data-category") === category &&
      !link.classList.contains("dropdown-toggle")
    ) {
      link.classList.add("active-nav");
    }
  });

  let title = "",
    desc = "";
  let productsArray = [];

  if (category === "accessories" && subFilter && subcatMap[subFilter]) {
    const filterTag = subcatMap[subFilter];
    productsArray = accessorySubProducts[filterTag] || [];
    const subDisplay = subFilter.charAt(0).toUpperCase() + subFilter.slice(1);
    title = `${subDisplay} | Accessories`;
    desc = `Explore our curated ${subDisplay} collection.`;
  } else if (category === "accessories") {
    productsArray = [...productData.accessories.products];
    title = productData.accessories.title;
    desc = productData.accessories.desc;
  } else {
    const dataSource = productData[category] || productData.home;
    productsArray = [...dataSource.products];
    title = dataSource.title;
    desc = dataSource.desc;
  }

  document.getElementById("dynamicHeading").innerText = title;
  document.getElementById("dynamicDesc").innerText = desc;

  const grid = document.getElementById("productsGrid");

  if (productsArray.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><i class="fas fa-archive fa-3x text-muted mb-3"></i><h5>No products in this selection</h5></div>`;
    return;
  }

  let html = "";
  productsArray.forEach((prod, index) => {
    const hasSale =
      prod.sale === true || (prod.oldPrice && prod.oldPrice > prod.price);
    const salePercent =
      hasSale && prod.oldPrice
        ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100)
        : 0;

    let sizeHtml = "";
    if (prod.sizes && prod.sizes.length > 0 && prod.sizes[0] !== "One Size") {
      sizeHtml = `<div class="mt-2"><span class="small text-muted me-1">Sizes:</span> ${prod.sizes.map((sz) => `<span class="size-badge">${sz}</span>`).join(" ")}</div>`;
    } else if (prod.sizes && prod.sizes[0] === "One Size") {
      sizeHtml = `<div class="mt-2"><span class="size-badge">One Size</span></div>`;
    } else {
      sizeHtml = `<div class="mt-2"><span class="size-badge">S</span><span class="size-badge">M</span><span class="size-badge">L</span><span class="size-badge">XL</span></div>`;
    }

    html += `
            <div class="col">
                <div class="product-card h-100" data-id="local-${index}">
                    <img src="${prod.img}" class="card-img-top" alt="${prod.name}">
                    <div class="card-body">
                        ${hasSale ? `<div class="mb-2"><span class="badge-sale">-${salePercent}%</span></div>` : '<div class="mb-2">&nbsp;</div>'}
                        <h6 class="card-title fw-semibold">${prod.name}</h6>
                        <div class="mt-1">
                            ${prod.oldPrice ? `<span class="price-old">$${prod.oldPrice}</span>` : ""}
                            <span class="price-new">$${prod.price}</span>
                        </div>
                        ${sizeHtml}
                    </div>
                </div>
            </div>
        `;
  });

  grid.innerHTML = html;

  // Make products clickable (local fallback)
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      window.location.href = `product-details.html?id=${id}`;
    });
  });
}

// Firebase add to cart (still needed for product-details page)
async function addToCart(productId) {
  if (!db) return;

  try {
    const doc = await db.collection("products").doc(productId).get();
    if (!doc.exists) return;

    const product = doc.data();
    let cart = localStorage.getItem("monark_cart");
    cart = cart ? JSON.parse(cart) : [];

    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: product.sizes?.[0] || "M",
        quantity: 1,
      });
    }

    localStorage.setItem("monark_cart", JSON.stringify(cart));
    updateCartCount();
    showToastLocal(`${product.name} added to cart!`);
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
}

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

function showToastLocal(message) {
  const toast = document.createElement("div");
  toast.innerHTML = `<div style="position:fixed;bottom:20px;right:20px;background:#28a745;color:white;padding:12px 24px;border-radius:8px;z-index:9999;">${message}</div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ============================================
// NAVIGATION EVENTS
// ============================================

function initEvents() {
  const navLinks = document.querySelectorAll("[data-category]");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-category");
      if (useFirebase) {
        if (cat === "accessories")
          loadProductsFromFirebase("accessories", null);
        else loadProductsFromFirebase(cat, null);
      } else {
        if (cat === "accessories") renderPage("accessories", null);
        else renderPage(cat, null);
      }

      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active-nav"));
      link.classList.add("active-nav");
    });
  });

  const subItems = document.querySelectorAll(".dropdown-item-custom");
  subItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const subcat = item.getAttribute("data-subcat");
      if (useFirebase) {
        loadProductsFromFirebase("accessories", subcat);
      } else {
        if (subcat) renderPage("accessories", subcat);
      }
    });
  });

  const footerLinks = document.querySelectorAll(".footer-link");
  footerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cat = link.getAttribute("data-category");
      if (useFirebase) loadProductsFromFirebase(cat, null);
      else renderPage(cat, null);
    });
  });

  document.getElementById("cartIcon")?.addEventListener("click", () => {
    window.location.href = "cart.html";
  });

  document.getElementById("searchIcon")?.addEventListener("click", () => {
    alert("Search functionality coming soon!");
  });
}

// Bootstrap hover dropdown
const dropdownElement = document.getElementById("accessoriesDropdown");
if (dropdownElement) {
  dropdownElement.addEventListener("mouseenter", function () {
    const btn = this.querySelector(".dropdown-toggle");
    const bsDropdown = bootstrap.Dropdown.getInstance(btn);
    if (bsDropdown) bsDropdown.show();
    else new bootstrap.Dropdown(btn).show();
  });
  dropdownElement.addEventListener("mouseleave", function () {
    const btn = this.querySelector(".dropdown-toggle");
    const bsDropdown = bootstrap.Dropdown.getInstance(btn);
    if (bsDropdown) bsDropdown.hide();
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initEvents();
  updateCartCount();
  checkFirebase();
});

// Initialize Firebase
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
  console.log("Firebase initialized!");
}

// ============================================
// ORIGINAL PRODUCT DATA (kept for backup)
// ============================================
const defaultSizes = ["S", "M", "L", "XL"];

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
    desc: "Elevated shirts, polos, hoodies and more. Refined layering pieces.",
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
    {
      name: "Canvas Tote Bag",
      price: 59,
      oldPrice: 79,
      img: "https://placehold.co/600x800?text=Tote+Bag",
      sale: true,
      tag: "bags",
      sizes: ["One Size"],
    },
    {
      name: "Messenger Bag",
      price: 89,
      oldPrice: 119,
      img: "https://placehold.co/600x800?text=Messenger",
      sale: false,
      tag: "bags",
      sizes: ["One Size"],
    },
    {
      name: "Mini Crossbody",
      price: 45,
      oldPrice: 65,
      img: "https://placehold.co/600x800?text=Crossbody",
      sale: true,
      tag: "bags",
      sizes: ["One Size"],
    },
  ],
  socks: [
    {
      name: "Wool Blend Socks (3pk)",
      price: 24,
      oldPrice: 35,
      img: "https://placehold.co/600x800?text=Socks+Pack",
      sale: true,
      tag: "socks",
      sizes: ["S", "M", "L"],
    },
    {
      name: "Cotton Ankle Socks",
      price: 15,
      oldPrice: 22,
      img: "https://placehold.co/600x800?text=Ankle+Socks",
      sale: false,
      tag: "socks",
      sizes: ["S", "M", "L"],
    },
    {
      name: "Crew Length Socks",
      price: 18,
      oldPrice: 28,
      img: "https://placehold.co/600x800?text=Crew+Socks",
      sale: true,
      tag: "socks",
      sizes: ["M", "L"],
    },
    {
      name: "Patterned Dress Socks",
      price: 22,
      oldPrice: 32,
      img: "https://placehold.co/600x800?text=Dress+Socks",
      sale: false,
      tag: "socks",
      sizes: ["M", "L", "XL"],
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
    {
      name: "Round Optic Glasses",
      price: 79,
      oldPrice: 109,
      img: "https://placehold.co/600x800?text=Round+Glasses",
      sale: false,
      tag: "glasses",
      sizes: ["One Size"],
    },
    {
      name: "Square Frame",
      price: 89,
      oldPrice: 119,
      img: "https://placehold.co/600x800?text=Square+Frame",
      sale: true,
      tag: "glasses",
      sizes: ["One Size"],
    },
    {
      name: "Retro Sunglasses",
      price: 69,
      oldPrice: 99,
      img: "https://placehold.co/600x800?text=Retro",
      sale: true,
      tag: "glasses",
      sizes: ["One Size"],
    },
  ],
  ties: [
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
      name: "Classic Silk Tie",
      price: 39,
      oldPrice: 59,
      img: "https://placehold.co/600x800?text=Silk+Tie",
      sale: true,
      tag: "ties",
      sizes: ["One Size"],
    },
    {
      name: "Wool Knit Tie",
      price: 34,
      oldPrice: 49,
      img: "https://placehold.co/600x800?text=Knit+Tie",
      sale: false,
      tag: "ties",
      sizes: ["One Size"],
    },
    {
      name: "Bow Tie Set",
      price: 32,
      oldPrice: 48,
      img: "https://placehold.co/600x800?text=Bow+Tie",
      sale: true,
      tag: "ties",
      sizes: ["One Size"],
    },
  ],
  wallets: [
    {
      name: "Leather Cardholder",
      price: 45,
      oldPrice: 65,
      img: "https://placehold.co/600x800?text=Cardholder",
      sale: true,
      tag: "wallets",
      sizes: ["One Size"],
    },
    {
      name: "Bifold Wallet",
      price: 59,
      oldPrice: 85,
      img: "https://placehold.co/600x800?text=Bifold",
      sale: false,
      tag: "wallets",
      sizes: ["One Size"],
    },
    {
      name: "Money Clip Wallet",
      price: 39,
      oldPrice: 55,
      img: "https://placehold.co/600x800?text=Clip+Wallet",
      sale: true,
      tag: "wallets",
      sizes: ["One Size"],
    },
    {
      name: "Slim RFID Wallet",
      price: 49,
      oldPrice: 69,
      img: "https://placehold.co/600x800?text=RFID+Wallet",
      sale: true,
      tag: "wallets",
      sizes: ["One Size"],
    },
  ],
  belts: [
    {
      name: "Minimalist Belt",
      price: 49,
      oldPrice: 69,
      img: "https://placehold.co/600x800?text=Belt",
      sale: false,
      tag: "belts",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      name: "Reversible Leather Belt",
      price: 59,
      oldPrice: 79,
      img: "https://placehold.co/600x800?text=Reversible+Belt",
      sale: true,
      tag: "belts",
      sizes: ["M", "L", "XL"],
    },
    {
      name: "Canvas Web Belt",
      price: 29,
      oldPrice: 45,
      img: "https://placehold.co/600x800?text=Canvas+Belt",
      sale: true,
      tag: "belts",
      sizes: ["S", "M", "L"],
    },
    {
      name: "Metal Buckle Belt",
      price: 39,
      oldPrice: 59,
      img: "https://placehold.co/600x800?text=Metal+Belt",
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
// FIREBASE INTEGRATION
// ============================================
let useFirebase = false;
let db = null;

// Check if Firebase is available
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

// Load products from Firebase
async function loadProductsFromFirebase(category, subFilter) {
  if (!db) {
    renderPage(category, subFilter);
    return;
  }

  // Show loading
  document.getElementById("productsGrid").innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading products from database...</p>
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
      // Fallback to local data
      console.log("No products in Firebase, using local data");
      renderPage(category, subFilter);
      return;
    }

    // Update headers
    updateHeaders(category, subFilter);

    // Render products from Firebase
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

// Update headers
function updateHeaders(category, subFilter) {
  const titles = {
    home: {
      title: "NEW ARRIVALS",
      desc: "Discover the latest styles, fresh from the runway. Elevated essentials for every look.",
    },
    tops: {
      title: "TOPS",
      desc: "Elevated shirts, polos, hoodies and more. Refined layering pieces.",
    },
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
// ORIGINAL FUNCTIONS (kept intact)
// ============================================
function renderPage(category, subFilter = null) {
  // Update active nav
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

  if (category === "accessories") {
    const accLink = document.querySelector("#accessoriesLink");
    if (accLink) accLink.classList.add("active-nav");
  } else {
    const accLink = document.querySelector("#accessoriesLink");
    if (accLink) accLink.classList.remove("active-nav");
  }

  let title = "",
    desc = "";
  let productsArray = [];

  if (category === "accessories" && subFilter && subcatMap[subFilter]) {
    const filterTag = subcatMap[subFilter];
    if (accessorySubProducts[filterTag]) {
      productsArray = [...accessorySubProducts[filterTag]];
    } else {
      productsArray = productData.accessories.products.filter(
        (p) => p.tag === filterTag,
      );
    }
    const subDisplay = subFilter.charAt(0).toUpperCase() + subFilter.slice(1);
    title = `${subDisplay} | Accessories`;
    desc = `Explore our curated ${subDisplay} collection — premium materials and functional design.`;
  } else if (category === "accessories") {
    productsArray = [...productData.accessories.products.slice(0, 4)];
    title = productData.accessories.title;
    desc = productData.accessories.desc;
  } else {
    const dataSource = productData[category] || productData.home;
    productsArray = [...dataSource.products.slice(0, 4)];
    title = dataSource.title;
    desc = dataSource.desc;
  }

  if (productsArray.length > 4) productsArray = productsArray.slice(0, 4);

  document.getElementById("dynamicHeading").innerText = title;
  document.getElementById("dynamicDesc").innerText = desc;

  const grid = document.getElementById("productsGrid");

  if (productsArray.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5"><i class="fas fa-archive fa-3x text-muted mb-3"></i><h5>No products in this selection</h5></div>`;
    return;
  }

  let html = "";
  productsArray.forEach((prod) => {
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
        <div class="product-card h-100" data-id="${prod.name.replace(/\s/g, "-")}">
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
  // Make products clickable
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-id");
      window.location.href = `product-details.html?id=${id}`;
    });
  });
}

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
      if (useFirebase) {
        loadProductsFromFirebase(cat, null);
      } else {
        if (cat) renderPage(cat, null);
      }
    });
  });

  document.getElementById("homeLinkMain")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (useFirebase) loadProductsFromFirebase("home", null);
    else renderPage("home", null);
  });

  document
    .getElementById("searchIcon")
    ?.addEventListener("click", () =>
      alert("Search functionality coming soon"),
    );
  document
    .getElementById("cartIcon")
    ?.addEventListener("click", () => alert("Your cart is empty"));
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

// ============================================
// INITIALIZATION
// ============================================
// Wait for page to load
document.addEventListener("DOMContentLoaded", function () {
  initEvents();
  // Try Firebase first, fallback to local
  checkFirebase();
});

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNJAKyOPmnNdwxhO6ptqe1EXE9YSOTmjw",
  authDomain: "monark-ecommerce.firebaseapp.com",
  projectId: "monark-ecommerce",
  storageBucket: "monark-ecommerce.firebasestorage.app",
  messagingSenderId: "721924539836",
  appId: "1:721924539836:web:5dfe03a4faa903173257b9",
};

if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

// Load cart and display order summary
document.addEventListener("DOMContentLoaded", () => {
  displayOrderSummary();
  updateCartIcon();

  document
    .getElementById("checkoutForm")
    .addEventListener("submit", placeOrder);
  document
    .getElementById("searchIcon")
    ?.addEventListener("click", () => alert("Search coming soon!"));
});

function displayOrderSummary() {
  let cart = localStorage.getItem("monark_cart");
  cart = cart ? JSON.parse(cart) : [];

  const container = document.getElementById("orderItemsList");

  if (cart.length === 0) {
    container.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-shopping-cart fa-2x text-muted mb-2"></i>
                <p>Your cart is empty</p>
                <a href="index.html" class="btn btn-sm btn-dark">Continue Shopping</a>
            </div>
        `;
    document.getElementById("placeOrderBtn").disabled = true;
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
            <div class="order-item">
                <img src="${item.imageUrl || "https://placehold.co/600x800?text=MONARK"}" class="order-item-img" alt="${item.name}">
                <div class="order-item-details">
                    <div class="fw-semibold">${item.name}</div>
                    <div class="small text-muted">Size: ${item.size || "M"} | Qty: ${item.quantity}</div>
                    <div class="small">Rs ${item.price} each</div>
                </div>
                <div class="fw-semibold">Rs ${itemTotal}</div>
            </div>
        `;
  });

  container.innerHTML = html;
  document.getElementById("summarySubtotal").innerText =
    `Rs ${subtotal.toFixed(2)}`;
  document.getElementById("summaryTotal").innerText =
    `Rs ${subtotal.toFixed(2)}`;
}

async function placeOrder(e) {
  e.preventDefault();

  const cart = localStorage.getItem("monark_cart");
  if (!cart || JSON.parse(cart).length === 0) {
    alert("Your cart is empty!");
    window.location.href = "cart.html";
    return;
  }

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const city = document.getElementById("city").value.trim();
  const postalCode = document.getElementById("postalCode").value.trim();
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked',
  ).value;

  if (!firstName || !lastName || !email || !phone || !address || !city) {
    alert("Please fill in all required fields.");
    return;
  }

  const orderItems = JSON.parse(cart);
  let subtotal = 0;
  orderItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

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
    items: orderItems,
    paymentMethod:
      paymentMethod === "cash" ? "Cash on Delivery" : "Bank Transfer",
    subtotal: subtotal,
    shipping: 0,
    total: subtotal,
    status: "pending",
    createdAt: new Date(),
    orderNumber: "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
  };

  const btn = document.getElementById("placeOrderBtn");
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Processing...';
  btn.disabled = true;

  try {
    await db.collection("orders").add(orderData);

    localStorage.removeItem("monark_cart");

    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    window.location.href = "order-confirmation.html";
  } catch (error) {
    console.error("Error placing order:", error);
    alert("There was an error placing your order. Please try again.");
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function updateCartIcon() {
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

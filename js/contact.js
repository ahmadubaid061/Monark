// ============================================
// CONTACT PAGE FUNCTIONALITY
// ============================================

// Firebase Configuration
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
}

const db = firebase.firestore();

/**
 * Handles contact form submission
 * Saves messages to Firestore 'contacts' collection
 */
document
  .getElementById("contactForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const orderNumber = document
      .getElementById("contactOrderNumber")
      .value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    // Validate
    if (!name || !email || !subject || !message) {
      showError("Please fill in all required fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    // Disable submit button
    const submitBtn = document.querySelector(
      "#contactForm button[type='submit']",
    );
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Save to Firestore
      await db.collection("contacts").add({
        name: name,
        email: email,
        subject: subject,
        orderNumber: orderNumber || null,
        message: message,
        status: "unread",
        createdAt: new Date(),
        ip: await getUserIP(),
      });

      // Show success
      showSuccess();

      // Reset form
      document.getElementById("contactForm").reset();
    } catch (error) {
      console.error("Error sending message:", error);
      showError("Failed to send message. Please try again.");
    } finally {
      // Re-enable submit button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });

/**
 * Gets user's IP address (for tracking)
 */
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return "Unknown";
  }
}

/**
 * Shows success message
 */
function showSuccess() {
  const successDiv = document.getElementById("successMessage");
  const errorDiv = document.getElementById("errorMessage");

  successDiv.style.display = "block";
  errorDiv.style.display = "none";

  // Hide after 5 seconds
  setTimeout(() => {
    successDiv.style.display = "none";
  }, 5000);
}

/**
 * Shows error message
 */
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");

  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> ${message}`;
  errorDiv.style.display = "block";
  successDiv.style.display = "none";

  // Hide after 5 seconds
  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 5000);
}

/**
 * Update cart badge on contact page
 */
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

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Cart icon click
  document.getElementById("cartIcon")?.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
});

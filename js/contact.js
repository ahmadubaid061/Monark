// ============================================
// CONTACT PAGE SCRIPT (contact.html)
// ============================================
// This file handles contact form submission and saves messages to Firestore

// ============================================
// GLOBAL VARIABLES
// ============================================

let db = globalDb; // Firestore database instance

// ============================================
// CONTACT FORM HANDLING
// ============================================

/**
 * Handles contact form submission
 * Saves messages to Firestore 'contacts' collection
 * @param {Event} e - Form submit event
 */
async function handleContactSubmit(e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const subject = document.getElementById("contactSubject").value;
  const orderNumber =
    document.getElementById("contactOrderNumber")?.value.trim() || "";
  const message = document.getElementById("contactMessage").value.trim();

  // Validate required fields
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

  // Disable submit button and show loading state
  const submitBtn = document.querySelector(
    "#contactForm button[type='submit']",
  );
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
  submitBtn.disabled = true;

  try {
    // Save message to Firestore
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

    // Show success message
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
}

/**
 * Gets user's IP address for tracking purposes
 * @returns {string} User's IP address or "Unknown"
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

// ============================================
// UI MESSAGE DISPLAY
// ============================================

/**
 * Shows success message after form submission
 */
function showSuccess() {
  const successDiv = document.getElementById("successMessage");
  const errorDiv = document.getElementById("errorMessage");

  if (successDiv) successDiv.style.display = "block";
  if (errorDiv) errorDiv.style.display = "none";

  // Hide after 5 seconds
  setTimeout(() => {
    if (successDiv) successDiv.style.display = "none";
  }, 5000);
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");

  if (errorDiv) {
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> ${escapeHtml(message)}`;
    errorDiv.style.display = "block";
  }
  if (successDiv) successDiv.style.display = "none";

  // Hide after 5 seconds
  setTimeout(() => {
    if (errorDiv) errorDiv.style.display = "none";
  }, 5000);
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
// INITIALIZATION
// ============================================

/**
 * Initialize contact page when DOM is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }
});

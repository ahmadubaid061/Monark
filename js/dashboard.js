// ============================================
// FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyDNJAKyOPmnNdwxhO6ptqe1EXE9YSOTmjw",
    authDomain: "monark-ecommerce.firebaseapp.com",
    projectId: "monark-ecommerce",
    storageBucket: "monark-ecommerce.firebasestorage.app",
    messagingSenderId: "721924539836",
    appId: "1:721924539836:web:5dfe03a4faa903173257b9"
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Global variables
let currentUser = null;

// ============================================
// AUTHENTICATION & PAGE INITIALIZATION
// ============================================

// Check authentication state when page loads
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is logged in - show dashboard
        currentUser = user;
        showDashboard();
        loadProducts();
        document.getElementById("adminEmailDisplay").innerText = user.email;
    } else {
        // User is not logged in - show login form
        showLogin();
    }
});

// Show login form and hide dashboard
function showLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("dashboardSection").style.display = "none";
}

// Show dashboard and hide login form
function showDashboard() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";
}

// ============================================
// LOGIN / LOGOUT HANDLERS
// ============================================

// Handle login form submission
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast("Login successful!", "success");
    } catch (error) {
        console.error("Login error:", error);
        showToast(error.message, "error");
    }
});

// Handle logout button click
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
    await auth.signOut();
    showToast("Logged out", "success");
});

// ============================================
// TAB SWITCHING
// ============================================

// Handle tab clicks (Products / Add Product)
document.querySelectorAll("[data-tab]").forEach(tab => {
    tab.addEventListener("click", (e) => {
        e.preventDefault();
        const tabName = tab.getAttribute("data-tab");
        
        // Update active tab styling
        document.querySelectorAll("[data-tab]").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        // Show/hide appropriate tab content
        if (tabName === "products") {
            document.getElementById("productsTab").style.display = "block";
            document.getElementById("addTab").style.display = "none";
            loadProducts(); // Refresh product list
        } else if (tabName === "add") {
            document.getElementById("productsTab").style.display = "none";
            document.getElementById("addTab").style.display = "block";
        }
    });
});

// ============================================
// SUBCATEGORY UI HANDLERS
// ============================================

// Show/hide subcategory field when category changes (Add form)
document.getElementById("prodCategory")?.addEventListener("change", function() {
    const subcatContainer = document.getElementById("subcategoryContainer");
    if (this.value === "accessories") {
        subcatContainer.style.display = "block";
        document.getElementById("prodSubcategory").required = true;
    } else {
        subcatContainer.style.display = "none";
        document.getElementById("prodSubcategory").required = false;
        document.getElementById("prodSubcategory").value = "";
    }
});

// Show/hide subcategory field when category changes (Edit modal)
document.getElementById("editCategory")?.addEventListener("change", function() {
    const subcatContainer = document.getElementById("editSubcategoryContainer");
    if (this.value === "accessories") {
        subcatContainer.style.display = "block";
    } else {
        subcatContainer.style.display = "none";
        document.getElementById("editSubcategory").value = "";
    }
});

// ============================================
// PRODUCT CRUD OPERATIONS
// ============================================

/**
 * Loads all products from Firestore and displays them in a table
 */
async function loadProducts() {
    const container = document.getElementById("productsList");
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-warning"></div><p class="mt-3">Loading products...</p></div>';
    
    try {
        // Get all products ordered by name
        const snapshot = await db.collection("products").orderBy("name").get();
        
        if (snapshot.empty) {
            container.innerHTML = '<div class="text-center py-5"><p>No products found. Add your first product!</p></div>';
            return;
        }
        
        // Build products table HTML
        let html = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Sale</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        snapshot.forEach(doc => {
            const p = doc.data();
            html += `
                <tr>
                    <td><img src="${p.imageUrl || 'https://placehold.co/50x50'}" class="product-img" onerror="this.src='https://placehold.co/50x50'"></td>
                    <td><strong>${escapeHtml(p.name)}</strong></td>
                    <td>$${p.price}</td>
                    <td>${p.category}</td>
                    <td>${p.subcategory ? p.subcategory : '-'}</td>
                    <td>${p.sale ? '<span class="badge bg-danger">Sale</span>' : '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editProduct('${doc.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger ms-1" onclick="deleteProduct('${doc.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `</tbody>${'</table>'}`;
        container.innerHTML = html;
        
    } catch (error) {
        console.error("Error loading products:", error);
        container.innerHTML = '<div class="text-center py-5 text-danger">Error loading products</div>';
    }
}

/**
 * Adds a new product to Firestore
 */
document.getElementById("addProductForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Parse sizes from comma-separated string
    const sizes = document.getElementById("prodSizes").value
        .split(",")
        .map(s => s.trim())
        .filter(s => s);
    
    // Create product object
    const product = {
        name: document.getElementById("prodName").value,
        price: parseFloat(document.getElementById("prodPrice").value),
        oldPrice: document.getElementById("prodOldPrice").value ? parseFloat(document.getElementById("prodOldPrice").value) : null,
        category: document.getElementById("prodCategory").value,
        subcategory: document.getElementById("prodCategory").value === "accessories" ? document.getElementById("prodSubcategory").value : null,
        imageUrl: document.getElementById("prodImageUrl").value,
        sizes: sizes.length ? sizes : ["S", "M", "L", "XL"],
        description: document.getElementById("prodDescription").value,
        sale: document.getElementById("prodSale").checked,
        inStock: true,
        createdAt: new Date()
    };
    
    try {
        await db.collection("products").add(product);
        showToast("Product added successfully!", "success");
        
        // Reset form
        document.getElementById("addProductForm").reset();
        document.getElementById("subcategoryContainer").style.display = "none";
        
        // Refresh products list and switch to products tab
        loadProducts();
        document.querySelector('[data-tab="products"]').click();
        
    } catch (error) {
        console.error("Error adding product:", error);
        showToast("Error adding product", "error");
    }
});

/**
 * Opens edit modal with product data
 * @param {string} productId - The Firestore document ID of the product to edit
 */
window.editProduct = async (productId) => {
    try {
        const doc = await db.collection("products").doc(productId).get();
        const p = doc.data();
        
        // Populate edit form fields
        document.getElementById("editProductId").value = productId;
        document.getElementById("editName").value = p.name || "";
        document.getElementById("editPrice").value = p.price || "";
        document.getElementById("editOldPrice").value = p.oldPrice || "";
        document.getElementById("editCategory").value = p.category || "tops";
        document.getElementById("editSubcategory").value = p.subcategory || "";
        document.getElementById("editImageUrl").value = p.imageUrl || "";
        document.getElementById("editSizes").value = p.sizes ? p.sizes.join(", ") : "";
        document.getElementById("editDescription").value = p.description || "";
        document.getElementById("editSale").checked = p.sale || false;
        
        // Show/hide subcategory field based on category
        const subcatContainer = document.getElementById("editSubcategoryContainer");
        if (p.category === "accessories") {
            subcatContainer.style.display = "block";
        } else {
            subcatContainer.style.display = "none";
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById("editModal"));
        modal.show();
        
    } catch (error) {
        console.error("Error loading product for edit:", error);
        showToast("Error loading product", "error");
    }
};

/**
 * Saves edited product changes to Firestore
 */
document.getElementById("saveEditBtn")?.addEventListener("click", async () => {
    const productId = document.getElementById("editProductId").value;
    
    // Parse sizes from comma-separated string
    const sizes = document.getElementById("editSizes").value
        .split(",")
        .map(s => s.trim())
        .filter(s => s);
    
    // Create updated product object
    const updatedProduct = {
        name: document.getElementById("editName").value,
        price: parseFloat(document.getElementById("editPrice").value),
        oldPrice: document.getElementById("editOldPrice").value ? parseFloat(document.getElementById("editOldPrice").value) : null,
        category: document.getElementById("editCategory").value,
        subcategory: document.getElementById("editCategory").value === "accessories" ? document.getElementById("editSubcategory").value : null,
        imageUrl: document.getElementById("editImageUrl").value,
        sizes: sizes.length ? sizes : ["S", "M", "L", "XL"],
        description: document.getElementById("editDescription").value,
        sale: document.getElementById("editSale").checked,
        updatedAt: new Date()
    };
    
    try {
        await db.collection("products").doc(productId).update(updatedProduct);
        showToast("Product updated successfully!", "success");
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        modal.hide();
        
        // Refresh products list
        loadProducts();
        
    } catch (error) {
        console.error("Error updating product:", error);
        showToast("Error updating product", "error");
    }
});

/**
 * Deletes a product from Firestore after confirmation
 * @param {string} productId - The Firestore document ID of the product to delete
 */
window.deleteProduct = async (productId) => {
    if (confirm("Are you sure you want to delete this product? This cannot be undone.")) {
        try {
            await db.collection("products").doc(productId).delete();
            showToast("Product deleted successfully!", "success");
            loadProducts(); // Refresh product list
        } catch (error) {
            console.error("Error deleting product:", error);
            showToast("Error deleting product", "error");
        }
    }
};

// Refresh button handler
document.getElementById("refreshProductsBtn")?.addEventListener("click", () => {
    loadProducts();
    showToast("Refreshed!", "success");
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - Escaped string safe for HTML
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Displays a temporary toast notification
 * @param {string} message - The message to display
 * @param {string} type - 'success' or 'error'
 */
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    const bgColor = type === "success" ? "#28a745" : "#dc3545";
    toast.innerHTML = `
        <div style="position:fixed;bottom:20px;right:20px;background:${bgColor};color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:slideIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.15);">
            ${escapeHtml(message)}
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Add slide-in animation CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
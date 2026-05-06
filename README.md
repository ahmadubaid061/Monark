````markdown
# 🛍️ MONARK - Premium Fashion E-commerce

A fully functional e-commerce website with product management, shopping cart, checkout system, and admin dashboard.

**Live Demo:** https://monark-ecommerce.web.app

---

## ✨ Features

### 👤 Customer

- Browse products by category (TOPS, BOTTOMS, FORMAL WEAR, EASY WEAR, ACCESSORIES)
- Search products in real-time
- View product details with size/quantity selection
- Shopping cart with localStorage persistence
- Checkout with order confirmation
- Contact form for inquiries

### 👨‍💼 Admin

- Secure login with Firebase Authentication
- Add, edit, and delete products
- Manage product images, prices, sizes, categories
- View all customer orders
- View contact form messages

---

## 🛠️ Tech Stack

| Technology              | Purpose      |
| ----------------------- | ------------ |
| HTML5, CSS3, JavaScript | Frontend     |
| Bootstrap 5             | UI Framework |
| Firebase Firestore      | Database     |
| Firebase Auth           | Admin Login  |
| Firebase Hosting        | Deployment   |
| Font Awesome            | Icons        |

---

## 📁 Project Structure

### 🌐 Pages

- `index.html` — Home page
- `product-details.html` — Product details view
- `cart.html` — Shopping cart
- `checkout.html` — Checkout process
- `order-confirmation.html` — Order success page
- `dashboard.html` — User dashboard
- `contact.html` — Contact page

---

### 🎨 Stylesheets

- `css/style.css` — Main stylesheet

---

### ⚙️ JavaScript Files

#### 🔹 Global

- `js/global.js` — Shared functionality across pages

#### 🔹 Page-Specific Scripts

- `js/script.js` — Home page logic
- `js/product-details.js` — Product details interactions
- `js/cart.js` — Cart functionality
- `js/checkout.js` — Checkout logic
- `js/order-confirmation.js` — Order confirmation handling
- `js/dashboard.js` — Dashboard features
- `js/contact.js` — Contact form handling

---

## 🚀 Quick Start

### Prerequisites

- Node.js
- Firebase CLI

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/monark-ecommerce.git
cd monark-ecommerce

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```
````

---

## 🔥 Firebase Setup

1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** (start in test mode)
3. Enable **Authentication** (Email/Password)
4. Add admin user in Authentication → Users
5. Update `firebaseConfig` in all `.js` files

### Security Rules

```javascript
// Deploy rules
firebase deploy --only firestore:rules
```

---

## 📊 Database Collections

| Collection | Purpose               |
| ---------- | --------------------- |
| `products` | All store products    |
| `orders`   | Customer orders       |
| `contacts` | Contact form messages |

---

## 🔐 Environment Variables

Update this config in all JS files:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

---

## 📱 Responsive Design

| Device  | Columns            |
| ------- | ------------------ |
| Mobile  | 2 products per row |
| Tablet  | 3 products per row |
| Desktop | 4 products per row |

---

## 🚢 Deployment

```bash
# Deploy everything
firebase deploy

# Deploy only hosting (fastest for CSS/JS changes)
firebase deploy --only hosting

# Deploy only rules
firebase deploy --only firestore:rules
```

---

## 🧪 Testing

### Customer Flow

1. Browse products on homepage
2. Click product → view details
3. Select size → Add to cart
4. View cart → Update quantities
5. Checkout → Fill form → Place order

### Admin Flow

1. Go to `/dashboard.html`
2. Login with admin credentials
3. Add/Edit/Delete products

---

## 📞 Contact

**Email**: ahmadubaidedu@mail.com

---

**Built with ❤️ using HTML, CSS, JavaScript & Firebase**

```

---

# MONARK Admin Dashboard

Secure admin panel to manage products, view orders, and handle customer messages.

**Access:** https://monark-ecommerce.web.app/dashboard.html

---

## Login

Use credentials created in Firebase Console → Authentication → Users

---

## Features

| Feature | Description |
|---------|-------------|
| ➕ Add Product | Create new products with name, price, image, sizes |
| ✏️ Edit Product | Modify existing product details |
| 🗑️ Delete Product | Remove products from inventory |
| 📦 Orders | View all customer orders (Firestore) |
| 💬 Messages | View contact form submissions (Firestore) |

---

## Product Fields

| Field | Required | Example |
|-------|----------|---------|
| Name | ✅ | "Oversized Blazer" |
| Price | ✅ | 129 |
| Old Price | ❌ | 159 |
| Category | ✅ | tops, bottoms, accessories |
| Subcategory | (for accessories) | bags, socks, glasses |
| Image URL | ✅ | https://... |
| Sizes | ❌ | S, M, L, XL |
| Description | ❌ | Product details |

---

## View Orders & Messages

Go to Firebase Console → Firestore Database → `orders` or `contacts` collection
```

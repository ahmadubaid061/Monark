document.addEventListener("DOMContentLoaded", () => {
  displayOrderConfirmation();
});

function displayOrderConfirmation() {
  const lastOrder = localStorage.getItem("lastOrder");
  const container = document.getElementById("orderDetails");

  if (!lastOrder) {
    container.innerHTML = `
            <div class="text-center py-3">
                <p>No order information found.</p>
                <a href="index.html" class="btn btn-dark">Go to Homepage</a>
            </div>
        `;
    return;
  }

  const order = JSON.parse(lastOrder);

  let itemsHtml = "";
  order.items.forEach((item) => {
    itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.size || "M"}</td>
                <td>${item.quantity}</td>
                <td>Rs ${item.price}</td>
                <td>Rs ${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
  });

  container.innerHTML = `
        <h6 class="mb-3">Order #${order.orderNumber}</h6>
        <div class="row mb-4">
            <div class="col-md-6">
                <p class="mb-1"><strong>Customer Information</strong></p>
                <p class="small mb-0">${order.customer.fullName}</p>
                <p class="small mb-0">${order.customer.email}</p>
                <p class="small mb-0">${order.customer.phone}</p>
                <p class="small">${order.customer.address}, ${order.customer.city}</p>
            </div>
            <div class="col-md-6 text-md-end">
                <p class="mb-1"><strong>Payment Method</strong></p>
                <p class="small">${order.paymentMethod}</p>
                <p class="mb-1"><strong>Order Date</strong></p>
                <p class="small">${new Date(order.createdAt).toLocaleString()}</p>
            </div>
        </div>
        
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
                    <td><strong>Rs ${order.subtotal.toFixed(2)}</strong></td>
                </tr>
                <tr>
                    <td colspan="4" class="text-end"><strong>Shipping:</strong></td>
                    <td><strong>Free</strong></td>
                </tr>
                <tr>
                    <td colspan="4" class="text-end"><strong>Total:</strong></td>
                    <td><strong>Rs ${order.total.toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>
        
        <div class="alert alert-success mt-3">
            <i class="fas fa-envelope me-2"></i>
            A confirmation email has been sent to ${order.customer.email}
        </div>
    `;

  localStorage.removeItem("lastOrder");
}

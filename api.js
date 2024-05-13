// Lưu trữ danh sách sản phẩm đã chọn
var cartItems = [];

// Lấy ra tất cả nút mua hàng và gán sự kiện khi click
var buyButtons = document.querySelectorAll(".btn-buy");
buyButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    var product = this.parentElement;
    var productName = product.querySelector("h2").innerText;
    var productPrice = parseFloat(
      product.querySelector("p").innerText.replace("$", "")
    );
    addToCart(productName, productPrice);
  });
});

// Thêm sản phẩm vào giỏ hàng
function addToCart(name, price) {
  cartItems.push({ name: name, price: price });
  renderCart();
}

// Hiển thị giỏ hàng và tổng số tiền phải thanh toán
function renderCart() {
  var cartTable = document.getElementById("cart-table");
  var cartTotal = document.getElementById("total");
  var cartBody = cartTable.getElementsByTagName("tbody")[0];

  // Xóa hết các hàng trong bảng trước khi render lại
  cartBody.innerHTML = "";

  // Thêm từng sản phẩm vào bảng
  var totalPrice = 0;
  cartItems.forEach(function (item, index) {
    var row = cartBody.insertRow();
    var cellName = row.insertCell(0);
    var cellPrice = row.insertCell(1);
    var cellRemove = row.insertCell(2);

    cellName.textContent = item.name;
    cellPrice.textContent = "$" + item.price.toFixed(2);
    totalPrice += item.price;

    // Tạo nút remove sản phẩm
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("btn-remove");
    removeButton.setAttribute("data-index", index); // Lưu trữ chỉ số của sản phẩm trong mảng
    removeButton.addEventListener("click", function () {
      removeFromCart(parseInt(this.getAttribute("data-index")));
    });
    cellRemove.appendChild(removeButton);
  });

  // Hiển thị tổng số tiền phải thanh toán
  cartTotal.textContent = "$" + totalPrice.toFixed(2);
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
  cartItems.splice(index, 1);
  renderCart();
}

// Sự kiện khi nhấn nút thanh toán
var checkoutButton = document.getElementById("checkout-btn");
checkoutButton.addEventListener("click", function () {
  var totalAmount = parseFloat(
    document.getElementById("total").innerText.replace("$", "")
  );
  // Gọi hàm để gửi yêu cầu thanh toán
  sendPaymentRequest(totalAmount, "Mô tả đơn hàng", "Tên khách hàng");
});

// Hàm gửi yêu cầu thanh toán
function sendPaymentRequest(amount, description, customerName) {
  var apiUrl = "https://sandbox.nganluong.vn/checkout-api/checkout";

  var data = {
    merchant_id: "YOUR_MERCHANT_ID",
    merchant_password: "YOUR_MERCHANT_PASSWORD",
    receiver_email: "YOUR_RECEIVER_EMAIL",
    currency: "VND",
    order_code: "ORDER_CODE", // Mã đơn hàng duy nhất
    amount: amount,
    order_description: description,
    buyer_fullname: customerName,
    // Thêm các thông tin khác nếu cần thiết
  };

  // Tạo request
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      // Xử lý phản hồi từ server
      console.log(responseData);
      alert("Payment successful!"); // Hiển thị thông báo thanh toán thành công
      // Sau khi thanh toán thành công, bạn có thể thực hiện các thao tác khác ở đây
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
      alert("Payment failed!"); // Hiển thị thông báo thanh toán thất bại
    });
}

const loginForm = document.querySelector(".login_card");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // 1. Tìm tài khoản trong localStorage theo Email
  const storedUserRaw = localStorage.getItem(email);

  if (!storedUserRaw) {
    alert("❌ Tài khoản không tồn tại!");
    return;
  }

  const storedUser = JSON.parse(storedUserRaw);

  // 2. Kiểm tra Mật khẩu
  if (storedUser.password === password) {
    // Lưu phiên đăng nhập hiện tại
    localStorage.setItem("currentUser", storedUser.fullname);
    alert("🎉 Đăng nhập thành công!");

    // Chuyển hướng sang Trang chủ
    window.location.href = "dashboard.html";
  } else {
    alert("❌ Mật khẩu không chính xác!");
  }
});

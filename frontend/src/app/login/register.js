const registerForm = document.querySelector(".login_card");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;

  // 1. Kiểm tra mật khẩu xác nhận
  if (password !== confirmPassword) {
    alert("❌ Mật khẩu xác nhận không trùng khớp!");
    return;
  }

  // 2. Lưu thông tin tài khoản vào localStorage
  const user = {
    fullname: fullname,
    email: email,
    password: password,
  };

  localStorage.setItem(email, JSON.stringify(user));
  alert("🎉 Đăng ký thành công! Chuyển sang trang Đăng nhập.");

  // 3. Đăng ký xong tự động qua trang Đăng nhập
  window.location.href = "index.html";
});

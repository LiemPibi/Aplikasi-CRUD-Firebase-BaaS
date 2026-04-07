// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyYourApiKeyHere",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

function isFirebaseConfigValid(config) {
  if (!config || typeof config !== "object") return false;
  if (!config.apiKey || config.apiKey.includes("YourApiKeyHere")) return false;
  if (!config.authDomain || config.authDomain.includes("your-project")) return false;
  if (!config.databaseURL || config.databaseURL.includes("your-project")) return false;
  return true;
}

function showFirebaseConfigError() {
  document.body.innerHTML = `
    <div style="max-width:720px;margin:40px auto;padding:24px;background:#fff;border-radius:12px;font-family:Arial,sans-serif;line-height:1.6;">
      <h2 style="margin-top:0;color:#dc3545;">Firebase belum dikonfigurasi</h2>
      <p>Error: <code>auth/api-key-not-valid</code>.</p>
      <p>Silakan buka <strong>firebase-product-manager/app.js</strong> lalu ganti <code>firebaseConfig</code> dengan config asli dari Firebase Console.</p>
      <ol>
        <li>Firebase Console → Project settings → Your apps → Web app config</li>
        <li>Copy <code>apiKey</code>, <code>authDomain</code>, dan <code>databaseURL</code></li>
        <li>Tambahkan domain deploy Anda ke Authentication → Settings → Authorized domains</li>
      </ol>
    </div>
  `;
}

let auth = null;
let database = null;

if (isFirebaseConfigValid(firebaseConfig)) {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  database = firebase.database();
} else {
  showFirebaseConfigError();
}

// ============================================
// AUTHENTICATION
// ============================================
function switchTab(tab) {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((t) => t.classList.remove("active"));

  if (tab === "login") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    tabs[0].classList.add("active");
  } else {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    tabs[1].classList.add("active");
  }
}

function register() {
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageEl = document.getElementById("registerMessage");

  if (!email || !password || !confirmPassword) {
    showMessage(messageEl, "Semua field harus diisi!", "error");
    return;
  }
  if (password.length < 6) {
    showMessage(messageEl, "Password minimal 6 karakter!", "error");
    return;
  }
  if (password !== confirmPassword) {
    showMessage(messageEl, "Password tidak cocok!", "error");
    return;
  }

  auth
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => user.sendEmailVerification())
    .then(() => {
      showMessage(document.getElementById("registerMessage"), "Registrasi berhasil! Cek email verifikasi.", "success");
      showToast("Registrasi sukses. Silakan verifikasi email.", "success");
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
      document.getElementById("confirmPassword").value = "";
    })
    .catch((error) => {
      showMessage(messageEl, "Registrasi gagal: " + error.message, "error");
    });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const messageEl = document.getElementById("loginMessage");

  if (!email || !password) {
    showMessage(messageEl, "Email dan password wajib diisi!", "error");
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      if (!user.emailVerified) {
        showMessage(messageEl, "Email belum terverifikasi.", "error");
        showToast("Verifikasi email dulu sebelum masuk.", "error");
        return;
      }
      showMessage(messageEl, "Login berhasil.", "success");
      showToast("Selamat datang, " + user.email, "success");
    })
    .catch((error) => showMessage(messageEl, "Login gagal: " + error.message, "error"));
}

function logout() {
  auth.signOut().then(() => showToast("Logout berhasil.", "success"));
}

function resendVerification() {
  const user = auth.currentUser;
  if (user && !user.emailVerified) {
    user
      .sendEmailVerification()
      .then(() => showToast("Email verifikasi dikirim ulang.", "success"))
      .catch((e) => showToast("Gagal kirim ulang: " + e.message, "error"));
  }
}

if (auth) {
auth.onAuthStateChanged((user) => {
  const authSection = document.getElementById("authSection");
  const appSection = document.getElementById("appSection");
  const navUser = document.getElementById("navUser");
  const userEmail = document.getElementById("userEmail");
  const verificationAlert = document.getElementById("verificationAlert");

  if (user && user.emailVerified) {
    authSection.style.display = "none";
    appSection.style.display = "block";
    navUser.style.display = "flex";
    userEmail.textContent = user.email;
    verificationAlert.style.display = "none";
    loadAllData();
  } else if (user && !user.emailVerified) {
    authSection.style.display = "none";
    appSection.style.display = "block";
    navUser.style.display = "flex";
    userEmail.textContent = user.email;
    verificationAlert.style.display = "flex";
  } else {
    authSection.style.display = "block";
    appSection.style.display = "none";
    navUser.style.display = "none";
  }
});
}

function currentUserGuard() {
  if (!auth || !database) {
    showToast("Firebase belum terkonfigurasi. Isi firebaseConfig terlebih dahulu.", "error");
    return null;
  }
  const user = auth.currentUser;
  if (!user || !user.emailVerified) {
    showToast("Anda harus login dan verifikasi email!", "error");
    return null;
  }
  return user;
}

function loadAllData() {
  readProducts();
  readCategories();
  readSuppliers();
}

// ============================================
// 12 CRUD FUNCTIONS REQUIRED
// 3x CREATE, 3x READ, 3x UPDATE, 3x DELETE
// ============================================

// ---------- PRODUCTS ----------
function createProduct(data) {
  const user = currentUserGuard();
  if (!user) return;
  database.ref("products").push({ ...data, userId: user.uid, createdAt: firebase.database.ServerValue.TIMESTAMP, updatedAt: firebase.database.ServerValue.TIMESTAMP })
    .then(() => {
      showToast("Produk ditambahkan.", "success");
      resetProductForm();
    })
    .catch((e) => showToast("Create produk gagal: " + e.message, "error"));
}

function readProducts() {
  const user = currentUserGuard();
  if (!user) return;
  const tbody = document.getElementById("productTableBody");
  database.ref("products").orderByChild("userId").equalTo(user.uid).on("value", (snapshot) => {
    tbody.innerHTML = "";
    let idx = 1;
    snapshot.forEach((item) => {
      const p = item.val();
      tbody.innerHTML += `<tr><td>${idx++}</td><td>${escapeHtml(p.name)}</td><td>Rp ${formatNumber(p.price)}</td><td>${p.stock}</td><td><button class="btn-edit" onclick="editProduct('${item.key}')">Edit</button><button class="btn-delete" onclick="deleteProduct('${item.key}')">Hapus</button></td></tr>`;
    });
  });
}

function updateProduct(id, data) {
  const user = currentUserGuard();
  if (!user) return;
  database.ref("products/" + id).once("value").then((snap) => {
    const old = snap.val();
    if (!old || old.userId !== user.uid) throw new Error("Tidak punya akses.");
    return database.ref("products/" + id).update({ ...data, updatedAt: firebase.database.ServerValue.TIMESTAMP });
  }).then(() => {
    showToast("Produk diupdate.", "success");
    resetProductForm();
  }).catch((e) => showToast("Update produk gagal: " + e.message, "error"));
}

function deleteProduct(id) {
  const user = currentUserGuard();
  if (!user) return;
  if (!confirm("Hapus produk ini?")) return;
  database.ref("products/" + id).once("value").then((snap) => {
    const old = snap.val();
    if (!old || old.userId !== user.uid) throw new Error("Tidak punya akses.");
    return database.ref("products/" + id).remove();
  }).then(() => showToast("Produk dihapus.", "success"))
    .catch((e) => showToast("Delete produk gagal: " + e.message, "error"));
}

// ---------- CATEGORIES ----------
function createCategory(data) {
  const user = currentUserGuard();
  if (!user) return;
  database.ref("categories").push({ ...data, userId: user.uid, createdAt: firebase.database.ServerValue.TIMESTAMP, updatedAt: firebase.database.ServerValue.TIMESTAMP })
    .then(() => {
      showToast("Kategori ditambahkan.", "success");
      resetCategoryForm();
    })
    .catch((e) => showToast("Create kategori gagal: " + e.message, "error"));
}

function readCategories() {
  const user = currentUserGuard();
  if (!user) return;
  const tbody = document.getElementById("categoryTableBody");
  database.ref("categories").orderByChild("userId").equalTo(user.uid).on("value", (snapshot) => {
    tbody.innerHTML = "";
    let idx = 1;
    snapshot.forEach((item) => {
      const c = item.val();
      tbody.innerHTML += `<tr><td>${idx++}</td><td>${escapeHtml(c.name)}</td><td>${escapeHtml(c.type)}</td><td><button class="btn-edit" onclick="editCategory('${item.key}')">Edit</button><button class="btn-delete" onclick="deleteCategory('${item.key}')">Hapus</button></td></tr>`;
    });
  });
}

function updateCategory(id, data) {
  const user = currentUserGuard();
  if (!user) return;
  database.ref("categories/" + id).once("value").then((snap) => {
    const old = snap.val();
    if (!old || old.userId !== user.uid) throw new Error("Tidak punya akses.");
    return database.ref("categories/" + id).update({ ...data, updatedAt: firebase.database.ServerValue.TIMESTAMP });
  }).then(() => {
    showToast("Kategori diupdate.", "success");
    resetCategoryForm();
  }).catch((e) => showToast("Update kategori gagal: " + e.message, "error"));
}

function deleteCategory(id) {
  const user = currentUserGuard();
  if (!user) return;
  if (!confirm("Hapus kategori ini?")) return;
  database.ref("categories/" + id).once("value").then((snap) => {
    const old = snap.val();
    if (!old || old.userId !== user.uid) throw new Error("Tidak punya akses.");
    return database.ref("categories/" + id).remove();
  }).then(() => showToast("Kategori dihapus.", "success"))
    .catch((e) => showToast("Delete kategori gagal: " + e.message, "error"));
}

// ---------- SUPPLIERS ----------
function createSupplier(data) {
  const user = currentUserGuard();
  if (!user) return;
  database.ref("suppliers").push({ ...data, userId: user.uid, createdAt: firebase.database.ServerValue.TIMESTAMP, updatedAt: firebase.database.ServerValue.TIMESTAMP })
    .then(() => {
      showToast("Supplier ditambahkan.", "success");
      resetSupplierForm();
    })
    .catch((e) => showToast("Create supplier gagal: " + e.message, "error"));
}

function readSuppliers() {
  const user = currentUserGuard();
  if (!user) return;
  const tbody = document.getElementById("supplierTableBody");
  database.ref("suppliers").orderByChild("userId").equalTo(user.uid).on("value", (snapshot) => {
    tbody.innerHTML = "";
    let idx = 1;
    snapshot.forEach((item) => {
      const s = item.val();
      tbody.innerHTML += `<tr><td>${idx++}</td><td>${escapeHtml(s.name)}</td><td>${escapeHtml(s.phone)}</td><td>${escapeHtml(s.city)}</td><td><button class="btn-edit" onclick="editSupplier('${item.key}')">Edit</button><button class="btn-delete" onclick="deleteSupplier('${item.key}')">Hapus</button></td></tr>`;
    });
  });
}

function updateSupplier(id, data) {
  const user = currentUserGuard();
  if (!user) return;
  database.ref("suppliers/" + id).once("value").then((snap) => {
    const old = snap.val();
    if (!old || old.userId !== user.uid) throw new Error("Tidak punya akses.");
    return database.ref("suppliers/" + id).update({ ...data, updatedAt: firebase.database.ServerValue.TIMESTAMP });
  }).then(() => {
    showToast("Supplier diupdate.", "success");
    resetSupplierForm();
  }).catch((e) => showToast("Update supplier gagal: " + e.message, "error"));
}

function deleteSupplier(id) {
  const user = currentUserGuard();
  if (!user) return;
  if (!confirm("Hapus supplier ini?")) return;
  database.ref("suppliers/" + id).once("value").then((snap) => {
    const old = snap.val();
    if (!old || old.userId !== user.uid) throw new Error("Tidak punya akses.");
    return database.ref("suppliers/" + id).remove();
  }).then(() => showToast("Supplier dihapus.", "success"))
    .catch((e) => showToast("Delete supplier gagal: " + e.message, "error"));
}

// ============================================
// FORM HANDLERS + EDIT HELPERS
// ============================================
function handleProductSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const payload = {
    name: document.getElementById("productName").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value)
  };
  id ? updateProduct(id, payload) : createProduct(payload);
}

function handleCategorySubmit(e) {
  e.preventDefault();
  const id = document.getElementById("categoryId").value;
  const payload = {
    name: document.getElementById("categoryName").value.trim(),
    type: document.getElementById("categoryType").value
  };
  id ? updateCategory(id, payload) : createCategory(payload);
}

function handleSupplierSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("supplierId").value;
  const payload = {
    name: document.getElementById("supplierName").value.trim(),
    phone: document.getElementById("supplierPhone").value.trim(),
    city: document.getElementById("supplierCity").value.trim()
  };
  id ? updateSupplier(id, payload) : createSupplier(payload);
}

function editProduct(id) {
  database.ref("products/" + id).once("value").then((snap) => {
    const p = snap.val();
    document.getElementById("productId").value = id;
    document.getElementById("productName").value = p.name;
    document.getElementById("productPrice").value = p.price;
    document.getElementById("productStock").value = p.stock;
    document.getElementById("productFormTitle").textContent = "Update Produk";
    document.getElementById("productSaveBtn").textContent = "Update Produk";
  });
}

function editCategory(id) {
  database.ref("categories/" + id).once("value").then((snap) => {
    const c = snap.val();
    document.getElementById("categoryId").value = id;
    document.getElementById("categoryName").value = c.name;
    document.getElementById("categoryType").value = c.type;
    document.getElementById("categoryFormTitle").textContent = "Update Kategori";
    document.getElementById("categorySaveBtn").textContent = "Update Kategori";
  });
}

function editSupplier(id) {
  database.ref("suppliers/" + id).once("value").then((snap) => {
    const s = snap.val();
    document.getElementById("supplierId").value = id;
    document.getElementById("supplierName").value = s.name;
    document.getElementById("supplierPhone").value = s.phone;
    document.getElementById("supplierCity").value = s.city;
    document.getElementById("supplierFormTitle").textContent = "Update Supplier";
    document.getElementById("supplierSaveBtn").textContent = "Update Supplier";
  });
}

function resetProductForm() {
  document.getElementById("productForm").reset();
  document.getElementById("productId").value = "";
  document.getElementById("productFormTitle").textContent = "Create/Update Produk";
  document.getElementById("productSaveBtn").textContent = "Simpan Produk";
}

function resetCategoryForm() {
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryId").value = "";
  document.getElementById("categoryFormTitle").textContent = "Create/Update Kategori";
  document.getElementById("categorySaveBtn").textContent = "Simpan Kategori";
}

function resetSupplierForm() {
  document.getElementById("supplierForm").reset();
  document.getElementById("supplierId").value = "";
  document.getElementById("supplierFormTitle").textContent = "Create/Update Supplier";
  document.getElementById("supplierSaveBtn").textContent = "Simpan Supplier";
}

// ============================================
// UTILITIES
// ============================================
function showMessage(element, message, type) {
  element.textContent = message;
  element.className = "message " + type;
  setTimeout(() => {
    element.textContent = "";
    element.className = "message";
  }, 5000);
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast " + type + " show";
  setTimeout(() => toast.classList.remove("show"), 3000);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("id-ID");
}

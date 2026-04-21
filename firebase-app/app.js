// ============================================
// FIREBASE CONFIGURATION
// ============================================
// Ganti dengan konfigurasi Firebase Anda sendiri
const firebaseConfig = {
  apiKey: "AIzaSyAbU-x2hS4Wc8AvpDG9yhy2RR8gfSJc5o0",
  authDomain: "product-manager-bdc83.firebaseapp.com",
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "product-manager-bdc83",
  storageBucket: "product-manager-bdc83.firebasestorage.app",
  messagingSenderId: "519624740177",
  appId: "1:519624740177:web:ed90d4b073b8d7dd7b5770",
  measurementId: "G-ETY4DNERT0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get references
const auth = firebase.auth();
const database = firebase.database();

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// Switch between login and register tabs
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// Register function with email verification
function register() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageEl = document.getElementById('registerMessage');
    
    // Validation
    if (!email || !password || !confirmPassword) {
        showMessage(messageEl, 'Semua field harus diisi!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage(messageEl, 'Password minimal 6 karakter!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage(messageEl, 'Password tidak cocok!', 'error');
        return;
    }
    
    // Create user
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Send email verification
            user.sendEmailVerification()
                .then(() => {
                    showMessage(messageEl, 'Registrasi berhasil! Link verifikasi telah dikirim ke email Anda.', 'success');
                    
                    // Clear form
                    document.getElementById('registerEmail').value = '';
                    document.getElementById('registerPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                    
                    showToast('Registrasi berhasil! Silakan verifikasi email Anda.', 'success');
                })
                .catch((error) => {
                    showMessage(messageEl, 'Registrasi berhasil, tetapi gagal mengirim verifikasi email: ' + error.message, 'error');
                });
        })
        .catch((error) => {
            let errorMessage = 'Registrasi gagal: ';
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += 'Email sudah terdaftar!';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Format email tidak valid!';
                    break;
                case 'auth/weak-password':
                    errorMessage += 'Password terlalu lemah!';
                    break;
                default:
                    errorMessage += error.message;
            }
            showMessage(messageEl, errorMessage, 'error');
        });
}

// Login function
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');
    
    if (!email || !password) {
        showMessage(messageEl, 'Email dan password harus diisi!', 'error');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Check if email is verified
            if (!user.emailVerified) {
                showMessage(messageEl, 'Email belum terverifikasi. Silakan cek inbox email Anda.', 'error');
                showToast('Email belum terverifikasi!', 'error');
                return;
            }
            
            showMessage(messageEl, 'Login berhasil!', 'success');
            showToast('Selamat datang, ' + user.email + '!', 'success');
        })
        .catch((error) => {
            let errorMessage = 'Login gagal: ';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage += 'Email tidak terdaftar!';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Password salah!';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Format email tidak valid!';
                    break;
                case 'auth/invalid-credential':
                    errorMessage += 'Email atau password salah!';
                    break;
                default:
                    errorMessage += error.message;
            }
            showMessage(messageEl, errorMessage, 'error');
        });
}

// Logout function
function logout() {
    auth.signOut()
        .then(() => {
            showToast('Logout berhasil!', 'success');
        })
        .catch((error) => {
            showToast('Logout gagal: ' + error.message, 'error');
        });
}

// Resend verification email
function resendVerification() {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
        user.sendEmailVerification()
            .then(() => {
                showToast('Link verifikasi telah dikirim ulang!', 'success');
            })
            .catch((error) => {
                showToast('Gagal mengirim ulang: ' + error.message, 'error');
            });
    }
}

// ============================================
// AUTH STATE LISTENER
// ============================================

auth.onAuthStateChanged((user) => {
    const authSection = document.getElementById('authSection');
    const appSection = document.getElementById('appSection');
    const navUser = document.getElementById('navUser');
    const userEmail = document.getElementById('userEmail');
    const verificationAlert = document.getElementById('verificationAlert');
    
    if (user && user.emailVerified) {
        // User is logged in and verified
        authSection.style.display = 'none';
        appSection.style.display = 'block';
        navUser.style.display = 'flex';
        userEmail.textContent = user.email;
        verificationAlert.style.display = 'none';
        
        // Load products
        loadProducts();
    } else if (user && !user.emailVerified) {
        // User is logged in but not verified
        authSection.style.display = 'none';
        appSection.style.display = 'block';
        navUser.style.display = 'flex';
        userEmail.textContent = user.email;
        verificationAlert.style.display = 'flex';
        
        // Disable form inputs
        disableFormInputs();
    } else {
        // User is logged out
        authSection.style.display = 'block';
        appSection.style.display = 'none';
        navUser.style.display = 'none';
        
        // Clear forms
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    }
});

function disableFormInputs() {
    const inputs = document.querySelectorAll('#productForm input, #productForm select, #productForm textarea, #productForm button');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function enableFormInputs() {
    const inputs = document.querySelectorAll('#productForm input, #productForm select, #productForm textarea, #productForm button');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// ============================================
// CRUD FUNCTIONS FOR PRODUCTS
// ============================================

// Save product (Create/Update)
function saveProduct(event) {
    event.preventDefault();
    
    const user = auth.currentUser;
    if (!user || !user.emailVerified) {
        showToast('Anda harus login dan verifikasi email untuk menyimpan data!', 'error');
        return;
    }
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value.trim(),
        userId: user.uid,
        updatedAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    if (productId) {
        // Update existing product
        database.ref('products/' + productId).update(productData)
            .then(() => {
                showToast('Produk berhasil diperbarui!', 'success');
                resetForm();
                loadProducts();
            })
            .catch((error) => {
                showToast('Gagal memperbarui produk: ' + error.message, 'error');
            });
    } else {
        // Create new product
        productData.createdAt = firebase.database.ServerValue.TIMESTAMP;
        
        database.ref('products').push(productData)
            .then(() => {
                showToast('Produk berhasil ditambahkan!', 'success');
                resetForm();
                loadProducts();
            })
            .catch((error) => {
                showToast('Gagal menambahkan produk: ' + error.message, 'error');
            });
    }
}

// Load all products (Read)
function loadProducts() {
    const user = auth.currentUser;
    if (!user) return;
    
    const tableBody = document.getElementById('productTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    
    database.ref('products').orderByChild('userId').equalTo(user.uid).on('value', (snapshot) => {
        tableBody.innerHTML = '';
        
        if (!snapshot.exists()) {
            emptyMessage.style.display = 'block';
            return;
        }
        
        emptyMessage.style.display = 'none';
        
        let index = 1;
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            const productId = childSnapshot.key;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index}</td>
                <td>${escapeHtml(product.name)}</td>
                <td><span class="badge badge-${getCategoryClass(product.category)}">${product.category}</span></td>
                <td>Rp ${formatNumber(product.price)}</td>
                <td>${product.stock}</td>
                <td>${escapeHtml(product.description)}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${productId}')">Edit</button>
                    <button class="btn-delete" onclick="deleteProduct('${productId}')">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
            index++;
        });
    }, (error) => {
        showToast('Gagal memuat data: ' + error.message, 'error');
    });
}

// Edit product - Load data to form (Update preparation)
function editProduct(productId) {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) {
        showToast('Anda harus login dan verifikasi email!', 'error');
        return;
    }
    
    database.ref('products/' + productId).once('value')
        .then((snapshot) => {
            const product = snapshot.val();
            
            if (product && product.userId === user.uid) {
                document.getElementById('productId').value = productId;
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productDescription').value = product.description;
                
                document.getElementById('formTitle').textContent = 'Edit Produk';
                document.getElementById('saveBtn').textContent = 'Update';
                
                // Scroll to form
                document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
            } else {
                showToast('Produk tidak ditemukan atau Anda tidak memiliki akses!', 'error');
            }
        })
        .catch((error) => {
            showToast('Gagal memuat data produk: ' + error.message, 'error');
        });
}

// Delete product
function deleteProduct(productId) {
    const user = auth.currentUser;
    if (!user || !user.emailVerified) {
        showToast('Anda harus login dan verifikasi email!', 'error');
        return;
    }
    
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        database.ref('products/' + productId).remove()
            .then(() => {
                showToast('Produk berhasil dihapus!', 'success');
                resetForm();
            })
            .catch((error) => {
                showToast('Gagal menghapus produk: ' + error.message, 'error');
            });
    }
}

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('formTitle').textContent = 'Tambah Produk Baru';
    document.getElementById('saveBtn').textContent = 'Simpan';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show message in element
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'message ' + type;
    
    setTimeout(() => {
        element.textContent = '';
        element.className = 'message';
    }, 5000);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get category badge class
function getCategoryClass(category) {
    const classes = {
        'Elektronik': 'primary',
        'Pakaian': 'success',
        'Makanan': 'warning',
        'Minuman': 'info',
        'Lainnya': 'secondary'
    };
    return classes[category] || 'secondary';
}

// Add CSS for badges dynamically
const badgeStyle = document.createElement('style');
badgeStyle.textContent = `
    .badge {
        padding: 0.3rem 0.7rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    .badge-primary { background: #667eea; color: white; }
    .badge-success { background: #28a745; color: white; }
    .badge-warning { background: #ffc107; color: #333; }
    .badge-info { background: #17a2b8; color: white; }
    .badge-secondary { background: #6c757d; color: white; }
`;
document.head.appendChild(badgeStyle);

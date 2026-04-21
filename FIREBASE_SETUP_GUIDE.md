# Panduan Setup Firebase - Lengkap

## 🚀 Deploy Website

Website sudah di-deploy dan bisa diakses di:
**https://kqbxaodym5owi.ok.kimi.link**

---

## 📋 Langkah-langkah Setup Firebase

### Langkah 1: Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Add project"**
3. Masukkan nama project: `product-manager`
4. Klik **"Continue"**
5. Pilih **"Default Account for Firebase"**
6. Klik **"Create project"**

### Langkah 2: Aktifkan Authentication

1. Di sidebar kiri, klik **"Authentication"**
2. Klik **"Get started"**
3. Pilih tab **"Sign-in method"**
4. Klik **"Email/Password"**
5. Aktifkan toggle **"Enable"**
6. Klik **"Save"**

### Langkah 3: Setup Realtime Database

1. Di sidebar kiri, klik **"Realtime Database"**
2. Klik **"Create Database"**
3. Pilih lokasi: **"asia-southeast1"** (Singapura - terdekat dengan Indonesia)
4. Klik **"Next"**
5. Pilih **"Start in test mode"**
6. Klik **"Enable"**

### Langkah 4: Dapatkan Konfigurasi Firebase

1. Klik ikon **⚙️ (Project settings)** di sidebar
2. Di tab **"General"**, scroll ke bawah ke bagian **"Your apps"**
3. Klik icon **web (</>)**
4. Beri nama app: `Product Manager Web`
5. Klik **"Register app"**
6. Copy konfigurasi yang muncul:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Langkah 5: Update File app.js

1. Extract file `firebase-product-manager.zip`
2. Buka file `app.js`
3. Ganti `firebaseConfig` (baris 6-14) dengan konfigurasi Anda
4. Simpan file


### Langkah 5B: Tambahkan Firebase Admin SDK (Opsional - Backend Server)

Jika Anda punya backend Node.js, tambahkan inisialisasi berikut:

```javascript
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app"
});
```

> Gunakan **hanya di server/backend**, jangan di frontend browser.

### Langkah 6: Setup Security Rules (Penting!)

1. Di Firebase Console, klik **"Realtime Database"**
2. Pilih tab **"Rules"**
3. Ganti rules dengan:

```json
{
  "rules": {
    "products": {
      "$productId": {
        ".read": "auth != null",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || newData.child('userId').val() == auth.uid)"
      }
    },
    "categories": {
      "$categoryId": {
        ".read": "auth != null",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || newData.child('userId').val() == auth.uid)"
      }
    },
    "suppliers": {
      "$supplierId": {
        ".read": "auth != null",
        ".write": "auth != null && (data.child('userId').val() == auth.uid || newData.child('userId').val() == auth.uid)"
      }
    }
  }
}
```

4. Klik **"Publish"**

### Langkah 7: Deploy ke Netlify

Netlify adalah platform hosting gratis yang sangat mudah digunakan untuk static sites.

#### Opsi A: Drag & Drop (Termudah & Cepat)

1. Extract file `firebase-product-manager.zip`
2. Buka [Netlify](https://www.netlify.com/) di browser
3. Login dengan akun GitHub, GitLab, atau Email
4. Di dashboard Netlify, drag & drop folder `firebase-product-manager` ke area yang disediakan
5. Tunggu beberapa detik, website akan otomatis deploy!
6. Copy URL yang diberikan (contoh: `https://abc123.netlify.app`)

#### Opsi B: Connect Git Repository

1. Push code ke GitHub/GitLab
2. Buka [Netlify Dashboard](https://app.netlify.com/)
3. Klik **"Add new site"** > **"Import an existing project"**
4. Pilih Git provider (GitHub/GitLab/Bitbucket)
5. Authorize Netlify untuk mengakses repository
6. Pilih repository `firebase-product-manager`
7. Setting deploy:
   - **Branch to deploy**: `main` atau `master`
   - **Build command**: *(kosongkan - karena ini static site)*
   - **Publish directory**: `.` (root folder)
8. Klik **"Deploy site"**
9. Tunggu proses deploy selesai

#### Opsi C: Netlify CLI (Untuk Developer)

1. Install Netlify CLI global:
```bash
npm install netlify-cli -g
```

2. Login ke Netlify:
```bash
netlify login
```

3. Inisialisasi project (pertama kali):
```bash
netlify init
```

4. Deploy ke production:
```bash
netlify deploy --prod --dir=.
```

5. Atau deploy draft terlebih dahulu:
```bash
netlify deploy --dir=.
# Lalu deploy ke production:
netlify deploy --prod --dir=.
```

---

## 📱 Cara Menggunakan Aplikasi

### 1. Register
1. Buka website
2. Klik tab **"Register"**
3. Masukkan email valid
4. Masukkan password (minimal 6 karakter)
5. Konfirmasi password
6. Klik **"Register"**
7. Cek inbox email untuk link verifikasi
8. Klik link verifikasi di email

### 2. Login
1. Setelah verifikasi email
2. Masukkan email dan password
3. Klik **"Login"**
4. Dashboard akan muncul

### 3. CRUD Produk

#### Tambah Produk (Create)
1. Isi form **"Tambah Produk Baru"**
2. Klik **"Simpan"**
3. Produk akan muncul di tabel

#### Lihat Produk (Read)
- Semua produk ditampilkan di tabel
- Data realtime (auto-update)

#### Edit Produk (Update)
1. Klik tombol **"Edit"** pada produk
2. Form akan terisi dengan data produk
3. Ubah data yang diinginkan
4. Klik **"Update"**

#### Hapus Produk (Delete)
1. Klik tombol **"Hapus"** pada produk
2. Konfirmasi penghapusan
3. Produk akan dihapus

---

## 📊 Struktur Data

### Firebase Realtime Database

```
products/
  ├── -Nxxxxx1/
  │   ├── name: "Laptop ASUS"
  │   ├── category: "Elektronik"
  │   ├── price: 8500000
  │   ├── stock: 10
  │   ├── description: "Laptop gaming high-end"
  │   ├── userId: "user_uid_here"
  │   ├── createdAt: 1234567890
  │   └── updatedAt: 1234567890
  ├── -Nxxxxx2/
  │   └── ...
```

### 5 Field Data Produk
1. **name** - Nama produk (string)
2. **category** - Kategori produk (string)
3. **price** - Harga produk (number)
4. **stock** - Jumlah stok (number)
5. **description** - Deskripsi produk (string)

---

## 🛠️ Fitur yang Diimplementasikan

### ✅ Firebase Authentication
- [x] Register dengan email/password
- [x] Login dengan email/password
- [x] Email verification (webmailer)
- [x] Logout
- [x] Protected routes

### ✅ Firebase Realtime Database
- [x] Create - Tambah produk
- [x] Read - Tampilkan daftar produk
- [x] Update - Edit produk
- [x] Delete - Hapus produk
- [x] Realtime sync

### ✅ UI/UX
- [x] Form HTML untuk CRUD
- [x] CSS styling modern
- [x] Responsive design
- [x] Toast notifications
- [x] Form validation

---

## 🧪 Testing

### Test Register & Email Verification
```
1. Register dengan email valid
2. Cek inbox email
3. Klik link verifikasi
4. Login dengan kredensial
```

### Test CRUD
```
1. Tambah 3-5 produk
2. Edit salah satu produk
3. Hapus salah satu produk
4. Refresh halaman - data tetap ada
```

---

## 📁 File yang Disubmit

```
firebase-product-manager.zip
├── index.html          # Halaman utama
├── style.css           # Styling CSS
├── app.js              # Logika Firebase (Auth + CRUD)
├── netlify.toml        # Konfigurasi Netlify
├── package.json        # Config untuk deploy
└── README.md           # Dokumentasi
```

---

## 🔗 Link Penting

- **Firebase Console**: https://console.firebase.google.com/
- **Netlify**: https://www.netlify.com/
- **Netlify Dashboard**: https://app.netlify.com/
- **Dokumentasi Firebase**: https://firebase.google.com/docs/

---

## 💡 Tips

1. **Email Testing**: Gunakan email Gmail untuk testing
2. **Spam Folder**: Cek folder spam jika email tidak masuk inbox
3. **Browser Console**: Tekan F12 untuk melihat error
4. **Incognito Mode**: Gunakan mode incognito untuk testing multi-user

---

## 🆘 Troubleshooting

### Email tidak terkirim
- Cek folder **Spam/Junk**
- Pastikan email valid
- Tunggu 1-2 menit

### Tidak bisa login
- Pastikan email sudah **terverifikasi**
- Cek password benar
- Cek koneksi internet

### Data tidak muncul
- Cek **Firebase Console** > Realtime Database
- Pastikan user sudah **login**
- Cek **browser console** (F12)

---

**Selamat mencoba! 🎉**

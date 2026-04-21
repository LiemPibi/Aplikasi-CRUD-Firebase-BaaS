# Firebase Product Manager

Aplikasi web sederhana untuk manajemen produk menggunakan Firebase BaaS (Backend as a Service) dengan fitur lengkap Authentication, Realtime Database, dan Email Verification.

## Fitur

### 1. Firebase Authentication
- **Register**: Pendaftaran user baru dengan email dan password
- **Login**: Masuk ke aplikasi dengan kredensial yang terdaftar
- **Email Verification**: Link verifikasi otomatis dikirim ke email saat register
- **Logout**: Keluar dari aplikasi

### 2. Firebase Realtime Database
Data produk yang disimpan (5 field):
1. **Nama Produk** (string)
2. **Kategori** (string: Elektronik, Pakaian, Makanan, Minuman, Lainnya)
3. **Harga** (number)
4. **Stok** (number)
5. **Deskripsi** (string)

### 3. CRUD Operations (12 fungsi)
- **Produk**: 1 Create, 1 Read, 1 Update, 1 Delete
- **Kategori**: 1 Create, 1 Read, 1 Update, 1 Delete
- **Supplier**: 1 Create, 1 Read, 1 Update, 1 Delete

Total: **12 fungsi CRUD** terhubung ke Firebase Realtime Database.

### 4. UI/UX
- Desain modern dengan CSS murni
- Responsive design untuk mobile dan desktop
- Toast notification untuk feedback
- Form validation
- Loading states

### 5. Bonus Layanan Cloud Tambahan
- **Firebase Storage** untuk upload gambar produk (opsional)
- URL file gambar disimpan bersama data produk di Realtime Database

## Setup Firebase

### 1. Buat Project Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik "Add project"
3. Beri nama project (misal: "product-manager")
4. Aktifkan Google Analytics (opsional)
5. Klik "Create project"

### 2. Aktifkan Authentication
1. Di sidebar, klik "Authentication"
2. Klik "Get started"
3. Pilih tab "Sign-in method"
4. Aktifkan "Email/Password"
5. Simpan perubahan

### 3. Setup Realtime Database
1. Di sidebar, klik "Realtime Database"
2. Klik "Create Database"
3. Pilih lokasi (asia-southeast1 untuk Indonesia)
4. Pilih mode "Start in test mode" (untuk development)
5. Klik "Enable"

### 4. Dapatkan Konfigurasi Firebase
1. Klik ikon gear (⚙️) di sidebar
2. Pilih "Project settings"
3. Di tab "General", scroll ke bawah ke "Your apps"
4. Klik icon web (</>)
5. Beri nama app dan klik "Register app"
6. Copy konfigurasi firebaseConfig

### 5. Update Konfigurasi
Buka file `app.js` dan ganti `firebaseConfig` dengan konfigurasi Anda:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

## Cara Menjalankan

### Lokal
1. Extract file ZIP
2. Buka folder project
3. Buka file `index.html` di browser
4. Atau gunakan Live Server di VS Code

### Deploy ke Netlify

Netlify adalah platform hosting yang sangat mudah digunakan untuk static sites.

#### Opsi 1: Drag & Drop (Termudah)
1. Buka [Netlify](https://www.netlify.com/)
2. Login dengan akun GitHub/GitLab/Email
3. Di dashboard, drag & drop folder project ke area deploy
4. Tunggu beberapa detik, website akan otomatis deploy!

#### Opsi 2: Connect Git Repository
1. Push code ke GitHub/GitLab
2. Buka [Netlify Dashboard](https://app.netlify.com/)
3. Klik **"Add new site"** > **"Import an existing project"**
4. Pilih Git provider (GitHub/GitLab)
5. Pilih repository `firebase-product-manager`
6. Setting:
   - **Branch to deploy**: `main` atau `master`
   - **Build command**: *(kosongkan)*
   - **Publish directory**: `.` (root folder)
7. Klik **"Deploy site"**

#### Opsi 3: Netlify CLI
1. Install Netlify CLI:
```bash
npm install netlify-cli -g
```
2. Login ke Netlify:
```bash
netlify login
```
3. Deploy dari folder project:
```bash
netlify deploy --prod --dir=.
```

## Struktur Folder

```
firebase-app/
├── index.html          # Halaman utama aplikasi
├── style.css           # Styling CSS
├── app.js              # Logika Firebase dan JavaScript
├── README.md           # Dokumentasi
└── package.json        # (Opsional, untuk deploy)
```

## Keamanan

### Firebase Security Rules (Realtime Database)
Tambahkan rules berikut di Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "products": {
      "$productId": {
        ".read": "auth != null",
        ".write": "auth != null && data.child('userId').val() == auth.uid || newData.child('userId').val() == auth.uid"
      }
    }
  }
}
```

Rules ini memastikan:
- Hanya user yang login bisa membaca data
- User hanya bisa mengubah data miliknya sendiri

### Firebase Storage Rules (Opsional Bonus)
Jika memakai upload gambar produk, gunakan rules sederhana berikut:

```txt
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Testing

### Test Case 1: Register
1. Buka aplikasi
2. Klik tab "Register"
3. Masukkan email valid
4. Masukkan password (min 6 karakter)
5. Konfirmasi password
6. Klik "Register"
7. Cek inbox email untuk link verifikasi
8. Klik link verifikasi

### Test Case 2: Login
1. Setelah verifikasi email
2. Masukkan email dan password
3. Klik "Login"
4. Berhasil masuk ke dashboard

### Test Case 3: CRUD Produk
1. **Create**: Isi form produk dan klik "Simpan"
2. **Read**: Lihat daftar produk di tabel
3. **Update**: Klik "Edit" pada produk, ubah data, klik "Update"
4. **Delete**: Klik "Hapus" pada produk, konfirmasi penghapusan

## Troubleshooting

### Email tidak terkirim
- Cek folder spam/junk
- Pastikan email valid
- Coba kirim ulang verifikasi

### Tidak bisa login
- Pastikan email sudah terverifikasi
- Cek password benar
- Cek koneksi internet
- Jika muncul `auth/api-key-not-valid`, berarti `firebaseConfig` di `app.js` masih placeholder atau salah project

### Data tidak muncul
- Cek Firebase Console > Realtime Database
- Pastikan user sudah login
- Cek browser console untuk error
- Pastikan `databaseURL` pada `firebaseConfig` sesuai dengan project Firebase yang aktif

## Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase BaaS
  - Firebase Authentication
  - Firebase Realtime Database
- **Hosting**: Netlify (Static Site)

## Ringkasan Aplikasi

Aplikasi ini adalah dashboard manajemen data berbasis cloud dengan Firebase, yang berisi:

1. **Autentikasi User**
   - Register akun baru (email + password)
   - Login user terdaftar
   - Verifikasi email otomatis setelah register
   - Logout user

2. **Manajemen Data Realtime**
   - Modul **Produk**
   - Modul **Kategori**
   - Modul **Supplier**
   - Seluruh data tersimpan di **Firebase Realtime Database** dan terikat ke `userId` masing-masing user.

3. **12 Fungsi CRUD Wajib**
   - 3 fungsi **Create** (Produk, Kategori, Supplier)
   - 3 fungsi **Read** (Produk, Kategori, Supplier)
   - 3 fungsi **Update** (Produk, Kategori, Supplier)
   - 3 fungsi **Delete** (Produk, Kategori, Supplier)

## Cara Menggunakan Aplikasi (Ringkas)

1. **Setup Firebase**
   - Buat project di Firebase Console.
   - Aktifkan Authentication (Email/Password).
   - Aktifkan Realtime Database.
   - Copy konfigurasi web app Firebase ke `firebaseConfig` di `app.js`.

2. **Jalankan Aplikasi**
   - Buka `index.html` via browser / Live Server.
   - Atau deploy ke Netlify dari folder `firebase-product-manager`.

3. **Alur Pemakaian User**
   - Register akun baru.
   - Cek inbox email dan lakukan verifikasi email.
   - Login ke aplikasi.
   - Tambah, lihat, ubah, dan hapus data Produk/Kategori/Supplier.

4. **Jika Ada Error Login**
   - Cek `firebaseConfig` (terutama `apiKey`, `authDomain`, `databaseURL`).
   - Pastikan domain deploy sudah ada pada Firebase Authentication > Authorized Domains.

## Kesimpulan Sederhana

Aplikasi ini sudah memenuhi kebutuhan tugas website berbasis layanan cloud dengan Firebase:
- autentikasi lengkap (register/login),
- email verifikasi setelah register,
- dan 12 operasi CRUD terhubung Realtime Database.

Dengan struktur ini, aplikasi siap digunakan sebagai contoh implementasi BaaS Firebase untuk skenario manajemen data multi-entitas secara realtime.

## Checklist Pengumpulan Tugas

1. **Upload ke GitHub**
   - Push semua file proyek ke repository GitHub.
   - Pastikan README berisi cara setup dan cara menjalankan.

2. **Deploy ke Cloud Hosting**
   - Deploy ke Netlify (atau hosting cloud lain).
   - Pastikan URL website aktif dan bisa diakses publik.

3. **Buat Video Demo YouTube**
   - Tunjukkan semua fitur:
     - Register + Login
     - Verifikasi email
     - 12 CRUD (Produk, Kategori, Supplier)
     - Bonus cloud (upload gambar ke Firebase Storage)
   - Tunjukkan isi Firebase Console:
     - Authentication
     - Realtime Database
     - Storage (jika bonus diaktifkan)

## Daftar Screenshot yang Perlu Diambil

Untuk laporan, minimal ambil screenshot berikut:

1. **Halaman Register** (sebelum submit).
2. **Email verifikasi masuk inbox** (subjek/verifikasi terlihat).
3. **Halaman Login** (berhasil login).
4. **Dashboard setelah login** (semua modul terlihat).
5. **Create data Produk** (form terisi + hasil muncul di tabel).
6. **Create data Kategori** (hasil muncul di tabel).
7. **Create data Supplier** (hasil muncul di tabel).
8. **Update salah satu data** (sebelum & sesudah update).
9. **Delete salah satu data** (konfirmasi + hasil data hilang).
10. **Upload gambar produk ke Firebase Storage** (thumbnail tampil).
11. **Firebase Console - Authentication** (daftar user).
12. **Firebase Console - Realtime Database** (node products/categories/suppliers).
13. **Firebase Console - Storage** (file gambar tersimpan).
14. **Website hasil deploy** di Netlify/custom domain.

## Lisensi

Project ini dibuat untuk tugas implementasi BaaS menggunakan Firebase.

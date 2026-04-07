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

### 3. CRUD Operations
- **Create**: Tambah produk baru
- **Read**: Tampilkan daftar produk dalam tabel
- **Update**: Edit data produk yang sudah ada
- **Delete**: Hapus produk dari database

### 4. UI/UX
- Desain modern dengan CSS murni
- Responsive design untuk mobile dan desktop
- Toast notification untuk feedback
- Form validation
- Loading states

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

### Data tidak muncul
- Cek Firebase Console > Realtime Database
- Pastikan user sudah login
- Cek browser console untuk error

## Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Firebase BaaS
  - Firebase Authentication
  - Firebase Realtime Database
- **Hosting**: Netlify (Static Site)

## Lisensi

Project ini dibuat untuk tugas implementasi BaaS menggunakan Firebase.

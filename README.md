# Aplikasi-CRUD-Firebase-BaaS

Membuat website CRUD menggunakan Firebase (Authentication + Realtime Database) dengan deployment ke Netlify.

[![Netlify Status](https://api.netlify.com/api/v1/badges/8e62d6e8-3c69-4526-a009-5d024049b9ae/deploy-status)](https://app.netlify.com/projects/firebase-product-manager/deploys)

## Yang perlu dibenarkan agar code berjalan

### 1) Perbaiki struktur `package.json`
Sebelumnya `package.json` di root dan `app/package.json` tidak valid JSON sehingga `npm install` / `npm run` gagal.

Sudah dibenarkan dengan:
- Root `package.json` valid dan menjadi command launcher.
- `app/package.json` sudah punya blok `scripts` yang benar (`dev`, `build`, `preview`).

### 2) Gunakan konfigurasi Firebase yang benar
Di `firebase-product-manager/app.js`, nilai `firebaseConfig` masih placeholder.
Kamu **wajib** ganti dengan config asli dari Firebase Console, kalau tidak Authentication/Database tidak akan connect.

### 3) Pastikan setting deploy Netlify mengarah ke folder yang benar
Repo ini punya beberapa folder. App static yang siap deploy ada di `firebase-product-manager/`.
Agar tidak salah publish directory, root `netlify.toml` sudah ditambahkan:
- `base = "firebase-product-manager"`
- `publish = "."`

## Cara menjalankan lokal

### Opsi A - React app (`app/`)
```bash
npm install
npm run dev
```

### Opsi B - Static Firebase app (`firebase-product-manager/`)
```bash
npm --prefix firebase-product-manager install
npm run dev:firebase-product-manager
# atau jalankan langsung
npm --prefix firebase-product-manager run dev
```

## Setup GitHub + Domain + Netlify

## 1. Push project ke GitHub
1. Buat repo baru di GitHub.
2. Push branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

## 2. Hubungkan GitHub ke Netlify
1. Login ke Netlify.
2. Klik **Add new site** → **Import an existing project**.
3. Pilih **GitHub**, authorize akses.
4. Pilih repository ini.
5. Build setting (untuk static app di `firebase-product-manager`):
   - **Base directory**: `firebase-product-manager`
   - **Build command**: *(kosongkan untuk static app)*
   - **Publish directory**: `.`
6. Klik **Deploy site**.

> Catatan: Karena root `netlify.toml` sudah ada, biasanya setting ini otomatis terbaca.

## 3. Setup custom domain di Netlify
1. Buka site Netlify kamu.
2. **Site configuration** → **Domain management**.
3. Klik **Add a domain**.
4. Masukkan domain kamu (mis. `example.com`).
5. Netlify akan kasih instruksi DNS record.

### Jika domain dibeli di GitHub Pages domain provider / registrar lain
Umumnya perlu:
- `A record` untuk apex/root domain ke IP Netlify.
- `CNAME` untuk `www` ke subdomain Netlify (`your-site-name.netlify.app`).

Setelah DNS propagate (bisa 5 menit sampai 24 jam), klik **Verify DNS configuration** di Netlify.

## 4. SSL/HTTPS
Netlify otomatis menyediakan Let's Encrypt SSL setelah domain valid.
Pastikan opsi HTTPS aktif pada menu domain.

## 5. Tambahkan domain ke Firebase Authorized Domains
Supaya login Firebase Auth tidak ditolak:
1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**.
2. Tambahkan:
   - `your-site.netlify.app`
   - `example.com`
   - `www.example.com` (jika dipakai)

Kalau langkah ini dilewatkan, login/register bisa error seperti `auth/unauthorized-domain`.


## Setup Firebase Admin SDK (untuk server/backend)

Tambahkan inisialisasi berikut di sisi backend (Node.js), **bukan** di frontend browser:

```js
var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app"
});
```

Catatan penting:
- Jangan commit `serviceAccountKey.json` ke GitHub.
- Di repo ini sudah ada template: `firebase-admin-init.example.js`.
- Untuk produksi, pakai environment variable / secret manager, bukan file key di repo.

## Checklist cepat troubleshooting
- `npm run dev` gagal → cek ulang format JSON `package.json`.
- Bisa buka UI tapi auth gagal → cek `firebaseConfig` dan **Authorized domains**.
- Deploy sukses tapi halaman 404 saat refresh → pastikan redirect ke `/index.html` aktif di `netlify.toml`.
- Domain sudah dipasang tapi belum aktif → tunggu propagasi DNS dan verifikasi ulang di Netlify.

---

Kalau kamu mau, saya bisa lanjut bantu bikin:
1. template `.env` Firebase yang lebih aman,
2. langkah CI/CD auto deploy dari GitHub ke Netlify,
3. checklist produksi (rules Firebase + backup + monitoring).

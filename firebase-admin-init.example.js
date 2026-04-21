/**
 * Firebase Admin SDK init (SERVER SIDE ONLY)
 *
 * 1) Install dependency:
 *    npm install firebase-admin
 *
 * 2) Download Service Account JSON from Firebase Console
 *    and simpan sebagai `serviceAccountKey.json` (jangan di-commit)
 */

var admin = require("firebase-admin");

var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://product-manager-bdc83-default-rtdb.asia-southeast1.firebasedatabase.app"
});

module.exports = admin;

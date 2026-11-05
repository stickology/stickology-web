// ===== KONFIGURASI STICKOLOGY =====
// Login warga tetap pakai Firebase Auth (gratis). Data kampung sekarang di server Cloudflare.
const firebaseConfig = {
  apiKey: "AIzaSyCY-LHbpuSEtBlD0x5fOhEzmOV73D7YoMc",
  authDomain: "stickologyxyz.firebaseapp.com",
  projectId: "stickologyxyz",
  storageBucket: "stickologyxyz.firebasestorage.app",
  messagingSenderId: "1075160571254",
  appId: "1:1075160571254:web:bfe0b2fe5aab52dbbd2e57"
};

// UID Presiden (jangan diubah)
const presidenUid = "O8LKgjWMX6YR8CngUSjNEro8nHa2";

// Alamat server Cloudflare (worker stickology-saweria), tanpa garis miring di akhir.
// Contoh: "https://stickology-saweria.namakamu.workers.dev"
const apiUrl = "https://stickology-saweria.togetherco-and-8fc.workers.dev";

// Mode maintenance: true = pengunjung lihat layar "Lagi maintenance" (Presiden tetap bisa masuk). Ubah ke false kalau sudah selesai.
const maintenance = true;

window.STICKOLOGY_CONFIG = { firebase: firebaseConfig, presidenUid: presidenUid, apiUrl: apiUrl, maintenance: maintenance };

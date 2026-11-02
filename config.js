// ===== KONFIGURASI STICKOLOGY =====
const firebaseConfig = {
  apiKey: "AIzaSyCY-LHbpuSEtBlD0x5fOhEzmOV73D7YoMc",
  authDomain: "stickologyxyz.firebaseapp.com",
  projectId: "stickologyxyz",
  storageBucket: "stickologyxyz.firebasestorage.app",
  messagingSenderId: "1075160571254",
  appId: "1:1075160571254:web:bfe0b2fe5aab52dbbd2e57"
};

// Tempel UID Presiden (dari Firebase > Authentication > Users) di antara tanda kutip:
const presidenUid = "O8LKgjWMX6YR8CngUSjNEro8nHa2";

window.STICKOLOGY_CONFIG = { firebase: firebaseConfig, presidenUid: presidenUid };

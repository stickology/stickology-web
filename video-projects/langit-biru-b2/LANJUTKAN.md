# Cara melanjutkan (butuh GEMINI_API_KEY)

Status: naskah, ledger, gambar (`art/`, dibuat oleh `node art.mjs`) dan susunan adegan selesai;
uji gerakan tanpa suara sudah dicek. Belum ada: rekaman narasi.

Dari folder skill `.claude/skills/directing-stickman-videos`:

```bash
npm ci
P=/home/user/stickology-web/video-projects/langit-biru-b2
node scripts/gemini-media.mjs speech --text $P/narration.txt --output $P/narration.wav \
  --model <MODEL_TTS_YANG_TERSEDIA> --voice Fola --allow-network
node scripts/autopilot.mjs probe $P/narration.wav
```

Lalu isi `timings.json` dari rekaman asli (`split` = awal "Karena", `hit` = "udara",
`biru` = "biru" terakhir; semua termasuk `lead`), jalankan `node build.mjs`, kemudian
`validate`/`preview --seconds 6`, tonton dan dengar hasilnya sebelum dikirim.

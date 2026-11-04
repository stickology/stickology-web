# Cara melanjutkan (butuh GEMINI_API_KEY)

Status: naskah, ledger, dan rancangan adegan B3 selesai. Uji gerakan tanpa suara sudah dicek.
Belum ada: rekaman narasi, sehingga preview resmi belum dirender.

Dari folder skill `.claude/skills/directing-stickman-videos`:

```bash
npm ci
node scripts/autopilot.mjs doctor
P=/home/user/stickology-web/video-projects/langit-biru-b3
# 1. Narasi (satu permintaan berbayar ke Gemini TTS, voice Bodi, tanpa instruksi gaya)
node scripts/gemini-media.mjs speech --text $P/narration.txt --output $P/narration.wav \
  --model <MODEL_TTS_YANG_TERSEDIA> --voice Bodi --allow-network
node scripts/autopilot.mjs probe $P/narration.wav
```

2. Isi `timings.json` dari durasi asli + waktu kata (dengar rekaman, atau pakai
   `scripts/align_captions.py`): `split` = awal kata "Karena", `hit` = kata "udara",
   `biru` = kata "biru" terakhir. Semua waktu sudah termasuk `lead`.
3. `node build.mjs timings.json project.json`
4. `node scripts/autopilot.mjs validate $P/project.json --seconds 6` lalu `preview ... --seconds 6`.
5. Tonton & dengar `output/preview.mp4` sebelum dikirim ke pengguna.

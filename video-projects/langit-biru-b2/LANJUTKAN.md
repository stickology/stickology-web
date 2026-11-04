# Status

Preview 5 detik selesai dengan narasi ElevenLabs (Sabiq, `eleven_multilingual_v2`).

- `narration.mp3` = keluaran asli ElevenLabs; `narration.wav` = konversi 44,1 kHz mono untuk renderer.
- `words.json` = cap waktu per kata dari endpoint `with-timestamps` ElevenLabs.
- `timings.json` diisi dari `words.json` (+ `lead` 0,15 dtk): `split` = "Karena", `hit` = "udara", `biru` = "biru" terakhir.

Render ulang (dari folder skill `.claude/skills/directing-stickman-videos`):

```bash
P=/home/user/stickology-web/video-projects/langit-biru-b2
(cd $P && node art.mjs && node build.mjs)
node scripts/autopilot.mjs preview $P/project.json --replace
```

Menunggu: review pengguna atas `output/preview.mp4` (gambar + suara). Jangan jalankan `approve` sebelum pengguna setuju.

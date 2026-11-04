# Status: SELESAI

Video final 5,4 dtk (9:16) disetujui pengguna dan dirender: `final/langit-biru-b2.mp4`
(+ `.srt`/`.vtt`, `film-report.json`, `approval.json`).

- Narasi: ElevenLabs Bambang (`j7n5yC6BN3oA2ZIWImty`), `eleven_multilingual_v2`, pengaturan bawaan.
- `narration.mp3` = keluaran asli; `narration.wav` = 44,1 kHz mono, loudnorm ke −16 LUFS (asli −25 LUFS).
- `words.json` = cap waktu per kata ElevenLabs; `timings.json` diturunkan darinya (+ `lead` 0,15 dtk).

Render ulang dari folder skill `.claude/skills/directing-stickman-videos`:

```bash
P=/home/user/stickology-web/video-projects/langit-biru-b2
(cd $P && node art.mjs && node build.mjs)
node scripts/autopilot.mjs render $P/project.json
```

Mengubah gambar, teks, SFX atau narasi membatalkan persetujuan: buat preview baru dan minta review ulang.

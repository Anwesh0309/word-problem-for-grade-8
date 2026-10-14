# Word Problems Quest · Grade 8 Maths

Same architecture, UI/UX, layout, colours and audio pipeline as the Circumference module —
new content for **Word Problems (forming & solving linear equations)**.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build in dist/
```

## Voice / Audio (ElevenLabs "Alice" · Xb7hH8MSUJpSbSDYk0k2 · eleven_multilingual_v2)
The API key is in `.env.local` (`VITE_ELEVENLABS_API_KEY`).

Playback order for every narrated line (`src/audio.js`):
1. Pre-generated mp3 in `public/assets/audio/<key>.mp3`
2. Live ElevenLabs request with the per-style voice settings (cached per session)
3. Browser speech fallback

To bake all narration into static mp3 files (recommended before deploying):
```bash
npm run generate:audio            # only missing files
node scripts/generate_audio.js --force   # regenerate everything
npm run clean:audio               # delete orphaned mp3s
```
All narration text lives in `src/audioMap.js` (paragraphs & questions only — never titles).

## Content map
| Phase | What's new |
|---|---|
| Intro / Wonder | "$84 Movie Night" mystery |
| Story (8 slides) | 4-step detective plan: Define → Translate → Solve → Check, plus an age-puzzle case |
| Station 1 · Keyword Decoder | Tap clue words to reveal operations, build the expression from tiles, test it with an x-slider |
| Station 2 · Balance Builder | Pick the equation that matches the story, then solve on an animated balance scale (wrong moves tip the scale) |
| Station 3 · Error Detective | Find the wrong line in a student's solution, choose the fix, then substitute & check |
| Practice | 10 worlds, procedurally generated word problems with bar-model diagrams (money, number riddles, consecutive numbers, ages, tickets, perimeter, speed, coins, discounts, translation) |
| Reflect | Explain the 4 steps to Robo |

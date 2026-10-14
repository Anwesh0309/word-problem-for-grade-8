/* Removes .mp3 files in public/assets/audio that are no longer referenced by src/audioMap.js */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');

const { AUDIO_MAP } = await import(pathToFileURL(path.join(ROOT, 'src', 'audioMap.js')).href);
const valid = new Set(Object.values(AUDIO_MAP).map(e => path.basename(e.file)));

if (!fs.existsSync(AUDIO_DIR)) {
  console.log('No audio folder yet.');
  process.exit(0);
}
let removed = 0;
for (const f of fs.readdirSync(AUDIO_DIR)) {
  if (f.endsWith('.mp3') && !valid.has(f)) {
    fs.unlinkSync(path.join(AUDIO_DIR, f));
    console.log(`🗑  removed ${f}`);
    removed++;
  }
}
console.log(`Done. Removed ${removed} orphaned file(s).`);

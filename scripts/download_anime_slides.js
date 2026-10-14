import fs from 'fs';
import path from 'path';

const SLIDES = [
  {
    id: 2,
    prompt: 'masterpiece, anime aesthetic, high quality, Makoto Shinkai style, teenage anime boy Leo with casual hoodie and anime detective girl Maya looking at a glowing holographic golden letter X floating in the air above a wallet with dollar bills, inside a modern cinema lobby with neon movie posters, soft warm lighting, detailed anime interior, magical glowing dust particles'
  },
  {
    id: 3,
    prompt: 'masterpiece, anime aesthetic, high quality, anime detective girl Maya pointing her glowing magnifying glass at glowing floating word clues in the air, glowing neon symbols + - × ÷ and algebraic equation 2x - 5, detective office desk with mystery files and maps in background, vibrant cinematic lighting, studio ghibli anime style, magical sparks'
  },
  {
    id: 4,
    prompt: 'masterpiece, anime aesthetic, high quality, anime detective girl Maya and teenage boy Leo standing outside a grand glowing stadium concert hall at night with sparkling festival lights, holding holographic concert tickets in their hands, glowing neon algebra equation 2(c + 12) + 3c = 89 floating above them, fireworks in the night sky, vibrant colorful anime scene'
  },
  {
    id: 5,
    prompt: 'masterpiece, anime aesthetic, high quality, anime girl detective Maya operating a glowing golden mechanical balance scale in a futuristic detective lab, both sides of the balance scale holding glowing weights and algebra bags, scale is perfectly level, floating glowing equations 5c = 65 and c = 13, cyan and gold glowing particle effects, intense focused expression'
  },
  {
    id: 6,
    prompt: 'masterpiece, anime aesthetic, high quality, joyful anime detective girl Maya giving a cheerful thumbs up and holding a verified green stamped case file, friend Leo smiling happily next to her holding concert passes, glowing green checkmark and equation 50 + 39 = 89 in the air, celebratory confetti particles, triumphant bright golden sunshine, Kyoto Animation style'
  },
  {
    id: 8,
    prompt: 'masterpiece, anime aesthetic, high quality, heroic anime detective girl Maya standing at the open doorway of a high-tech glowing math simulation lab, welcoming the viewer with an outstretched hand and confident smile, inside the lab are glowing holographic balance scales, puzzle stations, neon blue and purple futuristic lighting, epic cinematic anime key visual'
  }
];

const OUT_DIR = path.resolve('public/assets/images');

async function downloadSlide(slide) {
  const encPrompt = encodeURIComponent(slide.prompt);
  const jpgPath = path.join(OUT_DIR, `slide${slide.id}.jpg`);
  const pngPath = path.join(OUT_DIR, `slide${slide.id}.png`);

  for (let attempt = 1; attempt <= 6; attempt++) {
    const seed = Math.floor(Math.random() * 100000);
    const url = `https://image.pollinations.ai/prompt/${encPrompt}?width=768&height=768&nologo=true&seed=${seed}`;
    console.log(`[Slide ${slide.id}] Attempt ${attempt}: Requesting image...`);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) {
        throw new Error(`Response too small: ${buf.length} bytes`);
      }
      fs.writeFileSync(jpgPath, buf);
      fs.writeFileSync(pngPath, buf);
      console.log(`[Slide ${slide.id}] SUCCESS! Saved (${(buf.length / 1024).toFixed(1)} KB)`);
      return true;
    } catch (err) {
      console.warn(`[Slide ${slide.id}] Attempt ${attempt} failed: ${err.message}. Waiting 20s...`);
      await new Promise(r => setTimeout(r, 20000));
    }
  }
  return false;
}

async function main() {
  console.log(`Generating anime images for missing slides: ${SLIDES.map(s => s.id).join(', ')}...`);
  for (const slide of SLIDES) {
    const ok = await downloadSlide(slide);
    if (ok) {
      console.log(`Cooling down 15s before next slide...`);
      await new Promise(r => setTimeout(r, 15000));
    }
  }
  console.log('All missing slides processing complete!');
}

main();

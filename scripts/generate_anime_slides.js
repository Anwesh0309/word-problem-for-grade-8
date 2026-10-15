import { Client } from '@gradio/client';
import fs from 'fs';
import path from 'path';

const SLIDES = [
  {
    id: 1,
    title: 'Every Word Problem Hides an Equation',
    prompt: '1girl, solo, teenage detective girl Maya, shoulder-length brown hair, brown eyes, cheerful smile, wearing tan beret hat, beige trench coat, white collared shirt, holding a brass magnifying glass, looking at glowing golden holographic question marks and glowing numbers floating in the air, modern bustling shopping street background, store signs, warm glowing evening lights, masterpiece, high quality anime, Kyoto Animation aesthetic',
    seed: 101
  },
  {
    id: 2,
    title: 'Step 1: Define the Unknown',
    prompt: '1girl, 1boy, teenage detective girl Maya with tan beret hat and beige trench coat and brown hair, sitting beside teenage boy friend Leo with teal hoodie at a wooden desk in cozy detective study, glowing golden 3D letter X floating above an open wallet with dollar bills on desk, detective notes, notebook, pencil, curious excited smile, masterpiece, high quality anime',
    seed: 202
  },
  {
    id: 3,
    title: 'Step 2: Translate the Keywords',
    prompt: '1girl, solo, teenage detective girl Maya with tan beret hat and beige trench coat and brown hair, standing in front of detective chalkboard with clue papers, holding glowing magnifying glass, pointing at glowing neon mathematical symbols plus minus multiply divide floating in the air, glowing neon equation banner 2x - 5, clever confident smile, cozy detective office, warm lamplight, masterpiece, high quality anime',
    seed: 303
  },
  {
    id: 4,
    title: 'Step 2: Build the Equation',
    prompt: '1girl, 1boy, teenage detective girl Maya with tan beret hat and beige trench coat, standing beside boy Leo outside a grand illuminated stadium concert arena at night, fireworks and colorful stage lights in the sky, holding up glowing concert tickets, glowing neon algebra equation banner 2(c + 12) + 3c = 89 floating in night sky, excited happy smiles, masterpiece, high quality anime',
    seed: 404
  },
  {
    id: 5,
    title: 'Step 3: Solve the Equation',
    prompt: '1girl, solo, teenage detective girl Maya with tan beret hat and beige trench coat, standing at a science workbench operating a glowing golden mechanical balance scale, the balance scale is perfectly level, glowing weights and labels 5c and 65 on the scale pans, floating glowing neon equations 5c = 65 and c = 13, cyan and gold glowing particle effects, focused happy smile, masterpiece, high quality anime',
    seed: 505
  },
  {
    id: 6,
    title: 'Step 4: Check & Answer in Context',
    prompt: '1girl, 1boy, cheerful teenage detective girl Maya with tan beret hat and beige trench coat giving a bright thumbs up, holding detective case file folder stamped with glowing green verified checkmark stamp, friend Leo smiling happily next to her holding concert passes, glowing equation 50 + 39 = 89 in air, celebratory confetti particles, triumphant bright golden sunlight, masterpiece, high quality anime',
    seed: 606
  },
  {
    id: 7,
    title: 'Real World Cases: Age Puzzles',
    prompt: '1girl, 1boy, 1woman, heartwarming anime scene, cheerful 12 year old boy Ethan with school backpack, smiling loving 36 year old mother with gentle smile, detective girl Maya with tan beret hat and beige trench coat standing beside them taking notes with pencil, floating glowing timeline puzzle banner showing Ethan 12 and Mother 36, equation 3x + 12 = 2(x + 12), sunlit park background, soft golden sunshine, masterpiece, high quality anime',
    seed: 707
  },
  {
    id: 8,
    title: 'Step Into the Simulation Lab!',
    prompt: '1girl, solo, heroic teenage detective girl Maya with tan beret hat and beige trench coat, standing at the open glowing doorway entrance of a high-tech math simulation lab, welcoming the viewer with outstretched hand and confident warm smile, inside the lab are glowing holographic balance scales, neon puzzle stations, glowing mathematical formulas, futuristic cyan and purple lighting, epic key visual, masterpiece, high quality anime',
    seed: 808
  }
];

const NEGATIVE_PROMPT = 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, nsfw, deformed';
const OUT_DIR = path.resolve('public/assets/images');

async function generateSlide(slide) {
  console.log(`\n========================================`);
  console.log(`Generating Slide ${slide.id}: "${slide.title}"`);
  console.log(`Prompt: ${slide.prompt}`);
  console.log(`========================================`);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[Slide ${slide.id}] Connecting to Animagine XL 3.1 (Attempt ${attempt})...`);
      const app = await Client.connect('cagliostrolab/animagine-xl-3.1');
      console.log(`[Slide ${slide.id}] Running inference...`);

      const result = await app.predict('/run', [
        slide.prompt,
        NEGATIVE_PROMPT,
        slide.seed + (attempt - 1) * 777,
        1024, // width
        1024, // height
        7.0,  // guidance scale
        26,   // steps
        'Euler a',
        '1024 x 1024',
        'Anime',
        'Standard v3.1',
        false, // upscaler
        0.5,
        1.0,
        true   // quality tags
      ]);

      if (result.data && result.data[0] && result.data[0][0]) {
        const imgObj = result.data[0][0];
        const imgUrl = imgObj.image?.url;
        if (!imgUrl) throw new Error('No image URL in result');

        console.log(`[Slide ${slide.id}] Downloading image from ${imgUrl}...`);
        const res = await fetch(imgUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());

        const pngPath = path.join(OUT_DIR, `slide${slide.id}.png`);
        const jpgPath = path.join(OUT_DIR, `slide${slide.id}.jpg`);
        fs.writeFileSync(pngPath, buf);
        fs.writeFileSync(jpgPath, buf);

        console.log(`[Slide ${slide.id}] SUCCESS! Saved to ${pngPath} (${(buf.length / 1024).toFixed(1)} KB)`);
        return true;
      } else {
        throw new Error('Unexpected result data structure');
      }
    } catch (err) {
      console.warn(`[Slide ${slide.id}] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) {
        console.log('Waiting 5s before retrying...');
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
  return false;
}

async function main() {
  // Allow specifying slide ID from command line, e.g. node scripts/generate_anime_slides.js 3
  const targetId = process.argv[2] ? parseInt(process.argv[2], 10) : null;
  const slidesToRun = targetId ? SLIDES.filter(s => s.id === targetId) : SLIDES;

  console.log(`Starting generation for ${slidesToRun.length} slide(s)...`);
  for (const slide of slidesToRun) {
    const pngPath = path.join(OUT_DIR, `slide${slide.id}.png`);
    if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 500 * 1024 && !process.argv[2]) {
      console.log(`[Slide ${slide.id}] Already generated high-res image (${(fs.statSync(pngPath).size / 1024).toFixed(1)} KB), skipping.`);
      continue;
    }
    const success = await generateSlide(slide);
    if (!success) {
      console.error(`Failed to generate slide ${slide.id}`);
    }
    // Small pause between generations
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('\nAll done!');
}

main().catch(console.error);

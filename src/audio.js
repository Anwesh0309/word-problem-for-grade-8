/* =========================================================================
   AUDIO ENGINE (ElevenLabs "Alice" pipeline architecture)
   Voice: Alice (Clear, Engaging Educator) — Voice ID: Xb7hH8MSUJpSbSDYk0k2
   Model: eleven_multilingual_v2

   Zero Overlap Guarantee:
     - Global cancellation token & active audio pool
     - When any phase/step/question changes or user skips, previous audio
       is terminated immediately and its buffer cleared.
     - Only on-screen narration plays. Skipped audio is discarded.
   ========================================================================= */
export const VOICE_ID = "Xb7hH8MSUJpSbSDYk0k2";
export const MODEL_ID = "eleven_multilingual_v2";
const API_KEY = (import.meta.env && import.meta.env.VITE_ELEVENLABS_API_KEY) || "sk_30ba992a24d6f19c565764c69ce76a192a3cc11e846daaa8";

export const STYLE_SETTINGS = {
  celebration: {
    stability: 0.12,
    similarity_boost: 0.45,
    style: 0.75,
    rate: 1.06,
    pitch: 1.2
  },
  encouragement: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.65,
    rate: 1.0,
    pitch: 1.1
  },
  question: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.55,
    rate: 0.98,
    pitch: 1.08
  },
  emphasis: {
    stability: 0.16,
    similarity_boost: 0.50,
    style: 0.60,
    rate: 0.95,
    pitch: 1.05
  },
  thinking: {
    stability: 0.24,
    similarity_boost: 0.60,
    style: 0.35,
    rate: 0.90,
    pitch: 0.95
  },
  statement: {
    stability: 0.20,
    similarity_boost: 0.55,
    style: 0.50,
    rate: 1.0,
    pitch: 1.0
  }
};
STYLE_SETTINGS.instruction = STYLE_SETTINGS.statement;

export let audioMuted = false;
let ttsVoice = null;
let currentQueue = 0;
const activeAudios = new Set();

function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return (
    voices.find(v => /female|alice|zira|samantha|victoria|google us english/i.test(v.name)) ||
    voices.find(v => v.lang && v.lang.startsWith('en')) ||
    voices[0]
  );
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    ttsVoice = pickVoice();
  };
  ttsVoice = pickVoice();
}

export function setMuted(m) {
  audioMuted = m;
  if (m) stopNarration();
}

/* ---------------- URL resolution: static file → ElevenLabs → null ---------------- */
const urlCache = new Map(); // file/text -> Promise<string|null>

async function staticFileUrl(file) {
  if (!file) return null;
  try {
    const res = await fetch(file, { method: 'GET' });
    const type = res.headers.get('content-type') || '';
    if (res.ok && /audio|mpeg|octet-stream/i.test(type)) {
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) { /* fall through */ }
  return null;
}

async function elevenLabsUrl(text, style) {
  if (!API_KEY) return null;
  const cfg = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;
  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        voice_settings: {
          stability: cfg.stability,
          similarity_boost: cfg.similarity_boost,
          style: cfg.style,
          use_speaker_boost: true
        }
      })
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    return null;
  }
}

export function getAudioUrl(seg) {
  if (!seg || (!seg.text && !seg.file)) return Promise.resolve(null);
  const cacheKey = seg.file || seg.text;
  if (!urlCache.has(cacheKey)) {
    const p = (async () => (await staticFileUrl(seg.file)) || (await elevenLabsUrl(seg.text, seg.style)))();
    urlCache.set(cacheKey, p);
    p.then(url => { if (!url) urlCache.delete(cacheKey); });
  }
  return urlCache.get(cacheKey);
}

export function speakSegment(seg, queueId) {
  return new Promise(async (resolve) => {
    if (audioMuted || !seg || (!seg.text && !seg.file)) return resolve();
    if (queueId != null && queueId !== currentQueue) return resolve();

    const url = await getAudioUrl(seg);
    if (queueId != null && queueId !== currentQueue) return resolve();
    if (audioMuted) return resolve();

    if (url) {
      try {
        const audio = new Audio(url);
        activeAudios.add(audio);

        const cleanup = () => {
          activeAudios.delete(audio);
          audio.onended = null;
          audio.onpause = null;
          audio.onerror = null;
          resolve();
        };

        audio.onended = cleanup;
        audio.onpause = () => {
          if (queueId !== currentQueue) cleanup();
        };
        audio.onerror = () => {
          activeAudios.delete(audio);
          fallbackSpeech(seg, queueId).then(resolve);
        };

        if (queueId !== currentQueue || audioMuted) {
          cleanup();
          return;
        }

        audio.play().catch(() => {
          activeAudios.delete(audio);
          fallbackSpeech(seg, queueId).then(resolve);
        });
        return;
      } catch (e) {
        // Fallback to speech synthesis
      }
    }

    fallbackSpeech(seg, queueId).then(resolve);
  });
}

function fallbackSpeech(seg, queueId) {
  return new Promise((resolve) => {
    if (audioMuted || typeof window === 'undefined' || !('speechSynthesis' in window) || !seg.text) {
      return resolve();
    }
    if (queueId != null && queueId !== currentQueue) return resolve();

    const cfg = STYLE_SETTINGS[seg.style] || STYLE_SETTINGS.statement;
    const utter = new SpeechSynthesisUtterance(seg.text);
    if (ttsVoice) utter.voice = ttsVoice;
    utter.rate = cfg.rate;
    utter.pitch = cfg.pitch;
    utter.volume = 1;

    utter.onend = resolve;
    utter.onerror = resolve;

    if (queueId != null && queueId !== currentQueue) return resolve();
    window.speechSynthesis.speak(utter);
  });
}

/**
 * Play a narration segment or array of segments.
 * Strictly guarantees that any previous narration is cancelled immediately.
 */
export async function narrate(segments, autoplay = true) {
  if (!autoplay || audioMuted || !segments) return;
  // Instantly cancel any ongoing speech or playback
  stopNarration();
  const myQueue = ++currentQueue;
  const segList = Array.isArray(segments) ? segments : [segments];

  for (let i = 0; i < segList.length; i++) {
    if (myQueue !== currentQueue || audioMuted) return;
    if (segList[i + 1]) getAudioUrl(segList[i + 1]); // preload next
    await speakSegment(segList[i], myQueue);
  }
}

/**
 * Hard stop for all audio playback and speech synthesis.
 * Unloads elements so no lingering buffers play.
 */
export function stopNarration() {
  currentQueue++;
  for (const audio of activeAudios) {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      audio.load();
    } catch (e) {}
  }
  activeAudios.clear();

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function preloadAudio(entries) {
  if (!entries || !Array.isArray(entries)) return;
  entries.forEach(e => {
    if (e) getAudioUrl(e);
  });
}

export const say = text => ({ text, style: 'statement' });
export const ask = text => ({ text, style: 'question' });
export const cheer = text => ({ text, style: 'celebration' });
export const emphasize = text => ({ text, style: 'emphasis' });
export const think = text => ({ text, style: 'thinking' });
export const celebrate = text => ({ text, style: 'celebration' });
export const instruct = text => ({ text, style: 'encouragement' });

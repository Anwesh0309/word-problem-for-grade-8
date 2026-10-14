import React, { useState, useEffect, useRef } from 'react';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';

const STORY_SLIDES = [
  {
    id: 1,
    title: "Every Word Problem Hides an Equation",
    audioKey: "story_1",
    image: "/assets/images/slide1.png",
    body: "Shopping bills, concert tickets, ages and road trips — real life is full of word problems, and each one hides a mystery number. Our job is to find it, just like a detective!",
    quote: "Every word problem is an equation in disguise!",
    bubble: "Let's learn the 4-step detective plan to crack any case!"
  },
  {
    id: 2,
    title: "Step 1: Define the Unknown",
    audioKey: "story_2",
    image: "/assets/images/slide2.png",
    body: "First, read the problem carefully and find what the question is asking. Then give that mystery quantity a letter. For example: Let x be the amount of money Leo spent, in dollars.",
    quote: "Let x = the quantity you need to find.",
    bubble: "Always write down what your letter stands for — with units!"
  },
  {
    id: 3,
    title: "Step 2: Translate the Keywords",
    audioKey: "story_3",
    image: "/assets/images/slide3.png",
    body: "Keywords are clues that tell us which operation to use. 'More than' → add, 'less than' → subtract, 'twice' or 'times' → multiply, 'shared equally' → divide, and 'is' or 'total' → equals.",
    quote: "'5 less than twice a number' → 2x − 5",
    bubble: "Careful! '5 less than' means you subtract the 5 at the END!"
  },
  {
    id: 4,
    title: "Step 2: Build the Equation",
    audioKey: "story_4",
    image: "/assets/images/slide4.png",
    body: "At a concert, an adult ticket costs $12 more than a child ticket. 2 adult tickets and 3 child tickets cost $89 in total. Let c be the cost of a child ticket, so an adult ticket costs c + 12.",
    quote: "2(c + 12) + 3c = 89",
    bubble: "Two ways of writing the same total make an equation!"
  },
  {
    id: 5,
    title: "Step 3: Solve the Equation",
    audioKey: "story_5",
    image: "/assets/images/slide5.png",
    body: "Expand the brackets: 2c + 24 + 3c = 89. Collect like terms: 5c + 24 = 89. Subtract 24 from both sides: 5c = 65. Divide both sides by 5: c = 13.",
    quote: "Whatever you do to one side, do to the other side!",
    bubble: "An equation is like a balance scale — always keep it level!"
  },
  {
    id: 6,
    title: "Step 4: Check & Answer in Context",
    audioKey: "story_6",
    image: "/assets/images/slide6.png",
    body: "Substitute back into the story: an adult ticket is 13 + 12 = $25. Two adult and three child tickets cost 50 + 39 = $89. It checks out! So, a child ticket costs $13.",
    quote: "Answer the question asked — in a sentence, with units!",
    bubble: "If your check fails, hunt for the mistake in your steps!"
  },
  {
    id: 7,
    title: "Real World Cases: Age Puzzles",
    audioKey: "story_7",
    image: "/assets/images/slide7.png",
    body: "Ethan's mother is 3 times as old as Ethan. In 12 years, she will be twice as old as him. Let x be Ethan's age now: 3x + 12 = 2(x + 12), so x = 12. Ethan is 12 and his mother is 36!",
    quote: "The same 4 steps crack ages, money, speed and shapes!",
    bubble: "Both people get 12 years older — add it to BOTH ages!"
  },
  {
    id: 8,
    title: "Step Into the Simulation Lab!",
    audioKey: "story_8",
    image: "/assets/images/slide8.png",
    body: "Brilliant detective work! You've learned to define the unknown, translate keywords, solve equations and check your answers. Now step into the lab to decode clues, balance equations and catch sneaky mistakes!",
    quote: "Ready to crack some real cases?",
    bubble: "Click below to enter the interactive lab!"
  }
];

export function StoryPhase({ muted, onDone, onSlideChange }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = STORY_SLIDES[slideIdx];

  // Keep the latest callback in a ref so a new inline function from the parent
  // doesn't re-run this effect (which would loop and restart narration).
  const slideChangeRef = useRef(onSlideChange);
  slideChangeRef.current = onSlideChange;

  useEffect(() => {
    if (slideChangeRef.current) {
      slideChangeRef.current(slideIdx + 1, STORY_SLIDES.length);
    }
    const audioData = AUDIO_MAP[slide.audioKey];
    if (audioData) {
      narrate(audioData, !muted);
    }
    return () => stopNarration();
  }, [slideIdx, muted]);

  const goNext = () => {
    stopNarration();
    if (slideIdx < STORY_SLIDES.length - 1) {
      setSlideIdx(i => i + 1);
    } else {
      onDone();
    }
  };

  const goPrev = () => {
    stopNarration();
    if (slideIdx > 0) setSlideIdx(i => i - 1);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Story Card with Maximum Grade 4 Visual Legibility & Scaled Image */}
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#160b36]/95 border-2 border-purple-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Left Column: Extra Large Image Illustration */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 h-80 sm:h-[420px] md:h-[450px] w-full bg-black/40 flex items-center justify-center shrink-0 group">
          {/* Top-Left Episode Badge */}
          <div className="absolute top-3.5 left-3.5 bg-[#14082c]/85 backdrop-blur-md border border-amber-400/50 text-amber-300 font-display font-900 text-xs px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1.5 tracking-wide">
            <span>🎬</span> Case #{slide.id} · Story
          </div>

          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
          />

          {/* Bottom Scrim & Tag */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#160b36] via-[#160b36]/60 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-2.5 right-3 text-[10px] font-black text-amber-300/90 bg-[#160b36]/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-purple-400/30 pointer-events-none z-20 flex items-center gap-1">
            <span>✨</span> Maya Detective Quest
          </div>
        </div>

        {/* Right Column: Extra Large Typography & Callout Pills */}
        <div className="flex flex-col items-start text-left justify-center gap-4.5 overflow-y-auto max-h-full py-1">
          {/* Slide Title */}
          <h2 className="font-display font-900 text-3xl sm:text-4xl md:text-5xl text-amber-400 leading-tight drop-shadow-md">
            {slide.title}
          </h2>

          {/* Body Narrative */}
          <p className="text-slate-100 text-xl sm:text-2xl leading-relaxed font-extrabold drop-shadow-sm">
            {slide.body}
          </p>

          {/* Pull-Quote Sparkle Pill */}
          <div className="w-full bg-[#1e0e45] border-2 border-amber-400/60 rounded-2xl px-6 py-3.5 text-center text-amber-300 font-display font-900 text-lg sm:text-xl flex items-center justify-center gap-3 shadow-lg">
            <span className="shrink-0 text-2xl">✨</span>
            <span className="leading-snug">"{slide.quote}"</span>
            <span className="shrink-0 text-2xl">✨</span>
          </div>

          {/* Mascot Speech Bubble Pill */}
          <div className="flex items-center gap-4 w-full mt-1">
            <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-4xl shadow-lg shrink-0">
              🦁
            </div>
            <div className="bg-white text-[#0c031d] rounded-2xl px-7 py-3.5 font-display font-900 text-lg sm:text-xl shadow-xl flex-1 text-left leading-snug">
              {slide.bubble}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Row: Back, Dots, Next */}
      <div className="w-full max-w-4xl flex items-center justify-between mt-3 z-20 shrink-0">
        <button
          onClick={goPrev}
          disabled={slideIdx === 0}
          className="bg-[#1c0d3a]/90 hover:bg-[#2c1859] border-2 border-white/30 text-white font-display font-900 text-xl sm:text-2xl px-10 py-4 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-xl hover:scale-105"
        >
          ← Back
        </button>

        {/* Dots Indicator */}
        <div className="flex items-center gap-3.5">
          {STORY_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                stopNarration();
                setSlideIdx(i);
              }}
              className={`rounded-full transition-all cursor-pointer ${
                i === slideIdx
                  ? 'w-4.5 h-4.5 bg-amber-400 shadow-[0_0_18px_rgba(250,204,21,0.9)]'
                  : 'w-3.5 h-3.5 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="btn-gold text-xl sm:text-2xl px-11 py-4 font-900 flex items-center gap-2 shadow-[0_0_35px_rgba(250,204,21,0.85)] hover:scale-105"
        >
          <span>{slideIdx === STORY_SLIDES.length - 1 ? 'Enter Lab 🧪' : 'Next'}</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

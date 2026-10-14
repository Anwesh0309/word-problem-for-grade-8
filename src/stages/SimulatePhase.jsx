import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { BgSymbols } from '../components/TopNav.jsx';
import { AUDIO_MAP } from '../audioMap.js';
import { narrate, stopNarration } from '../audio.js';

/* =========================================================================
   3 INTERACTIVE STATIONS × 3 REAL-WORLD GRADE 7 SIMULATION ACTIVITIES
   Station 1 — Keyword Decoder : UNDERSTAND  (Words → Real-World Expressions)
   Station 2 — Balance Builder : SOLVE       (Form & Balance Step-by-Step)
   Station 3 — Error Detective : VERIFY      (Spot Trap, Fix & Reality Check)

   Deeply aligned with Story Phase (Movie Night $84, Concert Tickets, Ages)
   Rich in concrete real-world details (receipts, barcodes, coin stacks, level bubble)
   ========================================================================= */

const STATION_ACTIVITIES = {
  1: [
    {
      id: 1,
      title: "Activity 1: Concert Ticket Booth",
      tagline: "Directly from Story Phase (Slide 4 & 6)",
      desc: "Maya and Leo are at the City Sounds Arena ticket booth. A child ticket costs $c. An adult VIP pass costs $12 more than a child ticket. Maya buys 2 adult passes and 3 child tickets!",
      icon: "🎟️",
      propType: "ticket",
      sentence: [
        { t: "An adult pass costs " },
        { t: "$12 more than", op: "+ 12", means: "add 12 at the end" },
        { t: " a child ticket ($c), and Maya buys " },
        { t: "2 adult passes", op: "2 × (c + 12)", means: "multiply (c + 12) by 2" },
        { t: " and " },
        { t: "3 child tickets", op: "+ 3c", means: "add 3 times c" },
        { t: "." }
      ],
      variable: "c",
      tiles: ["2", "(", "c", "+", "12", ")", "+", "3", "c", "×", "−", "89"],
      target: "2*(c+12)+3*c",
      answerLabel: "2(c + 12) + 3c",
      testLabel: "Total Ticket Bill",
      unit: "$",
      money: true,
      defaultVal: 13,
      minVal: 8,
      maxVal: 20,
      hint: "Remember Story Slide 4! 2 adult passes are 2(c + 12), plus 3 child tickets (3c).",
      realWorldStory: "At c = $13 (just like in Story Slide 4 & 6!), adult passes are $25 each. 2($25) + 3($13) = $50 + $39 = $89 in total!"
    },
    {
      id: 2,
      title: "Activity 2: Cinema Snack Counter",
      tagline: "From the Wonder Phase $84 Movie Night",
      desc: "At the cinema snack counter, Leo buys a regular popcorn for $x. A mega family tub costs $3 more than twice the regular popcorn. Decode the clues to find the mega tub price!",
      icon: "🍿",
      propType: "cinema",
      sentence: [
        { t: "A mega tub costs " },
        { t: "$3 more than", op: "+ 3", means: "add 3 at the end" },
        { t: " " },
        { t: "twice the price", op: "2 ×", means: "multiply x by 2" },
        { t: " of a regular popcorn ($x)." }
      ],
      variable: "x",
      tiles: ["2", "x", "+", "3", "−", "×", "4", "5"],
      target: "2*x+3",
      answerLabel: "2x + 3",
      testLabel: "Mega Tub Price",
      unit: "$",
      money: true,
      defaultVal: 5,
      minVal: 2,
      maxVal: 12,
      hint: "'$3 more than twice x' → start with twice x (2x), then add 3.",
      realWorldStory: "If regular popcorn is $5, the mega tub is 2($5) + $3 = $13. The cash register display rings up $13!"
    },
    {
      id: 3,
      title: "Activity 3: Bakery Party Box",
      tagline: "School Celebration Order",
      desc: "At Sweet Treats Bakery, each party box contains x glazed donuts and 4 frosted cupcakes. The teacher orders 3 identical party boxes for the class celebration!",
      icon: "🧁",
      propType: "bakery",
      sentence: [
        { t: "The teacher orders " },
        { t: "3 times", op: "3 ×", means: "multiply the whole box by 3" },
        { t: " the sum of " },
        { t: "x donuts and 4 cupcakes", op: "(x + 4)", means: "group the box contents with brackets!" },
        { t: "." }
      ],
      variable: "x",
      tiles: ["3", "(", "x", "+", "4", ")", "×", "−", "12"],
      target: "3*(x+4)",
      answerLabel: "3(x + 4)",
      testLabel: "Total Pastries Packed",
      unit: "pastries",
      money: false,
      defaultVal: 6,
      minVal: 2,
      maxVal: 12,
      hint: "'Sum of x and 4' is (x + 4). 3 whole boxes means 3 × (x + 4) = 3(x + 4).",
      realWorldStory: "If each box has 6 donuts, each box has 6 + 4 = 10 treats. 3 boxes pack 3 × 10 = 30 fresh pastries!"
    }
  ],
  2: [
    {
      id: 1,
      title: "Activity 1: The $84 Movie Night Mystery",
      tagline: "Core Story Mystery (Wonder Phase & Story Slide 2, 5)",
      desc: "Leo, Emma, and Alex spent $84 at the cinema. Leo spent $x. Emma spent twice as much (2x), and Alex spent $4 more than Emma (2x + 4). Keep the scale level to find Leo's spending!",
      icon: "🎬",
      theme: "cinema",
      choices: [
        { eq: "x + 2x + 4 = 84", why: "Alex spent $4 more than Emma (2x), not just $4 alone!" },
        { eq: "x + 2x + (2x + 4) = 84", ok: true },
        { eq: "x + 2x + (x + 4) = 84", why: "Alex spent $4 more than Emma's 2x, not Leo's x!" }
      ],
      collected: "5x + 4 = 84",
      a: 5, b: 4, c: 84, x: 16,
      subOptions: [84, 4, 5],
      divOptions: [80, 4, 5],
      leftBags: 5,
      bagName: "x-Wallet",
      leftConstLabel: "$4 Booking Fee",
      rightLabelText: "$84 Receipt",
      unit: "$",
      characterNotes: "Leo: $x · Emma: $2x · Alex: $2x + $4",
      step1Story: "Leo ($x) + Emma ($2x) + Alex ($2x + $4) = $84 total cinema spending.",
      step2Story: "5 mystery wallets + $4 booking fee = $84 on the cinema ticket receipt.",
      step3Story: "Subtract $4 booking fee from BOTH pans → 5 wallets = $80.",
      step4Story: "Divide $80 equally among 5 wallets → $16 per wallet!",
      answer: "Leo spent $16! Emma spent $32 (2 × 16), Alex spent $36 (32 + 4). 16 + 32 + 36 = $84 ✓ Case cracked!"
    },
    {
      id: 2,
      title: "Activity 2: Artisanal Gelato Food Truck",
      tagline: "Summer Food Truck Order",
      desc: "Maya visits the Summer Gelato Truck. She orders 3 waffle cones of gelato (each cone costs $g) plus a $5 souvenir insulated freezer bag. Her total receipt is $26. Find the cone price!",
      icon: "🍦",
      theme: "gelato",
      choices: [
        { eq: "5g + 3 = 26", why: "There are 3 gelato cones ($g), not 5 cones!" },
        { eq: "3(g + 5) = 26", why: "Maya bought only ONE $5 cooler bag, not one per cone!" },
        { eq: "3g + 5 = 26", ok: true }
      ],
      collected: null,
      a: 3, b: 5, c: 26, x: 7,
      subOptions: [26, 5, 3],
      divOptions: [21, 5, 3],
      leftBags: 3,
      bagName: "g-Cone",
      leftConstLabel: "$5 Cooler Bag",
      rightLabelText: "$26 Food Truck Bill",
      unit: "$",
      characterNotes: "3 Gelato Cones ($g) + $5 Insulated Bag",
      step1Story: "3 gelato cones ($g) + $5 cooler bag = $26 food truck receipt.",
      step2Story: null,
      step3Story: "Subtract $5 cooler bag from BOTH pans → 3 gelato cones = $21.",
      step4Story: "Divide $21 equally by 3 cones → $7 per cone!",
      answer: "One artisanal gelato cone costs $7! 3 × $7 + $5 = $21 + $5 = $26 ✓ Exactly matches the receipt!"
    },
    {
      id: 3,
      title: "Activity 3: City Green Scooter Rental",
      tagline: "Transit App Travel Puzzle",
      desc: "Ethan rents a city electric scooter. The rental app charges a $6 unlock safety fee plus $3 for every half-hour ride block (h). Ethan's trip receipt is $24. How many half-hours did he ride?",
      icon: "🛴",
      theme: "scooter",
      choices: [
        { eq: "6h + 3 = 24", why: "The $3 rate is charged PER half-hour, so 3 multiplies h!" },
        { eq: "3h + 6 = 24", ok: true },
        { eq: "3(h + 6) = 24", why: "The $6 unlock fee is charged once at the start, not multiplied!" }
      ],
      collected: null,
      a: 3, b: 6, c: 24, x: 6,
      subOptions: [24, 6, 3],
      divOptions: [18, 6, 3],
      leftBags: 3,
      bagName: "h-Ride",
      leftConstLabel: "$6 Unlock Fee",
      rightLabelText: "$24 App Charge",
      unit: "half-hours",
      characterNotes: "$3 per half-hour (h) + $6 unlock deposit",
      step1Story: "3 half-hour ride tokens ($h) + $6 unlock fee = $24 transit charge.",
      step2Story: null,
      step3Story: "Subtract $6 unlock fee from BOTH pans → 3 ride tokens = $18.",
      step4Story: "Divide $18 by 3 ride tokens → h = 6 half-hours (3 full hours)!",
      answer: "Ethan rode for 6 half-hours (3 full hours)! 3 × 6 + 6 = 18 + 6 = $24 ✓ Exactly matches the trip meter!"
    }
  ],
  3: [
    {
      id: 1,
      title: "Activity 1: School Pizza Party Change",
      tagline: "Story Step 4: Bill & Change Context",
      desc: "Harper buys 3 large pizzas for the classroom celebration. She pays with a crisp $50 note and gets $8 in change. Tap the line with the algebra mistake!",
      icon: "🍕",
      artifactType: "pizza",
      artifactTitle: "Luigi's Pizzeria Order Slip #104",
      lines: [
        "Let p be the price of one pizza in dollars.",
        "Total cost of 3 pizzas = 3p",
        "3p − 50 = 8",
        "3p = 58",
        "p = 19.333…"
      ],
      errorIdx: 2,
      fixOptions: [
        "50 − 3p = 8",
        "3p + 50 = 8",
        "50 + 3p = 8"
      ],
      fixCorrect: 0,
      fixedLines: [
        "Let p be the price of one pizza in dollars.",
        "Total cost of 3 pizzas = 3p",
        "50 − 3p = 8",
        "3p = 42",
        "p = 14"
      ],
      why: "Change = (Money Paid) − (Money Spent). It must be 50 − 3p, NOT 3p − 50!",
      redFlag: "A pizza costing $19.333… with endless cents? And 3 × $19.33 = $58, which is MORE than Harper had! She gave the cashier $50, so she couldn't get change if the bill was $58!",
      verify: "3 pizzas × $14 = $42. Harper pays $50, gets $50 − $42 = $8 change ✓ One pizza costs $14!",
      hint: "Change is what's LEFT OVER from the $50 after paying. The starting cash ($50) must come first!"
    },
    {
      id: 2,
      title: "Activity 2: Family Birthday Age Puzzle",
      tagline: "Directly from Story Slide 7 (Age Puzzles)",
      desc: "Maya is 5 years younger than her older brother Liam. The sum of their ages is 27 years. Tap the line with the algebra mistake!",
      icon: "🎂",
      artifactType: "birthday",
      artifactTitle: "Maya & Liam's Birthday Card Note",
      lines: [
        "Let m be Maya's age in years.",
        "Liam's age = m + 5",
        "m + (m + 5) = 27",
        "2m + 5 = 27",
        "2m = 32",
        "m = 16"
      ],
      errorIdx: 4,
      fixOptions: [
        "2m = 27 − 5 = 22",
        "2m = 27 ÷ 5",
        "2m = 32 ÷ 2"
      ],
      fixCorrect: 0,
      fixedLines: [
        "Let m be Maya's age in years.",
        "Liam's age = m + 5",
        "m + (m + 5) = 27",
        "2m + 5 = 27",
        "2m = 22",
        "m = 11"
      ],
      why: "To undo + 5, you must SUBTRACT 5 from both sides (27 − 5 = 22), not add 5!",
      redFlag: "If Maya were 16, Liam would be 16 + 5 = 21. Their ages would total 16 + 21 = 37 years, not 27! The numbers broke the story!",
      verify: "Maya is 11 years old. Liam is 11 + 5 = 16 years old. 11 + 16 = 27 years ✓ Checked!",
      hint: "Check Line 5: when moving + 5 across the equal sign, did the student use the inverse operation?"
    },
    {
      id: 3,
      title: "Activity 3: Charity Walkathon Lap Pledge",
      tagline: "School Track Event",
      desc: "Jordan walks laps for a charity fundraiser. His sponsor pledges a flat $10 gift plus $4 for every lap completed. Jordan raises $38. Tap the mistake!",
      icon: "👟",
      artifactType: "walkathon",
      artifactTitle: "Charity Track Sponsor Pledge Card",
      lines: [
        "Let L be the number of laps walked.",
        "Total raised = 4L + 10",
        "4L + 10 = 38",
        "4L = 28",
        "L = 28 − 4 = 24"
      ],
      errorIdx: 4,
      fixOptions: [
        "L = 28 ÷ 4 = 7",
        "L = 28 + 4 = 32",
        "L = 28 × 4 = 112"
      ],
      fixCorrect: 0,
      fixedLines: [
        "Let L be the number of laps walked.",
        "Total raised = 4L + 10",
        "4L + 10 = 38",
        "4L = 28",
        "L = 28 ÷ 4 = 7"
      ],
      why: "4L means 4 × L. The inverse of multiplication is DIVISION, so divide both sides by 4!",
      redFlag: "24 laps around a 400m track is nearly 10 kilometers! That would take hours, and 24 laps would raise 4 × 24 + 10 = $106, not $38!",
      verify: "Jordan walked 7 laps. 4 × 7 + 10 = 28 + 10 = $38 raised ✓ Ready for the charity medal!",
      hint: "Line 5: In 4L = 28, how are 4 and L joined? Which inverse operation undoes multiplication?"
    }
  ]
};

/* ---------- Expression helpers for the Keyword Decoder ---------- */
const isNum = t => /^\d+$/.test(t);
const isVar = t => /^[xc]$/.test(t);

function tokensToText(tokens) {
  let out = '';
  tokens.forEach((t, i) => {
    const prev = tokens[i - 1];
    const tight = i === 0 || prev === '(' || t === ')' ||
      ((isNum(prev) || isVar(prev) || prev === ')') && (isVar(t) || t === '('));
    out += (tight ? '' : ' ') + t;
  });
  return out;
}

function tokensToJs(tokens) {
  let out = '';
  tokens.forEach((t, i) => {
    const prev = tokens[i - 1];
    if (i > 0 && (isNum(prev) || isVar(prev) || prev === ')') && (isVar(t) || t === '(')) {
      out += '*';
    }
    out += t === '×' ? '*' : t === '÷' ? '/' : t === '−' ? '-' : t;
  });
  return out;
}

function evalExpr(js, val) {
  try {
    const safeJs = js.replace(/[xc]/g, `(${val})`);
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict"; return (${safeJs});`)();
    return Number.isFinite(v) ? v : NaN;
  } catch (e) {
    return NaN;
  }
}

function sameExpr(js, target) {
  return [2, 7, 13].every(v => {
    const a = evalExpr(js, v);
    const b = evalExpr(target, v);
    return !Number.isNaN(a) && Math.abs(a - b) < 1e-9;
  });
}

const fmtNum = v => (Number.isInteger(v) ? `${v}` : `${Number(v.toFixed(2))}`);

/* =========================================================================
   REAL-WORLD VISUAL PROPS (TICKET STUB, CONCESSION SCREEN, BAKERY BOX)
   ========================================================================= */

function RealWorldPropVisualizer({ activity, testVal, calculatedVal }) {
  if (activity.propType === 'ticket') {
    const adultPrice = testVal + 12;
    const adultTotal = 2 * adultPrice;
    const childTotal = 3 * testVal;
    const grandTotal = adultTotal + childTotal;

    return (
      <div className="w-full bg-gradient-to-r from-[#180b33] to-[#25104d] border-2 border-amber-400/50 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center gap-4">
        {/* Physical Ticket Stub */}
        <div className="relative bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 text-slate-950 rounded-xl p-3.5 shadow-lg border-dashed border-2 border-amber-600/70 w-full md:w-56 shrink-0 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between border-b border-amber-900/30 pb-1.5">
            <span className="text-[10px] font-900 uppercase tracking-wider text-amber-950 flex items-center gap-1">
              <span>🎟️</span> CITY SOUNDS ARENA
            </span>
            <span className="text-[9px] font-black bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-700/30">VIP PASS</span>
          </div>
          <div className="py-2">
            <p className="font-display font-900 text-sm leading-tight text-slate-900">WORLD TOUR LIVE</p>
            <p className="text-[11px] font-bold text-slate-700">Row B · Seats 14–18</p>
            <div className="mt-2 flex items-center justify-between text-xs font-900 bg-amber-400/40 p-1.5 rounded-lg border border-amber-500/40">
              <span>Child: <strong className="text-amber-950">${testVal}</strong></span>
              <span>Adult: <strong className="text-purple-900">${adultPrice}</strong></span>
            </div>
          </div>
          <div className="border-t border-dashed border-amber-900/40 pt-1.5 flex items-center justify-between text-[9px] font-mono tracking-tighter text-slate-700">
            <span>||||| |||| |||||| ||</span>
            <span>#8492-CS</span>
          </div>
        </div>

        {/* Live Thermal Receipt Calculation */}
        <div className="flex-1 bg-black/50 border border-purple-400/30 rounded-xl p-3 text-left font-mono text-xs text-slate-200 w-full">
          <div className="flex items-center justify-between border-b border-white/20 pb-1 mb-1.5 text-amber-300 font-bold">
            <span>🧾 BOX OFFICE PRINT-OUT</span>
            <span>c = ${testVal}</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>2× Adult VIP (c + $12 = ${adultPrice}):</span>
              <span className="font-bold text-amber-200">${adultTotal}.00</span>
            </div>
            <div className="flex justify-between">
              <span>3× Child General (3 × ${testVal}):</span>
              <span className="font-bold text-cyan-200">${childTotal}.00</span>
            </div>
            <div className="flex justify-between border-t border-white/20 pt-1 font-bold text-sm text-emerald-300">
              <span>TOTAL BILLED:</span>
              <span>${grandTotal}.00</span>
            </div>
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400 font-sans italic">
            ✨ {activity.realWorldStory}
          </p>
        </div>
      </div>
    );
  }

  if (activity.propType === 'cinema') {
    const megaPrice = 2 * testVal + 3;
    const totalOrder = testVal + megaPrice;

    return (
      <div className="w-full bg-gradient-to-r from-[#180a30] to-[#2c0e44] border-2 border-cyan-400/50 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center gap-4">
        {/* Cinema Popcorn Graphics */}
        <div className="flex items-center gap-3 bg-black/40 border border-cyan-400/30 rounded-xl p-3 w-full md:w-56 shrink-0 justify-center">
          <div className="text-4xl filter drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]">🍿</div>
          <div className="text-left">
            <span className="text-[10px] font-900 uppercase text-amber-400 tracking-wider">CINEMA CONCESSION</span>
            <p className="text-xs font-bold text-white">Small Popcorn: <strong className="text-amber-300">${testVal}</strong></p>
            <p className="text-xs font-black text-cyan-300">Mega Tub: <strong>${megaPrice}</strong></p>
          </div>
        </div>

        {/* Glowing Cash Register Display */}
        <div className="flex-1 bg-[#091b15] border-2 border-emerald-500/60 rounded-xl p-3 font-mono text-left w-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <div className="flex items-center justify-between text-emerald-400 text-xs border-b border-emerald-500/30 pb-1 mb-1.5">
            <span>📟 CASH REGISTER #4</span>
            <span className="animate-pulse">● LIVE</span>
          </div>
          <div className="space-y-1 text-xs text-emerald-200">
            <div className="flex justify-between">
              <span>Small Popcorn (x):</span>
              <span>${testVal}.00</span>
            </div>
            <div className="flex justify-between">
              <span>Mega Tub (2x + 3):</span>
              <span className="font-bold text-amber-300">${megaPrice}.00</span>
            </div>
            <div className="flex justify-between border-t border-emerald-500/30 pt-1 text-sm font-black text-emerald-400">
              <span>TOTAL ORDER:</span>
              <span>${totalOrder}.00</span>
            </div>
          </div>
          <p className="mt-1 text-[10px] font-sans text-emerald-300/80 italic">
            ✨ {activity.realWorldStory}
          </p>
        </div>
      </div>
    );
  }

  // Bakery Box Prop
  const treatsPerBox = testVal + 4;
  const totalTreats = 3 * treatsPerBox;

  return (
    <div className="w-full bg-gradient-to-r from-[#240b2a] to-[#3a1135] border-2 border-pink-400/50 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center gap-4">
      {/* Bakery Window Box */}
      <div className="bg-gradient-to-b from-pink-950 to-pink-900 border-2 border-pink-300/60 rounded-xl p-3 w-full md:w-56 shrink-0 text-center shadow-lg">
        <div className="text-[10px] font-black tracking-wider text-pink-300 border-b border-pink-400/30 pb-1 mb-1.5 flex items-center justify-center gap-1.5">
          <span>🧁</span> SWEET TREATS BAKERY
        </div>
        <div className="flex items-center justify-center gap-2 py-1 text-2xl">
          <span title="Glazed Donuts">🍩 × {testVal}</span>
          <span className="text-pink-300 font-bold">+</span>
          <span title="Cupcakes">🧁 × 4</span>
        </div>
        <p className="text-[11px] font-bold text-pink-200 mt-1">1 Box = {treatsPerBox} Pastries</p>
      </div>

      {/* Bakery Order Slip */}
      <div className="flex-1 bg-black/40 border border-pink-400/30 rounded-xl p-3 font-mono text-left text-xs text-pink-100 w-full">
        <div className="flex items-center justify-between border-b border-pink-500/30 pb-1 mb-1.5 text-pink-300 font-bold">
          <span>📋 CLASS PARTY ORDER SLIP</span>
          <span>x = {testVal} donuts</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Contents per Box (x + 4):</span>
            <span className="font-bold">{treatsPerBox} treats</span>
          </div>
          <div className="flex justify-between">
            <span>Boxes Ordered:</span>
            <span>3 identical boxes</span>
          </div>
          <div className="flex justify-between border-t border-pink-500/30 pt-1 text-sm font-black text-amber-300">
            <span>TOTAL PASTRIES BAKED:</span>
            <span>{totalTreats} pastries</span>
          </div>
        </div>
        <p className="mt-1 text-[10px] font-sans text-pink-200/80 italic">
          ✨ {activity.realWorldStory}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   ENHANCED REAL-WORLD BALANCE SCALE WITH PHYSICAL BUBBLE LEVEL GAUGE
   ========================================================================= */

function BalanceScale({ bags, leftConst, rightLabel, tilt, bagLabel = 'x', theme = 'cinema', constLabel = '+4' }) {
  const L = 135;
  const rad = (tilt * Math.PI) / 180;
  const left = { x: 180 - L * Math.cos(rad), y: 62 - L * Math.sin(rad) };
  const right = { x: 180 + L * Math.cos(rad), y: 62 + L * Math.sin(rad) };

  // Arrange bags on left pan
  const bagSpots = [...Array(Math.min(bags, 5))].map((_, i) => {
    const n = Math.min(bags, 5);
    return { x: (i - (n - 1) / 2) * 22, y: -16 };
  });

  // Spirit bubble offset (-15 to +15)
  const bubbleOffset = Math.max(-18, Math.min(18, tilt * 1.5));
  const isLevel = tilt === 0;

  return (
    <div className="flex flex-col items-center w-full max-w-[340px]">
      <svg viewBox="0 0 360 215" className="w-full h-auto drop-shadow-[0_0_24px_rgba(56,189,248,0.5)]">
        {/* Stand Pillar & Heavy Base */}
        <polygon points="180,62 148,198 212,198" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
        <rect x="110" y="194" width="140" height="12" rx="6" fill="#312e81" stroke="#a5b4fc" strokeWidth="1.5" />
        <circle cx="180" cy="180" r="4" fill="#fbbf24" />

        {/* Central Spirit Bubble Level Gauge */}
        <g transform="translate(145, 42)">
          <rect x="0" y="0" width="70" height="15" rx="7.5" fill="#032b1f" stroke={isLevel ? '#10b981' : '#f59e0b'} strokeWidth="1.8" />
          {/* Centering tick lines */}
          <line x1="30" y1="2" x2="30" y2="13" stroke="#34d399" strokeWidth="1" strokeDasharray="1 1" />
          <line x1="40" y1="2" x2="40" y2="13" stroke="#34d399" strokeWidth="1" strokeDasharray="1 1" />
          {/* Floating Bubble */}
          <circle cx={35 + bubbleOffset} cy="7.5" r="4.5" fill={isLevel ? '#34d399' : '#fbbf24'} />
        </g>

        {/* Beam */}
        <line
          x1={left.x}
          y1={left.y}
          x2={right.x}
          y2={right.y}
          stroke="#facc15"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
        {/* Brass Center Pivot */}
        <circle cx="180" cy="62" r="10" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
        <circle cx="180" cy="62" r="4" fill="#fef3c7" />

        {/* Left Pan (Chains + Bowl) */}
        <g style={{ transform: `translate(${left.x}px, ${left.y}px)`, transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <line x1="-36" y1="66" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />
          <line x1="36" y1="66" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />
          <path d="M -50 66 Q 0 88 50 66 Z" fill="url(#panGrad)" stroke="#38bdf8" strokeWidth="2" />

          {/* Bags / Item Tokens on Left Pan */}
          <g transform={`translate(${leftConst ? -14 : 0}, 64)`}>
            {bagSpots.map((p, i) => (
              <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                {/* Leather pouch with gold clasp */}
                <path d="M -9 -2 Q -11 -18 -4 -20 L 4 -20 Q 11 -18 9 -2 Q 0 2 -9 -2 Z" fill="#92400e" stroke="#fcd34d" strokeWidth="1.5" />
                <rect x="-4" y="-23" width="8" height="4" rx="2" fill="#fbbf24" />
                <text x="0" y="-7" fill="#fef3c7" fontSize="10" fontWeight="900" textAnchor="middle">{bagLabel}</text>
              </g>
            ))}
            {bags > 5 && (
              <text x="0" y="-45" fill="#fde68a" fontSize="12" fontWeight="900" textAnchor="middle">×{bags}</text>
            )}
          </g>

          {/* Left Constant: 3D Stack of Gold Coins */}
          {leftConst != null && (
            <g transform="translate(30, 44)" className="fade-in-up">
              {/* Stacked coins */}
              <ellipse cx="0" cy="18" rx="14" ry="4" fill="#b45309" />
              <ellipse cx="0" cy="15" rx="14" ry="4" fill="#d97706" />
              <ellipse cx="0" cy="12" rx="14" ry="4" fill="#f59e0b" />
              <ellipse cx="0" cy="9" rx="14" ry="4" fill="#fbbf24" stroke="#fef08a" strokeWidth="1" />
              <rect x="-16" y="-12" width="32" height="18" rx="4" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" />
              <text x="0" y="0" fill="#ffffff" fontSize="10" fontWeight="900" textAnchor="middle">+{leftConst}</text>
            </g>
          )}
        </g>

        {/* Right Pan (Chains + Bowl) */}
        <g style={{ transform: `translate(${right.x}px, ${right.y}px)`, transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <line x1="-36" y1="66" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />
          <line x1="36" y1="66" x2="0" y2="0" stroke="#94a3b8" strokeWidth="2" />
          <path d="M -50 66 Q 0 88 50 66 Z" fill="url(#panGrad)" stroke="#38bdf8" strokeWidth="2" />

          {/* Cash Bills / Receipt Total on Right Pan */}
          <g transform="translate(0, 36)">
            {/* Stack of green money notes */}
            <rect x="-24" y="6" width="48" height="24" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
            <rect x="-22" y="3" width="44" height="24" rx="4" fill="#047857" stroke="#6ee7b7" strokeWidth="1" />
            <rect x="-20" y="0" width="40" height="24" rx="4" fill="#10b981" stroke="#a7f3d0" strokeWidth="1.5" />
            <text x="0" y="16" fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">{rightLabel}</text>
          </g>
        </g>

        {/* SVG Gradients */}
        <defs>
          <linearGradient id="panGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Spirit Level Text Pill */}
      <div className={`mt-1 text-xs font-900 px-3 py-0.5 rounded-full border flex items-center gap-1.5 transition-colors ${
        isLevel
          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
          : 'bg-amber-950/80 border-amber-400 text-amber-300 animate-pulse'
      }`}>
        <span>{isLevel ? '⚖️' : '⚠️'}</span>
        <span>{isLevel ? 'Scale is Perfectly Balanced!' : 'Scale is Tilted — Keep Both Sides Equal!'}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   STATION 3: SPIRAL DETECTIVE NOTEBOOK WITH REALITY CHECK ALERT
   ========================================================================= */

function DetectiveNotebook({ activity, stage, pickLine, pickFix, shakeLine, showHint, toggleHint, onVerify }) {
  const isFixedPhase = stage === 'verify' || stage === 'done';
  const displayLines = isFixedPhase ? activity.fixedLines : activity.lines;

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Notebook with Spiral Rings & Graph Paper Background */}
      <div className="w-full relative bg-[#0b0420] border-2 border-purple-400/40 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row gap-4 items-stretch overflow-hidden">
        {/* Left Spiral Rings Graphic */}
        <div className="hidden sm:flex flex-col justify-around py-2 w-4 shrink-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-5 h-2.5 rounded-full bg-slate-300 border border-slate-600 -ml-2 shadow-sm" />
          ))}
        </div>

        {/* Solution Paper Content */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Header with Artifact Tag */}
          <div className="flex items-center justify-between border-b border-purple-400/20 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📓</span>
              <span className="text-xs font-900 text-purple-200 uppercase tracking-wider">
                Student Case Notes — {stage === 'find' ? 'Tap the wrong line!' : stage === 'fix' ? 'Choose the fix below' : 'Mistake corrected!'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
              {activity.artifactTitle}
            </span>
          </div>

          {/* Solution Lines */}
          <div className="flex flex-col gap-1.5 py-1">
            {displayLines.map((line, i) => {
              const isError = stage === 'fix' && i === activity.errorIdx;
              const isChanged = isFixedPhase && i >= activity.errorIdx && line !== activity.lines[i];

              return (
                <button
                  key={i}
                  disabled={stage !== 'find'}
                  onClick={() => pickLine(i)}
                  className={`text-left font-mono font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl border-2 transition duration-200 flex items-center justify-between ${
                    stage === 'find'
                      ? 'cursor-pointer hover:border-amber-400/70 hover:bg-amber-400/10'
                      : 'cursor-default'
                  } ${shakeLine === i ? 'animate-shake border-rose-400 bg-rose-950/60' : ''} ${
                    isError
                      ? 'border-rose-400 bg-rose-950/80 text-rose-200 line-through decoration-2'
                      : isChanged
                      ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 fade-in-up'
                      : 'border-white/10 bg-white/5 text-slate-100'
                  }`}
                >
                  <div>
                    <span className="text-slate-400 mr-2.5 font-black">{i + 1}.</span>
                    <span>{line}</span>
                  </div>
                  <div>
                    {isError && <span className="text-rose-400 font-sans font-black text-xs">❌ Mistake</span>}
                    {isChanged && <span className="text-emerald-400 font-sans font-black text-xs">✅ Fixed</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detective Magnifier Status Side Box */}
        <div className="w-full md:w-48 bg-[#14082c] border border-cyan-400/30 rounded-xl p-3 flex flex-col items-center justify-center text-center shrink-0">
          <span className={`text-4xl mb-1.5 ${stage === 'find' ? 'animate-bounce' : ''}`}>
            {stage === 'find' ? '🔍' : stage === 'fix' ? '🛠️' : stage === 'verify' ? '🧮' : '🏅'}
          </span>
          <span className="text-xs font-900 text-cyan-200 leading-snug">
            {stage === 'find' && 'Step 1: Find the line that broke the rule'}
            {stage === 'fix' && 'Step 2: Choose the inverse operation'}
            {stage === 'verify' && 'Step 3: Substitute & verify in story'}
            {stage === 'done' && 'Case closed! Verified!'}
          </span>
        </div>
      </div>

      {/* REALITY CHECK ALERT (Why the student's mistake makes zero sense in real life) */}
      {(stage === 'fix' || stage === 'verify' || stage === 'done') && (
        <div className="w-full bg-rose-950/90 border-2 border-rose-400/60 rounded-2xl p-3 sm:p-4 text-left shadow-lg fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🚨</span>
            <span className="text-xs font-900 text-rose-300 uppercase tracking-wider">
              REALITY CHECK: Why the student's answer failed in real life
            </span>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 font-bold leading-relaxed">
            {activity.redFlag}
          </p>
        </div>
      )}

      {/* Step 2: Choose Fix Options */}
      {stage === 'fix' && (
        <div className="w-full flex flex-col items-center gap-2.5 fade-in-up">
          <span className="text-sm font-900 text-amber-300">
            Line {activity.errorIdx + 1} should be corrected to:
          </span>
          <div className="flex flex-wrap justify-center gap-2.5 w-full">
            {activity.fixOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => pickFix(i)}
                className="py-2.5 px-5 rounded-xl bg-[#170a33] border-2 border-purple-400/50 text-white font-mono font-bold text-sm sm:text-base hover:border-cyan-400 hover:bg-[#230f4e] transition cursor-pointer shadow-lg hover:scale-105"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Substitute & Verify Button */}
      {stage === 'verify' && (
        <div className="w-full flex justify-center fade-in-up">
          <button
            onClick={onVerify}
            className="btn-gold font-display font-900 text-sm sm:text-base px-8 py-3.5 shadow-[0_0_25px_rgba(250,204,21,0.7)] hover:scale-105 transition cursor-pointer flex items-center gap-2"
          >
            <span>🧮 Substitute Back & Verify in Story</span>
            <span>✨</span>
          </button>
        </div>
      )}

      {/* Hint toggle */}
      {stage !== 'done' && (
        <div className="flex flex-col items-center gap-2 w-full">
          <button
            onClick={toggleHint}
            className="text-xs font-900 text-purple-300 hover:text-purple-200 underline cursor-pointer"
          >
            {showHint ? 'Hide Detective Hint' : '💡 Need a Detective Hint?'}
          </button>
          {showHint && (
            <div className="p-3 bg-amber-950/90 border border-amber-400/50 text-amber-200 rounded-xl text-xs sm:text-sm font-bold text-center w-full max-w-xl fade-in-up">
              💡 {activity.hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   MAIN SIMULATE PHASE COMPONENT
   ========================================================================= */

export function SimulatePhase({ muted, onNext }) {
  const [station, setStation] = useState(1);
  const [actIdx, setActIdx] = useState(0);

  // Station 1: Keyword Decoder
  const [revealed, setRevealed] = useState([]);
  const [built, setBuilt] = useState([]);
  const [decoded, setDecoded] = useState(false);
  const [testVal, setTestVal] = useState(13);

  // Station 2: Balance Builder
  const [stage, setStage] = useState('choose');
  const [wrongChoice, setWrongChoice] = useState(null);
  const [tilt, setTilt] = useState(0);

  // Station 3: Error Detective
  const [detStage, setDetStage] = useState('find');
  const [shakeLine, setShakeLine] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Shared Feedback
  const [feedback, setFeedback] = useState(null);

  const currentActivity = STATION_ACTIVITIES[station][actIdx];

  // Reset station state on switch & play on-screen activity guidance
  useEffect(() => {
    stopNarration();
    setRevealed([]);
    setBuilt([]);
    setDecoded(false);
    setTestVal(currentActivity.defaultVal || 5);
    setStage('choose');
    setWrongChoice(null);
    setTilt(0);
    setDetStage('find');
    setShakeLine(null);
    setShowHint(false);
    setFeedback(null);

    const specificKey = `sim_s${station}_a${actIdx + 1}_guide`;
    const fallbackKey = `sim_${station}`;
    const audioSeg = AUDIO_MAP[specificKey] || AUDIO_MAP[fallbackKey];
    if (audioSeg) narrate(audioSeg, !muted);

    return () => {
      stopNarration();
    };
  }, [station, actIdx, muted]);

  const success = (text) => {
    setFeedback({ success: true, text });
    narrate(AUDIO_MAP.sim_success, !muted);
    confetti({ particleCount: 75, spread: 65, origin: { y: 0.65 } });
  };

  const retry = (text) => {
    setFeedback({ success: false, text });
    narrate(AUDIO_MAP.sim_retry, !muted);
  };

  /* ---------------- Station 1 Handlers ---------------- */
  const clueCount = currentActivity.sentence ? currentActivity.sentence.filter(p => p.op).length : 0;
  const builtTokens = built.map(i => currentActivity.tiles?.[i]);

  const handleDecodeCheck = () => {
    if (!built.length) return;
    const js = tokensToJs(builtTokens);
    if (sameExpr(js, currentActivity.target)) {
      setDecoded(true);
      success(`🎉 Expression Cracker Success! "${currentActivity.answerLabel}" matches the story clues. Now test it with different values below!`);
    } else {
      retry(`Not quite! ${tokensToText(builtTokens)} doesn't match the clues. 💡 ${currentActivity.hint}`);
    }
  };

  /* ---------------- Station 2 Handlers ---------------- */
  const s2 = currentActivity;

  const chooseEquation = (idx) => {
    if (stage !== 'choose') return;
    const c = s2.choices[idx];
    if (c.ok) {
      setWrongChoice(null);
      setStage(s2.collected ? 'collect' : 'subtract');
      setFeedback({ success: true, text: `✅ ${c.eq} matches the story! Let's solve it on the balance scale.` });
    } else {
      setWrongChoice(idx);
      retry(`🤔 ${c.why}`);
    }
  };

  const doCollect = () => {
    setStage('subtract');
    setFeedback({ success: true, text: `🧹 Expanded brackets & collected like terms: ${s2.collected}. Notice both pans remain balanced!` });
  };

  const tryOperation = (val, kind) => {
    const isSub = kind === 'sub';
    const correct = isSub ? val === s2.b : val === s2.a;

    if (correct) {
      setTilt(0);
      if (isSub) {
        setStage('divide');
        setFeedback({ success: true, text: `⚖️ Subtracted ${s2.b} from BOTH pans → ${s2.a}${s2.bagName.charAt(0)} = ${s2.c - s2.b}. Scale remains level!` });
      } else {
        setStage('done');
        success(`🎉 Divided BOTH pans by ${s2.a} → ${s2.bagName.charAt(0)} = ${s2.x}. ${s2.answer}`);
      }
    } else {
      setTilt(isSub ? 12 : -12);
      retry(isSub
        ? `⚠️ Subtracting ${val} won't isolate the bags! What number was added to the bags on the left?`
        : `⚠️ Dividing by ${val} won't isolate ONE single bag! How many bags are on the left?`);
      setTimeout(() => setTilt(0), 900);
    }
  };

  /* ---------------- Station 3 Handlers ---------------- */
  const s3 = currentActivity;

  const pickLine = (idx) => {
    if (detStage !== 'find') return;
    if (idx === s3.errorIdx) {
      setDetStage('fix');
      setFeedback({ success: true, text: `🔍 Caught! Mistake spotted on line ${idx + 1}! ${s3.why}` });
    } else {
      setShakeLine(idx);
      setTimeout(() => setShakeLine(null), 450);
      retry(`Line ${idx + 1} is algebraically correct — keep investigating!`);
    }
  };

  const pickFix = (idx) => {
    if (detStage !== 'fix') return;
    if (idx === s3.fixCorrect) {
      setDetStage('verify');
      setFeedback({ success: true, text: `🛠️ Fixed! The correct step is shown in green. Now substitute back and check the story.` });
    } else {
      retry(`That fix doesn't keep the equation true. Think about the inverse operation!`);
    }
  };

  const verifyAnswer = () => {
    setDetStage('done');
    success(`✅ ${s3.verify}`);
  };

  const nextActivity = () => {
    stopNarration();
    if (actIdx < 2) {
      setActIdx(i => i + 1);
    } else if (station < 3) {
      setStation(s => s + 1);
      setActIdx(0);
    } else {
      onNext();
    }
  };

  const prevActivity = () => {
    stopNarration();
    if (actIdx > 0) {
      setActIdx(i => i - 1);
    } else if (station > 1) {
      setStation(s => s - 1);
      setActIdx(2);
    }
  };

  const stations = [
    { n: 1, icon: '🔎', name: 'Station 1: Keyword Decoder', sub: 'Words → Real-world algebra' },
    { n: 2, icon: '⚖️', name: 'Station 2: Balance Builder', sub: 'Solve step-by-step on scale' },
    { n: 3, icon: '🕵️', name: 'Station 3: Error Detective', sub: 'Spot trap, fix & reality check' }
  ];

  // Derived balance visual state
  const bagsShown = stage === 'done' ? 1 : s2.a;
  const leftConstShown = stage === 'choose' || stage === 'collect' || stage === 'subtract' ? s2.b : null;
  const rightShown = stage === 'done' ? `${s2.unit === '$' ? '$' : ''}${s2.x}` : stage === 'divide' ? `${s2.unit === '$' ? '$' : ''}${s2.c - s2.b}` : `${s2.unit === '$' ? '$' : ''}${s2.c}`;

  const calculatedVal = useMemo(
    () => (station === 1 ? evalExpr(currentActivity.target, testVal) : 0),
    [station, currentActivity, testVal]
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <BgSymbols />

      {/* Main Glass Simulation Card */}
      <div className="w-full max-w-6xl max-h-[94vh] bg-[#140a33]/95 border-2 border-purple-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center fade-in-up z-20 my-auto overflow-hidden">
        {/* Cyan Accent Bar */}
        <div className="w-24 h-2 bg-cyan-400 rounded-full mb-2 shadow-[0_0_18px_rgba(56,189,248,0.85)] shrink-0" />

        {/* Card Header Title */}
        <div className="flex items-center justify-between w-full border-b border-purple-400/20 pb-2.5 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">🧪</span>
            <div>
              <h2 className="font-display font-900 text-xl sm:text-2xl text-white leading-tight">
                Simulation Lab · Real-World Cases
              </h2>
              <p className="text-xs font-bold text-cyan-300">
                Grade 7 Real-World Problem Solving · 4-Step Detective Plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const specificKey = `sim_s${station}_a${actIdx + 1}_guide`;
                const fallbackKey = `sim_${station}`;
                const audioSeg = AUDIO_MAP[specificKey] || AUDIO_MAP[fallbackKey];
                if (audioSeg) narrate(audioSeg, !muted);
              }}
              title="Replay Guidance Audio"
              className="bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer transition shadow-md"
            >
              <span>🔊</span>
              <span>Listen</span>
            </button>
            <span className="font-display font-900 text-xs sm:text-sm text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full">
              Station {station} · Case {actIdx + 1}/3
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full items-stretch flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Station Sidebar Tabs & Roadmap */}
          <div className="md:col-span-4 flex flex-col justify-between gap-3 shrink-0">
            <div className="flex flex-col gap-2.5">
              {stations.map(st => (
                <button
                  key={st.n}
                  onClick={() => {
                    stopNarration();
                    setStation(st.n);
                    setActIdx(0);
                  }}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                    station === st.n
                      ? 'border-cyan-400 bg-[#1e2652] text-white shadow-[0_0_22px_rgba(56,189,248,0.4)] scale-[1.02]'
                      : 'border-purple-500/25 bg-[#12082b]/80 text-slate-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 ${
                      station === st.n ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/10 text-white'
                    }`}>
                      {st.icon}
                    </div>
                    <div>
                      <p className="font-display font-900 text-sm sm:text-base leading-tight">{st.name}</p>
                      <p className="text-xs font-bold text-slate-300 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                  <span className="text-xs">{station === st.n ? '📍' : '🔓'}</span>
                </button>
              ))}
            </div>

            {/* Story Alignment Detective Badge Card */}
            <div className="bg-[#12072b]/90 border border-amber-400/30 rounded-2xl p-3.5 text-left shadow-md shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">🦁</span>
                <span className="text-xs font-900 text-amber-300 uppercase tracking-wide">
                  Detective Strategy
                </span>
              </div>
              <p className="text-xs text-slate-200 font-extrabold leading-snug">
                {station === 1 && "Step 1 & 2: Define what the letter stands for, then translate clues into algebra tiles!"}
                {station === 2 && "Step 3: An equation is a balance scale — whatever you remove from one pan, remove from the other!"}
                {station === 3 && "Step 4: Check in context! If the answer gives weird decimals or impossible ages, hunt the mistake!"}
              </p>
            </div>

            {/* Jump to Practice CTA */}
            <button
              onClick={() => {
                stopNarration();
                onNext();
              }}
              className="btn-gold font-display font-900 text-sm sm:text-base py-3.5 px-5 shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:scale-105 transition w-full flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Go to Practice Phase</span>
              <span>→</span>
            </button>
          </div>

          {/* Right Column: Interactive Real-World Simulation Workstation */}
          <div className="md:col-span-8 bg-[#12072b]/95 border-2 border-purple-400/35 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-inner flex-1 min-h-0 overflow-hidden">
            <div className="flex flex-col flex-1 min-h-0 justify-between overflow-y-auto pr-1">
              {/* Header Title with Story Tagline */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/15 pb-2.5 mb-2.5 shrink-0 gap-2">
                <div>
                  <h3 className="font-display font-900 text-lg sm:text-xl text-cyan-300 flex items-center gap-2.5">
                    <span className="text-2xl sm:text-3xl">{currentActivity.icon}</span>
                    <span>{currentActivity.title}</span>
                  </h3>
                  <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1 mt-0.5">
                    <span>✨</span> {currentActivity.tagline}
                  </span>
                </div>
                <span className="font-display font-900 text-xs text-slate-200 bg-white/10 px-3 py-1 rounded-full border border-white/15 self-start sm:self-auto">
                  Case {actIdx + 1} of 3
                </span>
              </div>

              {/* Activity Description */}
              <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-extrabold mb-2.5 shrink-0">
                {currentActivity.desc}
              </p>

              {/* =========================================================================
                  STATION 1: KEYWORD DECODER & VISUAL EXPRESSION LAB
                  ========================================================================= */}
              {station === 1 && (
                <div className="flex flex-col items-center gap-3 bg-[#1a0e3a]/95 border-2 border-cyan-400/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex-1 min-h-0 justify-between">
                  {/* Clue sentence with clickable glowing words */}
                  <div className="w-full bg-[#100624] border border-cyan-400/30 rounded-xl p-3 shrink-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-900 text-cyan-300 uppercase tracking-wider">
                        🔎 Tap Glowing Clues to Reveal Algebra
                      </span>
                      <span className="text-xs font-900 text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                        Clues Found: {revealed.length}/{clueCount}
                      </span>
                    </div>

                    <p className="font-display font-900 text-base sm:text-lg text-white leading-relaxed">
                      {currentActivity.sentence.map((p, i) => p.op ? (
                        <button
                          key={i}
                          onClick={() => !revealed.includes(i) && setRevealed(r => [...r, i])}
                          className={`relative mx-0.5 px-2 py-0.5 rounded-lg border-2 transition cursor-pointer ${
                            revealed.includes(i)
                              ? 'bg-amber-400/20 border-amber-300 text-amber-200'
                              : 'bg-cyan-400/10 border-dashed border-cyan-300 text-cyan-200 animate-pulse hover:bg-cyan-400/25'
                          }`}
                        >
                          {p.t}
                          {revealed.includes(i) && (
                            <span className="ml-1.5 bg-amber-400 text-slate-950 text-xs px-1.5 py-0.5 rounded-md font-mono">
                              {p.op}
                            </span>
                          )}
                        </button>
                      ) : (
                        <span key={i}>{p.t}</span>
                      ))}
                    </p>

                    {revealed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {revealed.map(i => (
                          <span key={i} className="text-xs font-extrabold text-amber-200 bg-amber-950/70 border border-amber-400/30 px-2 py-0.5 rounded-lg">
                            "{currentActivity.sentence[i].t}" → {currentActivity.sentence[i].means}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expression Construction Workspace */}
                  <div className="w-full flex items-center gap-2.5 shrink-0">
                    <span className="text-xs sm:text-sm font-900 text-slate-200 shrink-0">Expression:</span>
                    <div className={`flex-1 min-h-[48px] rounded-xl border-2 flex items-center gap-1.5 px-3 py-1.5 flex-wrap ${
                      decoded ? 'border-emerald-400 bg-emerald-950/60' : 'border-amber-400/50 bg-[#100624]'
                    }`}>
                      {built.length === 0 && (
                        <span className="text-slate-500 font-extrabold text-xs sm:text-sm">
                          Tap tiles below to build the algebra expression…
                        </span>
                      )}
                      {built.map((ti, pos) => (
                        <button
                          key={pos}
                          disabled={decoded}
                          onClick={() => setBuilt(b => b.filter((_, j) => j !== pos))}
                          className="min-w-[34px] h-9 px-2 rounded-lg bg-amber-400 text-slate-950 font-display font-900 text-lg shadow-md hover:bg-rose-300 transition cursor-pointer disabled:cursor-default disabled:hover:bg-amber-400"
                          title="Tap to remove"
                        >
                          {currentActivity.tiles[ti]}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setBuilt([]); setFeedback(null); }}
                      disabled={decoded}
                      className="bg-purple-900/80 hover:bg-purple-800 border border-purple-400/50 text-purple-200 font-display font-900 text-xs px-3 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-40"
                    >
                      ↺ Clear
                    </button>
                  </div>

                  {/* Tile Tray OR Real-World Prop Simulation */}
                  {!decoded ? (
                    <div className="w-full flex flex-col items-center gap-2.5 shrink-0">
                      <div className="flex flex-wrap justify-center gap-2">
                        {currentActivity.tiles.map((t, i) => (
                          <button
                            key={i}
                            disabled={built.includes(i)}
                            onClick={() => { setBuilt(b => [...b, i]); setFeedback(null); }}
                            className={`w-11 h-11 rounded-xl font-display font-900 text-xl transition cursor-pointer shadow-lg ${
                              built.includes(i)
                                ? 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'
                                : /\d|[xc]/.test(t)
                                ? 'bg-cyan-500/25 border-2 border-cyan-300 text-cyan-100 hover:scale-110'
                                : 'bg-purple-500/25 border-2 border-purple-300 text-purple-100 hover:scale-110'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleDecodeCheck}
                        disabled={!built.length}
                        className="btn-gold text-xs sm:text-sm font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Check My Expression ✨
                      </button>
                    </div>
                  ) : (
                    /* Real-World Concrete Simulation with Live Slider */
                    <div className="w-full flex flex-col items-center gap-3 fade-in-up shrink-0">
                      <RealWorldPropVisualizer
                        activity={currentActivity}
                        testVal={testVal}
                        calculatedVal={calculatedVal}
                      />

                      {/* Interactive Variable Slider */}
                      <div className="w-full bg-[#110526] border border-cyan-400/40 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-900 text-cyan-300 uppercase tracking-wide">
                            Slide {currentActivity.variable}:
                          </span>
                          <span className="text-xs font-black text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
                            {currentActivity.variable} = {testVal}
                          </span>
                        </div>

                        <input
                          type="range"
                          min={currentActivity.minVal}
                          max={currentActivity.maxVal}
                          value={testVal}
                          onChange={e => setTestVal(Number(e.target.value))}
                          className="w-full sm:w-56 accent-cyan-400 cursor-pointer"
                        />

                        <div className="text-xs font-bold text-slate-200">
                          {currentActivity.testLabel}: <strong className="text-emerald-400">{currentActivity.money ? '$' : ''}{fmtNum(calculatedVal)}{currentActivity.unit && !currentActivity.money ? ` ${currentActivity.unit}` : ''}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {feedback && (
                    <div data-sim-feedback className={`p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center shadow-xl shrink-0 fade-in-up ${
                      feedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
                    }`}>
                      {feedback.text}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  STATION 2: BALANCE BUILDER & EQUATION SOLVER
                  ========================================================================= */}
              {station === 2 && (
                <div className="flex flex-col items-center gap-3 bg-[#1a0e3a]/95 border-2 border-cyan-400/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex-1 min-h-0 justify-between">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full shrink-0">
                    <BalanceScale
                      bags={bagsShown}
                      leftConst={leftConstShown}
                      rightLabel={rightShown}
                      tilt={tilt}
                      bagLabel={s2.bagName.charAt(0)}
                      theme={s2.theme}
                      constLabel={s2.leftConstLabel}
                    />

                    {/* Step Tracker with Story Meaning */}
                    <div className="flex flex-col gap-1.5 text-left text-xs font-extrabold text-slate-100 shrink-0 w-full sm:w-[230px]">
                      {[
                        { k: 'choose', label: '1. Choose the equation' },
                        ...(s2.collected ? [{ k: 'collect', label: '2. Expand & collect' }] : []),
                        { k: 'subtract', label: `${s2.collected ? 3 : 2}. Subtract from both pans` },
                        { k: 'divide', label: `${s2.collected ? 4 : 3}. Divide both pans` }
                      ].map((st) => {
                        const order = ['choose', ...(s2.collected ? ['collect'] : []), 'subtract', 'divide', 'done'];
                        const done = order.indexOf(stage) > order.indexOf(st.k);
                        const active = stage === st.k;
                        return (
                          <div
                            key={st.k}
                            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center justify-between ${
                              done
                                ? 'border-emerald-400/50 text-emerald-300 bg-emerald-950/40'
                                : active
                                ? 'border-amber-400/60 text-amber-200 bg-amber-950/40'
                                : 'border-white/10 text-slate-400'
                            }`}
                          >
                            <span>{done ? '✅' : active ? '👉' : '•'} {st.label}</span>
                          </div>
                        );
                      })}

                      {/* Active Equation State */}
                      <div className="mt-1 p-2 rounded-xl bg-black/40 border border-cyan-400/30 text-center">
                        <span className="text-[10px] uppercase text-cyan-300 font-bold block">Current State</span>
                        <span className="font-mono font-bold text-sm text-amber-300">
                          {stage === 'choose' && 'Equation: ?'}
                          {stage === 'collect' && s2.choices.find(c => c.ok).eq}
                          {stage === 'subtract' && (s2.collected || `${s2.a}${s2.bagName.charAt(0)} + ${s2.b} = ${s2.c}`)}
                          {stage === 'divide' && `${s2.a}${s2.bagName.charAt(0)} = ${s2.c - s2.b}`}
                          {stage === 'done' && `${s2.bagName.charAt(0)} = ${s2.x}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage-Specific Controls */}
                  <div className="w-full shrink-0">
                    {stage === 'choose' && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-900 text-amber-300 text-center">
                          Which equation represents the story total?
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {s2.choices.map((c, i) => (
                            <button
                              key={i}
                              onClick={() => chooseEquation(i)}
                              className={`py-2.5 px-3 rounded-xl font-display font-900 text-xs sm:text-sm transition cursor-pointer border-2 ${
                                wrongChoice === i
                                  ? 'bg-rose-600/80 border-rose-300 text-white animate-shake'
                                  : 'bg-[#100624] border-purple-400/40 text-white hover:border-cyan-400 hover:bg-[#1b0d3b]'
                              }`}
                            >
                              {c.eq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {stage === 'collect' && (
                      <div className="flex justify-center">
                        <button
                          onClick={doCollect}
                          className="btn-gold text-xs sm:text-sm font-900 px-7 py-2.5 shadow-lg hover:scale-105 transition cursor-pointer"
                        >
                          🧹 Expand Brackets & Collect Like Terms
                        </button>
                      </div>
                    )}

                    {(stage === 'subtract' || stage === 'divide') && (
                      <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-900 text-slate-100">
                          {stage === 'subtract' ? '⚖️ Subtract from BOTH pans:' : '⚖️ Divide BOTH pans by:'}
                        </span>
                        {(stage === 'subtract' ? s2.subOptions : s2.divOptions).map(v => (
                          <button
                            key={v}
                            onClick={() => tryOperation(v, stage === 'subtract' ? 'sub' : 'div')}
                            className="w-14 h-11 rounded-xl bg-cyan-500/20 border-2 border-cyan-300 text-cyan-100 font-display font-900 text-lg hover:scale-110 hover:bg-cyan-500/35 transition cursor-pointer shadow-lg"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {feedback && (
                    <div data-sim-feedback className={`p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center shadow-xl shrink-0 fade-in-up ${
                      feedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
                    }`}>
                      {feedback.text}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  STATION 3: ERROR DETECTIVE & REALITY CHECKER
                  ========================================================================= */}
              {station === 3 && (
                <div className="flex flex-col items-center gap-3 bg-[#1a0e3a]/95 border-2 border-cyan-400/40 rounded-2xl p-3.5 sm:p-4 shadow-xl flex-1 min-h-0 justify-between">
                  <DetectiveNotebook
                    activity={s3}
                    stage={detStage}
                    pickLine={pickLine}
                    pickFix={pickFix}
                    shakeLine={shakeLine}
                    showHint={showHint}
                    toggleHint={() => {
                      setShowHint(h => {
                        const next = !h;
                        if (next) {
                          const hintSeg = AUDIO_MAP[`sim_s3_a${actIdx + 1}_hint`];
                          if (hintSeg) narrate(hintSeg, !muted);
                        } else {
                          stopNarration();
                        }
                        return next;
                      });
                    }}
                    onVerify={verifyAnswer}
                  />

                  {feedback && (
                    <div data-sim-feedback className={`p-2.5 rounded-xl text-xs sm:text-sm font-900 w-full text-center shadow-xl shrink-0 fade-in-up ${
                      feedback.success ? 'bg-emerald-950/90 text-emerald-300 border-2 border-emerald-400/60' : 'bg-rose-950/90 text-rose-300 border-2 border-rose-400/60'
                    }`}>
                      {feedback.text}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Activity Progression Navigation Row */}
            <div className="flex items-center justify-between border-t border-white/15 pt-3 mt-2.5 shrink-0">
              <button
                onClick={prevActivity}
                disabled={station === 1 && actIdx === 0}
                className="bg-[#1b0d38]/90 hover:bg-[#28154e] border-2 border-white/25 text-white font-display font-900 text-xs sm:text-sm px-5 py-2.5 rounded-full cursor-pointer transition disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
              >
                ← Previous Case
              </button>

              <div className="flex items-center gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === actIdx ? 'bg-cyan-400 scale-125 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-white/25'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextActivity}
                className="btn-gold text-xs sm:text-sm font-900 px-7 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition cursor-pointer"
              >
                <span>{station === 3 && actIdx === 2 ? 'Go to Practice Phase' : 'Next Case'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

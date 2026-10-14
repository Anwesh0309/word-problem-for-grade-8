/* =========================================================================
   MATH DATA & PROCEDURAL QUESTION GENERATOR
   Procedurally generates unbounded non-repeating Grade 8 word problems
   (forming & solving linear equations). Every answer is a whole number.
   ========================================================================= */

export const WESTERN_NAMES = [
  "Leo", "Emma", "Alex", "Oliver", "Sophia", "Jack", "Maya", "Lucas",
  "Ethan", "Chloe", "Noah", "Liam", "Harper", "Ava", "Mason", "Ella",
  "James", "Mia", "Logan", "Charlotte"
];

export const PRACTICE_WORLDS = [
  { id: 0, name: "Mystery Mall", icon: "🛍️", range: "Q1–10", difficulty: 1, types: ['money', 'translate', 'numberPuzzle'] },
  { id: 1, name: "Riddle Cave", icon: "🔮", range: "Q11–20", difficulty: 1, types: ['numberPuzzle', 'consecutive', 'translate'] },
  { id: 2, name: "Age Archive", icon: "⏳", range: "Q21–30", difficulty: 2, types: ['ageSum', 'ageFuture'] },
  { id: 3, name: "Ticket Booth", icon: "🎟️", range: "Q31–40", difficulty: 2, types: ['ticket', 'money'] },
  { id: 4, name: "Garden Grid", icon: "🌱", range: "Q41–50", difficulty: 3, types: ['perimeter', 'translate', 'consecutive'] },
  { id: 5, name: "Highway Chase", icon: "🚗", range: "Q51–60", difficulty: 3, types: ['speedApart', 'speedCatch'] },
  { id: 6, name: "Coin Vault", icon: "🪙", range: "Q61–70", difficulty: 3, types: ['coins', 'money'] },
  { id: 7, name: "Sale Street", icon: "🏷️", range: "Q71–80", difficulty: 4, types: ['discount', 'ticket', 'ageFuture'] },
  { id: 8, name: "Train Junction", icon: "🚆", range: "Q81–90", difficulty: 4, types: ['speedApart', 'speedCatch', 'perimeter'] },
  { id: 9, name: "Detective HQ", icon: "🕵️", range: "Q91–100", difficulty: 4, types: ['money', 'numberPuzzle', 'consecutive', 'ageSum', 'ageFuture', 'ticket', 'perimeter', 'speedApart', 'speedCatch', 'coins', 'discount', 'translate'] }
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function twoNames() {
  const a = pick(WESTERN_NAMES);
  let b = pick(WESTERN_NAMES);
  while (b === a) b = pick(WESTERN_NAMES);
  return [a, b];
}

const money = v => `$${v}`;
const unitFmt = u => v => `${v} ${u}`;
const plain = v => `${v}`;

/* Build 4 shuffled options from a correct numeric answer + misconception distractors */
function buildNumericOptions(correct, distractors, fmt) {
  const seen = new Set([correct]);
  const picks = [];
  for (const d of distractors) {
    if (picks.length >= 3) break;
    if (Number.isInteger(d) && d > 0 && !seen.has(d)) {
      seen.add(d);
      picks.push(d);
    }
  }
  const fallbacks = [correct + 2, correct - 2, correct + 5, correct * 2, correct + 10, correct - 1, correct + 1];
  for (const f of fallbacks) {
    if (picks.length >= 3) break;
    if (f > 0 && !seen.has(f)) {
      seen.add(f);
      picks.push(f);
    }
  }
  return shuffleWithCorrect(fmt(correct), picks.map(fmt));
}

function shuffleWithCorrect(correctLabel, wrongLabels) {
  const all = [correctLabel, ...wrongLabels.slice(0, 3)];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { options: all, correctIndex: all.indexOf(correctLabel) };
}

/* -------------------------------------------------------------------------
   ARCHETYPES — each returns { rule, prompt, answer, distractors, fmt,
   explanation, visual } or { rule, prompt, options, correctIndex, ... }
   ------------------------------------------------------------------------- */
const ARCHETYPES = {
  money(diff) {
    const name = pick(WESTERN_NAMES);
    const item = pick(["notebooks", "comic books", "water bottles", "phone cases", "headphones"]);
    const n = randInt(2, 3 + diff);
    const x = randInt(3, 6 + diff * 3);
    const extra = pick(["a pen", "a gift bag", "a keychain"]);
    const p = randInt(2, 9);
    const T = n * x + p;
    return {
      rule: "MONEY RULE",
      prompt: `${name} buys ${n} ${item} and ${extra} that costs $${p}. The total bill is $${T}. How much does one of the ${item.replace(/s$/, '')} cost?`,
      answer: x,
      distractors: [Math.round(T / n), (T + p) / n, T - p, x + p],
      fmt: money,
      explanation: `Let x = cost of one. ${n}x + ${p} = ${T} → ${n}x = ${T - p} → x = $${x}.`,
      visual: { kind: 'bar', total: `$${T}`, rows: [{ label: 'Bill', parts: [...Array(n)].map(() => ({ text: 'x', type: 'unknown' })).concat([{ text: `$${p}`, type: 'const' }]) }] }
    };
  },

  numberPuzzle(diff) {
    const name = pick(WESTERN_NAMES);
    const m = randInt(2, 3 + diff);
    const k = randInt(3, 8 + diff * 4);
    const x = randInt(3, 8 + diff * 4);
    const subtract = diff >= 2 && Math.random() < 0.5;
    const R = subtract ? m * x - k : m * x + k;
    if (R <= 0) return ARCHETYPES.numberPuzzle(diff);
    const opWord = subtract ? `subtracts ${k}` : `adds ${k}`;
    return {
      rule: "NUMBER RIDDLE",
      prompt: `${name} thinks of a number, multiplies it by ${m}, then ${opWord}. The result is ${R}. What number did ${name} think of?`,
      answer: x,
      distractors: [subtract ? (R - k) / m : (R + k) / m, Math.round(R / m), subtract ? R + k : R - k, x + m],
      fmt: plain,
      explanation: `${m}x ${subtract ? '−' : '+'} ${k} = ${R} → ${m}x = ${subtract ? R + k : R - k} → x = ${x}.`,
      visual: { kind: 'machine', steps: [`× ${m}`, subtract ? `− ${k}` : `+ ${k}`], output: R }
    };
  },

  consecutive(diff) {
    const count = diff >= 3 ? pick([3, 4]) : 3;
    const even = diff >= 2 && Math.random() < 0.5;
    const step = even ? 2 : 1;
    let x = randInt(5, 20 + diff * 10);
    if (even && x % 2 === 1) x += 1;
    const nums = [...Array(count)].map((_, i) => x + i * step);
    const S = nums.reduce((a, b) => a + b, 0);
    const askLargest = Math.random() < 0.5;
    const answer = askLargest ? nums[count - 1] : nums[0];
    const offset = nums.reduce((a, _, i) => a + i * step, 0);
    return {
      rule: "CONSECUTIVE RULE",
      prompt: `The sum of ${count} consecutive ${even ? 'even ' : ''}whole numbers is ${S}. What is the ${askLargest ? 'largest' : 'smallest'} number?`,
      answer,
      distractors: [askLargest ? nums[0] : nums[count - 1], nums[1], Math.round(S / count), answer + step],
      fmt: plain,
      explanation: `Let x be the smallest: ${count}x + ${offset} = ${S} → x = ${x}. Numbers: ${nums.join(', ')}.`,
      visual: { kind: 'bar', total: `${S}`, rows: [{ label: 'Sum', parts: nums.map((_, i) => ({ text: i === 0 ? 'x' : `x+${i * step}`, type: i === 0 ? 'unknown' : 'mixed' })) }] }
    };
  },

  translate(diff) {
    const m = randInt(2, 6 + diff);
    let k = randInt(2, 9 + diff * 2);
    if (k === m) k += 1;
    const v = pick(['n', 'x', 'y']);
    const forms = [
      { phrase: `${k} less than ${m} times a number ${v}`, right: `${m}${v} − ${k}`, wrong: [`${k} − ${m}${v}`, `${m}(${v} − ${k})`, `${m}${v} + ${k}`] },
      { phrase: `${k} more than ${m} times a number ${v}`, right: `${m}${v} + ${k}`, wrong: [`${m}(${v} + ${k})`, `${k}${v} + ${m}`, `${m} + ${k}${v}`] },
      { phrase: `${m} times the sum of a number ${v} and ${k}`, right: `${m}(${v} + ${k})`, wrong: [`${m}${v} + ${k}`, `${v} + ${m * k}`, `${m} + ${v} + ${k}`] },
      { phrase: `a number ${v} decreased by ${k}, then divided by ${m}`, right: `(${v} − ${k}) ÷ ${m}`, wrong: [`${v} − ${k} ÷ ${m}`, `${m} ÷ (${v} − ${k})`, `(${k} − ${v}) ÷ ${m}`] },
      { phrase: `the product of ${m} and a number ${v}, reduced by ${k}`, right: `${m}${v} − ${k}`, wrong: [`${m}(${v} − ${k})`, `${k} − ${m}${v}`, `${m} − ${k}${v}`] },
      { phrase: `half of a number ${v}, increased by ${k}`, right: `${v} ÷ 2 + ${k}`, wrong: [`(${v} + ${k}) ÷ 2`, `2${v} + ${k}`, `${v} + ${k} ÷ 2`] }
    ];
    const f = pick(forms);
    const { options, correctIndex } = shuffleWithCorrect(f.right, f.wrong);
    return {
      rule: "TRANSLATE RULE",
      prompt: `Which algebraic expression means: "${f.phrase}"?`,
      options,
      correctIndex,
      explanation: `"${f.phrase}" translates to ${f.right}.`,
      visual: { kind: 'phrase', text: f.phrase }
    };
  },

  ageSum(diff) {
    const [a, b] = twoNames();
    const k = randInt(2, 4 + diff * 2);
    const x = randInt(6, 12 + diff * 3);
    const S = 2 * x + k;
    const askOlder = Math.random() < 0.5;
    const answer = askOlder ? x + k : x;
    return {
      rule: "AGE RULE",
      prompt: `${a} is ${k} years older than ${b}. The sum of their ages is ${S}. How old is ${askOlder ? a : b}?`,
      answer,
      distractors: [askOlder ? x : x + k, (S + k) / 2, S / 2, S - k],
      fmt: unitFmt('years'),
      explanation: `Let ${b}'s age = x. x + (x + ${k}) = ${S} → 2x = ${S - k} → x = ${x}, so ${a} is ${x + k}.`,
      visual: { kind: 'bar', total: `${S}`, rows: [{ label: b, parts: [{ text: 'x', type: 'unknown' }] }, { label: a, parts: [{ text: 'x', type: 'unknown' }, { text: `${k}`, type: 'const' }] }] }
    };
  },

  ageFuture(diff) {
    const child = pick(WESTERN_NAMES);
    const parent = pick(["mother", "father", "aunt", "uncle"]);
    const m = diff >= 4 ? pick([3, 4]) : 3;
    const x = randInt(4, 12);
    const y = x * (m - 2);
    return {
      rule: "AGE RULE",
      prompt: `${child}'s ${parent} is ${m} times as old as ${child}. In ${y} years, the ${parent} will be twice as old as ${child}. How old is ${child} now?`,
      answer: x,
      distractors: [m * x, x + y, 2 * x, y + m],
      fmt: unitFmt('years'),
      explanation: `${m}x + ${y} = 2(x + ${y}) → ${m}x + ${y} = 2x + ${2 * y} → ${m - 2 === 1 ? '' : m - 2}x = ${y} → x = ${x}.`,
      visual: { kind: 'bar', total: null, rows: [{ label: 'Now', parts: [{ text: `${child}: x`, type: 'unknown' }, { text: `${parent}: ${m}x`, type: 'mixed' }] }, { label: `+${y} yrs`, parts: [{ text: `x + ${y}`, type: 'unknown' }, { text: `${m}x + ${y}`, type: 'mixed' }] }] }
    };
  },

  ticket(diff) {
    const venue = pick(["concert", "theme park", "museum", "zoo", "cinema"]);
    const d = randInt(3, 6 + diff * 2);
    const c = randInt(5, 10 + diff * 3);
    const a = randInt(1, 3);
    const b = randInt(2, 4);
    const T = a * (c + d) + b * c;
    const askAdult = diff >= 3 && Math.random() < 0.5;
    const answer = askAdult ? c + d : c;
    return {
      rule: "TICKET RULE",
      prompt: `At the ${venue}, an adult ticket costs $${d} more than a child ticket. ${a} adult ticket${a > 1 ? 's' : ''} and ${b} child tickets cost $${T}. What is the cost of ${askAdult ? 'an adult' : 'a child'} ticket?`,
      answer,
      distractors: [askAdult ? c : c + d, Math.round(T / (a + b)), (T + a * d) / (a + b), answer + d],
      fmt: money,
      explanation: `Let c = child price. ${a === 1 ? '' : a}(c + ${d}) + ${b}c = ${T} → ${a + b}c + ${a * d} = ${T} → c = $${c}; adult = $${c + d}.`,
      visual: { kind: 'bar', total: `$${T}`, rows: [{ label: 'Adults', parts: [...Array(a)].map(() => ({ text: `c+${d}`, type: 'mixed' })) }, { label: 'Children', parts: [...Array(b)].map(() => ({ text: 'c', type: 'unknown' })) }] }
    };
  },

  perimeter(diff) {
    const shape = pick(["garden", "football field", "classroom", "swimming pool", "farm plot"]);
    const unit = shape === 'classroom' ? 'm' : 'm';
    const m = diff >= 3 ? pick([1, 2, 3]) : 1;
    const k = randInt(2, 10 + diff);
    const w = randInt(4, 10 + diff * 3);
    const L = m * w + k;
    const P = 2 * (L + w);
    const askLength = Math.random() < 0.4;
    const answer = askLength ? L : w;
    const lenText = m === 1 ? `${k} ${unit} longer than its width` : `${k} ${unit} more than ${m === 2 ? 'twice' : 'three times'} its width`;
    return {
      rule: "PERIMETER RULE",
      prompt: `A rectangular ${shape} has a length that is ${lenText}. Its perimeter is ${P} ${unit}. Find its ${askLength ? 'length' : 'width'}.`,
      answer,
      distractors: [askLength ? w : L, Math.round(P / 4), (P - k) / 2, P / 2 - k],
      fmt: unitFmt(unit),
      explanation: `Width = w, length = ${m === 1 ? '' : m}w + ${k}. 2(${m === 1 ? '' : m}w + ${k} + w) = ${P} → ${2 * (m + 1)}w + ${2 * k} = ${P} → w = ${w}, length = ${L}.`,
      visual: { kind: 'rect', w: 'w', l: `${m === 1 ? '' : m}w + ${k}`, p: `P = ${P} ${unit}` }
    };
  },

  speedApart(diff) {
    const vehicles = pick([["car", "bus"], ["train", "truck"], ["motorcycle", "van"]]);
    const v1 = randInt(4, 9) * 10;
    let v2 = randInt(4, 9) * 10;
    if (v2 === v1) v2 += 10;
    const t = randInt(2, 3 + diff);
    const D = (v1 + v2) * t;
    return {
      rule: "SPEED RULE",
      prompt: `A ${vehicles[0]} and a ${vehicles[1]} leave the same station at the same time, travelling in opposite directions at ${v1} km/h and ${v2} km/h. After how many hours will they be ${D} km apart?`,
      answer: t,
      distractors: [D / Math.abs(v1 - v2), Math.round(D / v1), Math.round(D / v2), t + 2],
      fmt: v => `${v} hours`,
      explanation: `${v1}t + ${v2}t = ${D} → ${v1 + v2}t = ${D} → t = ${t} hours.`,
      visual: { kind: 'road', mode: 'apart', a: `${v1}t`, b: `${v2}t`, total: `${D} km` }
    };
  },

  speedCatch(diff) {
    const [a, b] = twoNames();
    let v1, v2, h, t;
    for (let guard = 0; guard < 200; guard++) {
      v1 = pick([10, 12, 15, 20, 24, 30]);
      h = randInt(1, 2 + Math.floor(diff / 2));
      t = randInt(1, 4);
      const num = v1 * (t + h);
      if (num % t === 0) {
        v2 = num / t;
        if (v2 > v1 && v2 <= 120) break;
      }
    }
    return {
      rule: "SPEED RULE",
      prompt: `${a} cycles from home at ${v1} km/h. ${h} hour${h > 1 ? 's' : ''} later, ${b} drives along the same road at ${v2} km/h. How many hours after ${b} sets off will ${b} catch up?`,
      answer: t,
      distractors: [t + h, Math.round((v1 * h) / v1), h, t * 2],
      fmt: v => `${v} hour${v > 1 ? 's' : ''}`,
      explanation: `Same distance: ${v2}t = ${v1}(t + ${h}) → ${v2 - v1}t = ${v1 * h} → t = ${t}.`,
      visual: { kind: 'road', mode: 'catch', a: `${v1}(t + ${h})`, b: `${v2}t`, total: null }
    };
  },

  coins(diff) {
    const name = pick(WESTERN_NAMES);
    const [small, big] = pick([[10, 20], [20, 50], [10, 50]]);
    const N = randInt(10, 16 + diff * 4);
    const x = randInt(3, N - 3);
    const cents = small * (N - x) + big * x;
    const dollars = (cents / 100).toFixed(2);
    return {
      rule: "COIN RULE",
      prompt: `${name}'s piggy bank has only ${small}-cent and ${big}-cent coins: ${N} coins worth $${dollars} altogether. How many ${big}-cent coins are there?`,
      answer: x,
      distractors: [N - x, Math.round(cents / big), Math.round(N / 2), x + 2],
      fmt: v => `${v} coins`,
      explanation: `${small}(${N} − x) + ${big}x = ${cents} → ${small * N} + ${big - small}x = ${cents} → x = ${x}.`,
      visual: { kind: 'bar', total: `${cents}¢`, rows: [{ label: `${big}¢`, parts: [{ text: `${big}x`, type: 'unknown' }] }, { label: `${small}¢`, parts: [{ text: `${small}(${N} − x)`, type: 'mixed' }] }] }
    };
  },

  discount() {
    const item = pick(["jacket", "pair of sneakers", "backpack", "skateboard", "smartwatch"]);
    const d = pick([10, 20, 25, 30, 40]);
    const x = randInt(2, 10) * 20;
    const S = (x * (100 - d)) / 100;
    if (!Number.isInteger(S)) return ARCHETYPES.discount();
    return {
      rule: "PERCENT RULE",
      prompt: `During a sale, a ${item} is sold at ${d}% off. The sale price is $${S}. What was the original price?`,
      answer: x,
      distractors: [Math.round(S * (1 + d / 100)), S + d, Math.round(S / (d / 100)), x - 20],
      fmt: money,
      explanation: `${100 - d}% of x = ${S} → ${(100 - d) / 100}x = ${S} → x = $${x}.`,
      visual: { kind: 'bar', total: 'x (100%)', rows: [{ label: 'Price', parts: [{ text: `$${S} (${100 - d}%)`, type: 'unknown', w: (100 - d) / 25 }, { text: `${d}% off`, type: 'const', w: d / 25 }] }] }
    };
  }
};

/* Remember recent prompts so questions never repeat within a session */
const recentPrompts = [];

/**
 * Generate a procedural question for a given world
 */
export function makeQuestion(worldIndex = 0) {
  const world = PRACTICE_WORLDS[worldIndex] || PRACTICE_WORLDS[0];
  let q;
  for (let tries = 0; tries < 12; tries++) {
    const type = pick(world.types);
    q = ARCHETYPES[type](world.difficulty);
    if (!recentPrompts.includes(q.prompt)) break;
  }
  recentPrompts.push(q.prompt);
  if (recentPrompts.length > 60) recentPrompts.shift();

  if (q.options) {
    return { world, prompt: q.prompt, options: q.options, correctIndex: q.correctIndex, visual: q.visual, rule: q.rule, explanation: q.explanation };
  }
  const { options, correctIndex } = buildNumericOptions(q.answer, q.distractors.map(v => (Number.isFinite(v) ? v : -1)), q.fmt);
  return { world, prompt: q.prompt, options, correctIndex, visual: q.visual, rule: q.rule, explanation: q.explanation };
}

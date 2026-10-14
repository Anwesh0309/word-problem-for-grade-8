/* =========================================================================
   AUDIO MAP — Mapping fixed text keys to audio files or speech text
   Generated mp3 files live in /public/assets/audio/<key>.mp3
   Run `npm run generate:audio` to (re)generate them with ElevenLabs "Alice".
   ========================================================================= */
import { PRACTICE_QUESTIONS } from './practiceQuestionsData.js';

export const AUDIO_MAP = {
  // --- Wonder Phase ---
  "wonder_1": {
    text: "Leo, Emma and Alex spent 84 dollars at the cinema. Emma spent twice as much as Leo, and Alex spent 4 dollars more than Emma. How much did Leo spend? How can we turn these words into an equation that reveals the hidden number?",
    style: "question",
    file: "/assets/audio/wonder_1.mp3"
  },

  // --- Story Phase (Slides 1 to 8) ---
  "story_1": {
    text: "Shopping bills, concert tickets, ages and road trips. Real life is full of word problems, and each one hides a mystery number. Our job is to find it, just like a detective!",
    style: "statement",
    file: "/assets/audio/story_1.mp3"
  },
  "story_2": {
    text: "First, read the problem carefully and find what the question is asking. Then give that mystery quantity a letter. For example: let x be the amount of money Leo spent, in dollars.",
    style: "emphasis",
    file: "/assets/audio/story_2.mp3"
  },
  "story_3": {
    text: "Keywords are clues that tell us which operation to use. More than means add. Less than means subtract. Twice, or times, means multiply. Shared equally means divide. And is, or total, means equals.",
    style: "statement",
    file: "/assets/audio/story_3.mp3"
  },
  "story_4": {
    text: "At a concert, an adult ticket costs 12 dollars more than a child ticket. Two adult tickets and three child tickets cost 89 dollars in total. Let c be the cost of a child ticket, so an adult ticket costs c plus 12.",
    style: "statement",
    file: "/assets/audio/story_4.mp3"
  },
  "story_5": {
    text: "Expand the brackets: 2 c plus 24 plus 3 c equals 89. Collect like terms: 5 c plus 24 equals 89. Subtract 24 from both sides: 5 c equals 65. Divide both sides by 5: c equals 13.",
    style: "emphasis",
    file: "/assets/audio/story_5.mp3"
  },
  "story_6": {
    text: "Substitute back into the story. An adult ticket is 13 plus 12, which is 25 dollars. Two adult tickets and three child tickets cost 50 plus 39, which is 89 dollars. It checks out! So, a child ticket costs 13 dollars.",
    style: "encouragement",
    file: "/assets/audio/story_6.mp3"
  },
  "story_7": {
    text: "Ethan's mother is 3 times as old as Ethan. In 12 years, she will be twice as old as him. Let x be Ethan's age now. Then 3 x plus 12 equals 2 times, x plus 12, so x equals 12. Ethan is 12, and his mother is 36!",
    style: "encouragement",
    file: "/assets/audio/story_7.mp3"
  },
  "story_8": {
    text: "Brilliant detective work! You've learned to define the unknown, translate keywords, solve equations and check your answers. Now step into the lab to decode clues, balance equations and catch sneaky mistakes!",
    style: "celebration",
    file: "/assets/audio/story_8.mp3"
  },

  // --- Simulation Phase Guidance & Hints ---
  "sim_1": {
    text: "Welcome to the Keyword Decoder! Tap each glowing clue word to reveal its operation, then build the matching algebra expression from the tiles.",
    style: "encouragement",
    file: "/assets/audio/sim_1.mp3"
  },
  "sim_s1_a1_guide": {
    text: "Activity 1: Concert Ticket Booth. Maya and Leo are at the City Sounds Arena ticket booth. An adult VIP pass costs 12 dollars more than a child ticket. Decode the clue words to find the total ticket bill.",
    style: "statement",
    file: "/assets/audio/sim_s1_a1_guide.mp3"
  },
  "sim_s1_a1_hint": {
    text: "Remember: 2 adult passes are 2 times c plus 12, plus 3 child tickets: 2 times the quantity c plus 12, plus 3 c.",
    style: "encouragement",
    file: "/assets/audio/sim_s1_a1_hint.mp3"
  },
  "sim_s1_a2_guide": {
    text: "Activity 2: Cinema Snack Counter. At the cinema snack counter, Leo buys a regular popcorn for x dollars. A mega family tub costs 3 dollars more than twice the regular popcorn. Decode the clues to find the mega tub price.",
    style: "statement",
    file: "/assets/audio/sim_s1_a2_guide.mp3"
  },
  "sim_s1_a2_hint": {
    text: "3 dollars more than twice x: start with twice x, which is 2 x, then add 3.",
    style: "encouragement",
    file: "/assets/audio/sim_s1_a2_hint.mp3"
  },
  "sim_s1_a3_guide": {
    text: "Activity 3: Bakery Party Box. At Sweet Treats Bakery, each party box contains x glazed donuts and 4 frosted cupcakes. The teacher orders 3 identical party boxes. Group the contents and decode the expression!",
    style: "statement",
    file: "/assets/audio/sim_s1_a3_guide.mp3"
  },
  "sim_s1_a3_hint": {
    text: "The sum of x and 4 is grouped in brackets: x plus 4. 3 whole boxes means 3 times the quantity x plus 4.",
    style: "encouragement",
    file: "/assets/audio/sim_s1_a3_hint.mp3"
  },

  "sim_2": {
    text: "In the Balance Builder, pick the equation that matches the story. Then keep the scale level by doing the same thing to both sides until the mystery bag is alone!",
    style: "statement",
    file: "/assets/audio/sim_2.mp3"
  },
  "sim_s2_a1_guide": {
    text: "Activity 1: The 84-dollar Movie Night Mystery. Leo, Emma, and Alex spent 84 dollars at the cinema. Pick the matching equation, then balance the scale to solve for Leo's spending.",
    style: "statement",
    file: "/assets/audio/sim_s2_a1_guide.mp3"
  },
  "sim_s2_a2_guide": {
    text: "Activity 2: Artisanal Gelato Food Truck. Maya orders 3 cones of gelato plus a 5-dollar cooler bag. Her total receipt is 26 dollars. Keep the scale level to find the cone price!",
    style: "statement",
    file: "/assets/audio/sim_s2_a2_guide.mp3"
  },
  "sim_s2_a3_guide": {
    text: "Activity 3: City Green Scooter Rental. The scooter app charges a 6-dollar unlock fee plus 3 dollars for every half-hour ride block. The receipt is 24 dollars. Solve for the ride time!",
    style: "statement",
    file: "/assets/audio/sim_s2_a3_guide.mp3"
  },

  "sim_3": {
    text: "Time to be an Error Detective! Each solution hides one sneaky mistake. Tap the wrong line, choose the correct fix, then check the answer by substituting it back.",
    style: "question",
    file: "/assets/audio/sim_3.mp3"
  },
  "sim_s3_a1_guide": {
    text: "Activity 1: School Pizza Party Change. Harper buys 3 large pizzas, pays with a 50-dollar note, and gets 8 dollars in change. Tap the line with the algebra mistake!",
    style: "statement",
    file: "/assets/audio/sim_s3_a1_guide.mp3"
  },
  "sim_s3_a1_hint": {
    text: "Change is what is left over from the 50 dollars. Starting cash must come first: 50 minus 3 p equals 8.",
    style: "encouragement",
    file: "/assets/audio/sim_s3_a1_hint.mp3"
  },
  "sim_s3_a2_guide": {
    text: "Activity 2: Family Birthday Age Puzzle. Maya is 5 years younger than her older brother Liam. The sum of their ages is 27 years. Tap the line with the algebra mistake!",
    style: "statement",
    file: "/assets/audio/sim_s3_a2_guide.mp3"
  },
  "sim_s3_a2_hint": {
    text: "Check line 5: to undo plus 5, you must subtract 5 from both sides, not add!",
    style: "encouragement",
    file: "/assets/audio/sim_s3_a2_hint.mp3"
  },
  "sim_s3_a3_guide": {
    text: "Activity 3: Charity Walkathon Lap Pledge. Jordan walks laps for a charity fundraiser. His sponsor pledges a flat 10-dollar gift plus 4 dollars for every lap. Jordan raises 38 dollars. Tap the mistake!",
    style: "statement",
    file: "/assets/audio/sim_s3_a3_guide.mp3"
  },
  "sim_s3_a3_hint": {
    text: "In 4 times L equals 28, which inverse operation undoes multiplication? Divide both sides by 4!",
    style: "encouragement",
    file: "/assets/audio/sim_s3_a3_hint.mp3"
  },

  "sim_success": {
    text: "Great job! Case cracked!",
    style: "celebration",
    file: "/assets/audio/sim_success.mp3"
  },
  "sim_retry": {
    text: "Not quite. Check the clues and try again!",
    style: "encouragement",
    file: "/assets/audio/sim_retry.mp3"
  },

  // --- Feedback ---
  "fb_correct": {
    text: "Correct! Brilliant detective work!",
    style: "celebration",
    file: "/assets/audio/fb_correct.mp3"
  },
  "fb_wrong": {
    text: "Not quite! Let's look at the solution.",
    style: "encouragement",
    file: "/assets/audio/fb_wrong.mp3"
  },

  // --- Reflect Phase ---
  "reflect_1": {
    text: "Fantastic work completing the module! In your own words, explain the four steps for solving a word problem, and show them with an example of your own.",
    style: "thinking",
    file: "/assets/audio/reflect_1.mp3"
  },
  "reflect_done": {
    text: "Outstanding reflection! Lesson complete!",
    style: "celebration",
    file: "/assets/audio/reflect_done.mp3"
  }
};

// Populate the 100 Practice Phase Questions and 100 Hints
for (const q of PRACTICE_QUESTIONS) {
  AUDIO_MAP[q.audioKey] = {
    text: q.spokenText,
    style: "question",
    file: `/assets/audio/${q.audioKey}.mp3`
  };
  AUDIO_MAP[q.hintAudioKey] = {
    text: q.hintSpokenText,
    style: "encouragement",
    file: `/assets/audio/${q.hintAudioKey}.mp3`
  };
}

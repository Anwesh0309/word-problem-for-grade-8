import React from 'react';

/* =========================================================================
   PROBLEM DIAGRAM — Singapore-style bar models & visual clue boards
   kinds: bar | machine | phrase | rect | road
   ========================================================================= */

const PART_STYLE = {
  unknown: 'bg-amber-400/25 border-amber-300 text-amber-200',
  mixed: 'bg-cyan-400/20 border-cyan-300 text-cyan-200',
  const: 'bg-purple-400/25 border-purple-300 text-purple-200'
};

function BarModel({ rows, total }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-xl mx-auto">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center gap-3">
          <span className="w-20 sm:w-24 text-right font-display font-900 text-xs sm:text-sm text-slate-200 shrink-0 truncate">{row.label}</span>
          <div className="flex flex-1 min-w-0">
            {row.parts.map((p, pi) => (
              <div
                key={pi}
                style={{ flexGrow: p.w || (p.type === 'const' ? 0.7 : 1), flexBasis: 0 }}
                className={`h-9 sm:h-10 border-2 -ml-[2px] first:ml-0 first:rounded-l-lg last:rounded-r-lg flex items-center justify-center font-display font-900 text-xs sm:text-sm px-1 truncate ${PART_STYLE[p.type] || PART_STYLE.unknown}`}
              >
                {p.text}
              </div>
            ))}
          </div>
        </div>
      ))}
      {total && (
        <div className="flex items-center gap-3">
          <span className="w-20 sm:w-24 shrink-0" />
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full h-2.5 border-x-2 border-b-2 border-amber-400/80 rounded-b-md" />
            <span className="mt-1 bg-amber-400 text-slate-950 font-display font-900 text-xs sm:text-sm px-3 py-0.5 rounded-full shadow-[0_0_12px_rgba(250,204,21,0.6)]">
              Total = {total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function NumberMachine({ steps, output }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400/25 border-2 border-amber-300 flex items-center justify-center font-display font-900 text-2xl text-amber-200 shadow-[0_0_16px_rgba(250,204,21,0.45)]">x</div>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <span className="text-cyan-300 font-black text-xl">→</span>
          <div className="px-4 h-12 sm:h-14 rounded-xl bg-cyan-400/15 border-2 border-cyan-300 flex items-center justify-center font-display font-900 text-lg sm:text-xl text-cyan-200">⚙️ {s}</div>
        </React.Fragment>
      ))}
      <span className="text-cyan-300 font-black text-xl">→</span>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-400/20 border-2 border-emerald-300 flex items-center justify-center font-display font-900 text-xl text-emerald-200">{output}</div>
    </div>
  );
}

function PhraseBoard({ text }) {
  const keywords = /(less than|more than|times|sum of|decreased by|divided by|product of|reduced by|increased by|half of)/gi;
  const parts = text.split(keywords);
  return (
    <div className="flex items-center gap-3 bg-[#1e1342] border-2 border-cyan-400/40 rounded-2xl px-5 py-3 max-w-2xl">
      <span className="text-3xl">🔎</span>
      <p className="font-display font-900 text-lg sm:text-xl text-slate-100 leading-snug text-left">
        "{parts.map((p, i) => (i % 2 === 1
          ?<span key={i} className="text-amber-300 underline decoration-wavy decoration-amber-400/70 underline-offset-4">{p}</span>
          : <span key={i}>{p}</span>))}"
      </p>
    </div>
  );
}

function RectDiagram({ w, l, p }) {
  return (
    <svg width="300" height="150" viewBox="0 0 300 150" className="drop-shadow-[0_0_16px_rgba(74,222,128,0.4)]">
      <rect x="60" y="22" width="180" height="90" rx="6" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="3" />
      <text x="150" y="14" fill="#facc15" fontSize="15" fontWeight="900" textAnchor="middle">{l}</text>
      <text x="48" y="72" fill="#38bdf8" fontSize="15" fontWeight="900" textAnchor="end">{w}</text>
      <text x="150" y="72" fill="#e2e8f0" fontSize="16" fontWeight="900" textAnchor="middle">🌱</text>
      <rect x="95" y="122" width="110" height="24" rx="12" fill="#09090b" stroke="#4ade80" strokeWidth="1.5" />
      <text x="150" y="139" fill="#4ade80" fontSize="13" fontWeight="900" textAnchor="middle">{p}</text>
    </svg>
  );
}

function RoadDiagram({ mode, a, b, total }) {
  if (mode === 'apart') {
    return (
      <svg width="420" height="110" viewBox="0 0 420 110" className="max-w-full drop-shadow-[0_0_16px_rgba(56,189,248,0.4)]">
        <rect x="10" y="40" width="400" height="22" rx="4" fill="#334155" />
        <line x1="14" y1="51" x2="406" y2="51" stroke="#f8fafc" strokeWidth="2" strokeDasharray="10 8" />
        <circle cx="210" cy="51" r="9" fill="#facc15" stroke="#0c0424" strokeWidth="2" />
        <text x="210" y="84" fill="#facc15" fontSize="12" fontWeight="900" textAnchor="middle">Start</text>
        <text x="28" y="34" fontSize="22">🚗</text>
        <text x="368" y="34" fontSize="22">🚌</text>
        <text x="110" y="28" fill="#38bdf8" fontSize="14" fontWeight="900" textAnchor="middle">← {a}</text>
        <text x="310" y="28" fill="#f472b6" fontSize="14" fontWeight="900" textAnchor="middle">{b} →</text>
        <text x="210" y="104" fill="#e2e8f0" fontSize="13" fontWeight="900" textAnchor="middle">Total apart = {total}</text>
      </svg>
    );
  }
  return (
    <svg width="420" height="110" viewBox="0 0 420 110" className="max-w-full drop-shadow-[0_0_16px_rgba(56,189,248,0.4)]">
      <rect x="10" y="44" width="400" height="22" rx="4" fill="#334155" />
      <line x1="14" y1="55" x2="406" y2="55" stroke="#f8fafc" strokeWidth="2" strokeDasharray="10 8" />
      <text x="14" y="38" fontSize="16" fontWeight="900" fill="#e2e8f0">🏠</text>
      <text x="356" y="38" fontSize="22">🚴</text>
      <text x="320" y="38" fontSize="22">🚗</text>
      <line x1="30" y1="80" x2="390" y2="80" stroke="#38bdf8" strokeWidth="2.5" />
      <text x="210" y="98" fill="#38bdf8" fontSize="13" fontWeight="900" textAnchor="middle">Cyclist: {a}  =  Car: {b}</text>
      <text x="210" y="22" fill="#facc15" fontSize="12" fontWeight="900" textAnchor="middle">Same distance when they meet!</text>
    </svg>
  );
}

export function ProblemDiagram({ visual }) {
  if (!visual) return null;
  return (
    <div className="w-full flex items-center justify-center my-2">
      {visual.kind === 'bar' && <BarModel rows={visual.rows} total={visual.total} />}
      {visual.kind === 'machine' && <NumberMachine steps={visual.steps} output={visual.output} />}
      {visual.kind === 'phrase' && <PhraseBoard text={visual.text} />}
      {visual.kind === 'rect' && <RectDiagram w={visual.w} l={visual.l} p={visual.p} />}
      {visual.kind === 'road' && <RoadDiagram mode={visual.mode} a={visual.a} b={visual.b} total={visual.total} />}
    </div>
  );
}

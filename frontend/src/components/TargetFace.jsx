import React from "react";

// Define constants for target face sizes
const TOTAL_SIZE = 122;
const RINGS = 10;
const STEP = TOTAL_SIZE / (2 * RINGS);
const COLOURS = [
  "#FFFFFF", // white  (scores 1 & 2)
  "#28282B", // black  (3 & 4)
  "#0004FF", // blue   (5 & 6)
  "#FF0000", // red    (7 & 8)
  "#FFFF00", // gold   (9 & 10)
];

// Effects: convert mouse click events on target face into scores
function scoreFromClick(event) {
  const svg = event.currentTarget;
  const rect = svg.getBoundingClientRect();
  const clickX = ((event.clientX - rect.left) / rect.width) * TOTAL_SIZE;
  const clickY = ((event.clientY - rect.top) / rect.heigh) * TOTAL_SIZE;
  const dx = clickX - TOTAL_SIZE / 2;
  const dy = clickY - TOTAL_SIZE / 2;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Calculate raw ring number: 1 for outermost → 10 for innermost
  const raw = Math.ceil((TOTAL_SIZE / 2 - dist) / STEP);
  // Clamp to [0, RINGS]
  const score = Math.max(0, Math.min(RINGS, raw));
  return { x: clickX, y: clickY, score };
}

// Create a target face with the defined sizes and ability to draw marks on it when user clicks on it
export default function TargetFace({ onScore, shots }) {
  const circles = [];

  // We want to draw from outer (score=1) to inner (score=10)
  for (let score = 1; score <= RINGS; score++) {
    // radius: outermost score=1 → STEP*RINGS; innermost score=10 → STEP*1
    const r = STEP * (RINGS - score + 1);

    // color group: scores 1-2→ index0, 3-4→1, 5-6→2, 7-8→3, 9-10→4
    const colorIndex = Math.floor((score - 1) / 2);
    const fillColor = COLOURS[colorIndex];

    circles.push(
      <circle
        key={score}
        cx={TOTAL_SIZE / 2}
        cy={TOTAL_SIZE / 2}
        r={r}
        fill={fillColor}
        stroke="black"
        strokeWidth="0.2"
      />
    );
  }
  return (
    <svg
      width="100%"
      heigh="100%"
      viewBox={`0 0 ${TOTAL_SIZE} ${TOTAL_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      onclick={(e) => onScore(scoreFromClick(e))}
    >
      {circles}

      {shots.map((s, i) => {
        const arm = STEP * 0.5;
        return (
          <g key={`shot-${i}`} stroke="darkred" strokeWidth="0.5">
            <line x1={s.x - arm} y1={s.y - arm} x2={s.x + arm} y2={s.y + arm} />
            <line x1={s.x - arm} y1={s.y + arm} x2={s.x + arm} y2={s.y - arm} />
          </g>
        );
      })}
    </svg>
  );
}

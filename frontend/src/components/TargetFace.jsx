// components/TargetFace.jsx
import React, { useRef } from "react";
import { ScoreCalculator } from "../calculator/ScoreCalculator";
import { Ring } from "./ring";
import { ShotMarker } from "./ShotMarker.jsx";

const TOTAL_SIZE = 122,
  RINGS = 10,
  COLOURS = [
    "#FFFFFF", // white  (scores 1 & 2)
    "#28282B", // black  (3 & 4)
    "#0004FF", // blue   (5 & 6)
    "#FF0000", // red    (7 & 8)
    "#FFFF00", // gold   (9 & 10)
  ];
const calc = new ScoreCalculator(TOTAL_SIZE, RINGS);

export default function TargetFace({ onScore, shots }) {
  const svgRef = useRef();

  const handleClick = (e) => {
    const shot = calc.calculate(e, svgRef.current);
    onScore(shot);
  };

  const rings = Array.from({ length: RINGS }, (_, idx) => {
    const score = idx + 1;
    const radius = calc.step * (RINGS - score + 1);
    const colorIdx = Math.floor(idx / 2);
    return { radius, fill: COLOURS[colorIdx] };
  });

  const arm = calc.step * 0.5;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${TOTAL_SIZE} ${TOTAL_SIZE}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
    >
      {rings.map(({ radius, fill }, i) => (
        <Ring
          key={i}
          center={TOTAL_SIZE / 2}
          radius={radius}
          fill={fill}
          stroke="black"
          strokeWidth={0.2}
        />
      ))}
      {shots.map((s, i) => (
        <ShotMarker key={i} x={s.x} y={s.y} arm={arm} />
      ))}
    </svg>
  );
}

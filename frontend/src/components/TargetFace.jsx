import React, { useMemo, useRef } from "react";
import { ScoreCalculator }         from "../stats/ScoreCalculator";
import { Ring }                    from "./Ring";
import { ShotMarker }              from "./ShotMarker";

export default function TargetFace({ onScore, shots }) {
  const COLOURS = [
    "#FFFFFF", "#28282B", "#0004FF", "#FF0000", "#FFFF00",
  ];

  const calc   = useMemo(() => new ScoreCalculator(122, 10), []);
  const svgRef = useRef();

  const handleClick = (e) => {
    const shot = calc.calculate(e, svgRef.current);
    onScore(shot);
  };

  const rings = Array.from({ length: calc.rings }, (_, idx) => {
    const score    = idx + 1;
    const radius   = calc.step * (calc.rings - score + 1);
    const colorIdx = Math.floor(idx / 2);
    return { radius, fill: COLOURS[colorIdx] };
  });

  const arm = calc.step * 0.5;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${calc.totalSize} ${calc.totalSize}`}
      preserveAspectRatio="xMidYMid meet"
      onClick={handleClick}
    >
      {rings.map(({ radius, fill }, i) => (
        <Ring
          key={i}
          center={calc.totalSize / 2}
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

// components/ShotMark.jsx
import PropTypes from "prop-types";

export function ShotMarker({ x, y, arm }) {
  return (
    <g stroke="darkred" strokeWidth={0.3}>
      <line x1={x - arm} y1={y - arm} x2={x + arm} y2={y + arm} />
      <line x1={x - arm} y1={y + arm} x2={x + arm} y2={y - arm} />
    </g>
  );
}

ShotMarker.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  arm: PropTypes.number.isRequired,
};

// components/Ring.jsx
import PropTypes from "prop-types";

export function Ring({ center, radius, fill, stroke, strokeWidth }) {
  return (
    <circle
      cx={center} cy={center}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}

Ring.propTypes = {
  center:      PropTypes.number.isRequired,
  radius:      PropTypes.number.isRequired,
  fill:        PropTypes.string.isRequired,
  stroke:      PropTypes.string,
  strokeWidth: PropTypes.number,
};

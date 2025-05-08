// src/components/ShotMarker.jsx
import PropTypes from "prop-types";
import { TbTargetArrow } from "react-icons/tb";


/**
 * Renders a shot marker icon at the given (x,y) coordinates.
 * iconSize controls both width and height of the icon.
 */
export function ShotMarker({ x, y, iconSize = 4 }) {
  const offset = iconSize / 2;
  return (
    <g
      transform={`translate(${x - offset}, ${y - offset})`}
      style={{ pointerEvents: "none" }}
    >
      <TbTargetArrow size={iconSize} />
    </g>
  );
}

ShotMarker.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  iconSize: PropTypes.number,
};

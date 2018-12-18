import React from "react";

export const AxisGridlines = React.memo(({axis, axisLength, tickLength, spacing, color}) => {
  const fn = axis === "y" ? (e, i) => {
    const y = spacing * i;
    return (<line
      key={`x${i}`}
      y1={y}
      y2={y}
      x1={0}
      x2={tickLength}
      stroke={color}
    />);
  } : (e, i) => {
    const x = spacing * i;
    return (<line
      key={`y${i}`}
      y1={0}
      y2={tickLength}
      x1={x}
      x2={x}
      stroke={color}
    />);
  };
  return Array(Math.ceil(axisLength / spacing))
    .fill()
    .map(fn);
});

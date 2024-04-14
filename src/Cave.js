// Cave.jsx
import React from "react";

const Cave = ({ left_points, right_points, screenWidth, position }) => {
  const left_str = left_points.map((pair) => pair.join(",")).join(" ");
  const right_str = right_points.map((pair) => pair.join(",")).join(" ");
  return (
    <svg
      width={screenWidth}
      style={{
        position: "absolute",
        left: 100,
        top: 0,
        overflow: "hidden",
        height: left_points.length * 10,
        transform: `translate(0px, ${position.y}px)`,
      }}
    >
      <polygon key="left" points={left_str} fill="gray" />
      <polygon key="right" points={right_str} fill="gray" />
    </svg>
  );
};

export default Cave;

// Drone.jsx
import React from "react";

const Drone = ({ position }) => {
  return (
    <svg
      className="drone"
      width="50px"
      height="50px"
      style={{ transform: `translate(${position.x + 100}px, 0px)` }}
    >
      <polygon points="12,14 25,2 0,2" fill="blue" />
    </svg>
  );
};

export default Drone;

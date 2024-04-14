// Popup.jsx
import React from "react";

const Popup = ({ message, onRestart }) => {
  return (
    <div style={{ width: 100 }} className="popup">
      <div className="popup-inner">
        <p>{message}</p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
};

export default Popup;

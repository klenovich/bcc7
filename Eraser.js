import React from 'react';

const Eraser = ({ onEraserClick }) => {
  return (
    <button className="eraser" onClick={onEraserClick}>
      Eraser
    </button>
  );
};

export default Eraser;

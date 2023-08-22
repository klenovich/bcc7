import React from 'react';

const ColorPicker = ({ colors, selectedColor, onColorChange }) => {
  return (
    <div className="color-picker">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`color ${selectedColor === color ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;

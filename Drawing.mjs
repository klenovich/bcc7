import React, { useState, useEffect, useRef } from 'react';

const Drawing = ({ socket }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const startDrawing = (event) => {
      const { offsetX, offsetY } = event.nativeEvent;
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    };

    const draw = (event) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = event.nativeEvent;
      context.lineTo(offsetX, offsetY);
      context.stroke();
    };

    const stopDrawing = () => {
      context.closePath();
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing]);

  return (
    <canvas
      ref={canvasRef}
      className="drawing"
      width={window.innerWidth}
      height={window.innerHeight}
    ></canvas>
  );
};

export default Drawing;

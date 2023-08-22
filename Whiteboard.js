import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Whiteboard = () => {
  const [drawings, setDrawings] = useState([]);
  const [color, setColor] = useState('black');
  const [isErasing, setIsErasing] = useState(false);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the socket server
    socketRef.current = io();

    // Receive existing drawings from the server
    socketRef.current.on('drawings', (data) => {
      setDrawings(data);
    });

    // Receive new drawings from other users
    socketRef.current.on('drawing', (data) => {
      setDrawings((prevDrawings) => [...prevDrawings, data]);
    });

    // Clean up the socket connection on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all the drawings
    drawings.forEach((drawing) => {
      drawOnCanvas(context, drawing);
    });
  }, [drawings]);

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;

    // Start drawing
    context.beginPath();
    context.moveTo(offsetX, offsetY);

    // Send the drawing to the server
    socketRef.current.emit('drawing', {
      type: 'start',
      color,
      isErasing,
      x: offsetX,
      y: offsetY,
    });
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { offsetX, offsetY } = event.nativeEvent;

    // Continue drawing
    context.lineTo(offsetX, offsetY);
    context.stroke();

    // Send the drawing to the server
    socketRef.current.emit('drawing', {
      type: 'draw',
      color,
      isErasing,
      x: offsetX,
      y: offsetY,
    });
  };

  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Finish drawing
    context.closePath();

    // Send the drawing to the server
    socketRef.current.emit('drawing', {
      type: 'end',
    });
  };

  const drawOnCanvas = (context, drawing) => {
    const { type, color, isErasing, x, y } = drawing;

    if (type === 'start') {
      context.beginPath();
      context.moveTo(x, y);
    } else if (type === 'draw') {
      context.lineTo(x, y);
      context.strokeStyle = isErasing ? 'white' : color;
      context.stroke();
    } else if (type === 'end') {
      context.closePath();
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setIsErasing(false);
  };

  const handleEraserClick = () => {
    setIsErasing(true);
    setColor('white');
  };

  return (
    <div className="container">
      <div className="whiteboard">
        <canvas
          ref={canvasRef}
          className="drawing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
      <div className="color-picker">
        <button
          style={{ backgroundColor: 'black' }}
          onClick={() => handleColorChange('black')}
        />
        <button
          style={{ backgroundColor: 'red' }}
          onClick={() => handleColorChange('red')}
        />
        <button
          style={{ backgroundColor: 'blue' }}
          onClick={() => handleColorChange('blue')}
        />
        <button
          style={{ backgroundColor: 'green' }}
          onClick={() => handleColorChange('green')}
        />
      </div>
      <div className="eraser">
        <button onClick={handleEraserClick} />
      </div>
    </div>
  );
};

export default Whiteboard;

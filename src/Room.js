import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import './Room.css';

function Room() {
  const { roomId } = useParams();
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('Connecting...');
  const [color, setColor] = useState('#000000');

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
  const ws = new WebSocket(`wss://collaborative-whiteboard-backend-production.up.railway.app/ws/${roomId}`);
  setSocket(ws);


    ws.onopen = () => setStatus('Connected');
    ws.onclose = () => setStatus('Disconnected');
    ws.onerror = () => setStatus('Connection Error');

    ws.onmessage = (event) => {
      const ctx = canvasRef.current.getContext('2d');
      const message = JSON.parse(event.data);

      if (message.type === 'clear') {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      } else if (message.type === 'draw') {
        ctx.strokeStyle = message.color;
        ctx.lineTo(message.x, message.y);
        ctx.stroke();
      }
    };

    return () => ws.close();
  }, [roomId]);

  const startDrawing = ({ nativeEvent }) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'draw', x: offsetX, y: offsetY, color }));
    }
  };

  const endDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'clear' }));
    }
  };

  return (
    <div className="room-container">
      <h1>Room ID: {roomId}</h1>
      <p>Status: {status}</p>
      <div className="workspace">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="whiteboard"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
        <div className="tools">
          <button onClick={clearCanvas} className="clear-btn">Clear Canvas</button>
          <SketchPicker
            color={color}
            onChangeComplete={(selectedColor) => setColor(selectedColor.hex)}
          />
        </div>
      </div>
    </div>
  );
}

export default Room;

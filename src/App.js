import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim() !== '') {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="homepage-container">
      <h1>🎨 Collaborative Whiteboard</h1>

      <button className="create-btn" onClick={createRoom}>Create New Room</button>

      <div className="join-room">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button className="join-btn" onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default App;

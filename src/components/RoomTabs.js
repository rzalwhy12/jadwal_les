'use client';

import { ROOMS } from '@/lib/constants';

export default function RoomTabs({ selectedRoom, onRoomChange }) {
  return (
    <div className="room-tabs">
      {ROOMS.map(room => (
        <button
          key={room}
          className={`room-tab ${selectedRoom === room ? 'active' : ''}`}
          onClick={() => onRoomChange(room)}
        >
          🚪 Ruangan {room}
        </button>
      ))}
    </div>
  );
}

'use client';

import { INSTRUMENTS, MODES } from '@/lib/constants';

export default function ScheduleCell({ 
  data, 
  isFilteredOut, 
  isBookedByOther = false, 
  onClick, 
  readOnly = false, 
  room,
  onDragStart,
  onDragOver,
  onDrop
}) {
  // Slot terisi murid lain — tampilkan indikator tapi sembunyikan nama
  if (isBookedByOther) {
    return (
      <div 
        className="schedule-cell booked-by-other" 
        title={`Ruangan ${room}`}
        onDragOver={(e) => { e.preventDefault(); if(onDragOver) onDragOver(e); }}
        onDrop={(e) => { e.preventDefault(); if(onDrop) onDrop(e, null); }}
      >
        <span className="cell-booked-icon">🔒</span>
        <span className="cell-booked-text">Terisi</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className={`schedule-cell empty ${readOnly ? 'read-only' : ''}`}
        onClick={readOnly ? undefined : onClick}
        title={`Ruangan ${room}`}
        onDragOver={(e) => { e.preventDefault(); if(onDragOver) onDragOver(e); }}
        onDrop={(e) => { e.preventDefault(); if(onDrop) onDrop(e, null); }}
      >
        <span className="cell-empty-room-label">R{room}</span>
      </div>
    );
  }

  const instrument = INSTRUMENTS[data.instrument];
  const mode = MODES[data.mode];

  return (
    <div
      className={`schedule-cell filled ${isFilteredOut ? 'filtered-out' : ''} ${readOnly ? 'read-only' : ''}`}
      onClick={readOnly ? undefined : onClick}
      draggable={!readOnly && !isFilteredOut}
      onDragStart={(e) => { if (onDragStart) onDragStart(e, data); }}
      onDragOver={(e) => { e.preventDefault(); if(onDragOver) onDragOver(e); }}
      onDrop={(e) => { e.preventDefault(); if(onDrop) onDrop(e, data); }}
      style={{
        borderColor: instrument?.color || '#ddd',
        borderLeft: `4px solid ${instrument?.color || '#ddd'}`,
      }}
    >
      <div className="cell-student" title={data.studentName}>
        {data.studentName}
      </div>
      <div className="cell-details">
        <div className="cell-badges">
          <span className="cell-badge room-badge">R{room}</span>
          {instrument && (
            <span
              className="cell-badge"
              style={{ background: instrument.bg, color: instrument.color }}
            >
              {instrument.emoji} {data.instrument}
            </span>
          )}
          {mode && (
            <span
              className="cell-badge"
              style={{ background: mode.bg, color: mode.color }}
            >
              {mode ? mode.emoji : ''} {data.mode}
            </span>
          )}
        </div>
        {data.teacherName && (
          <div className="cell-teacher" title={data.teacherName}>
            👨‍🏫 {data.teacherName}
          </div>
        )}
      </div>
    </div>
  );
}

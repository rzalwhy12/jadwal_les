'use client';

import { INSTRUMENTS, MODES } from '@/lib/constants';

export default function ScheduleCell({ data, isFilteredOut, onClick, readOnly = false }) {
  if (!data) {
    return (
      <div
        className={`schedule-cell empty ${readOnly ? 'read-only' : ''}`}
        onClick={readOnly ? undefined : onClick}
      />
    );
  }

  const instrument = INSTRUMENTS[data.instrument];
  const mode = MODES[data.mode];

  return (
    <div
      className={`schedule-cell filled ${isFilteredOut ? 'filtered-out' : ''} ${readOnly ? 'read-only' : ''}`}
      onClick={readOnly ? undefined : onClick}
      style={{
        borderColor: instrument?.color || '#ddd',
        borderLeft: `4px solid ${instrument?.color || '#ddd'}`,
      }}
    >
      <div className="cell-student" title={data.studentName}>
        {data.studentName}
      </div>
      <div className="cell-badges">
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
  );
}

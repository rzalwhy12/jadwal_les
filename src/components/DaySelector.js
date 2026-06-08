'use client';

import { DAYS } from '@/lib/constants';

function getTodayIndonesian() {
  const dayMap = {
    1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis',
    5: 'Jumat', 6: 'Sabtu', 0: 'Minggu'
  };
  return dayMap[new Date().getDay()];
}

export default function DaySelector({ selectedDay, onDayChange }) {
  const today = getTodayIndonesian();

  return (
    <div className="day-selector">
      <button
        className={`day-pill ${selectedDay === 'Semua' ? 'active' : ''}`}
        onClick={() => onDayChange('Semua')}
      >
        📅 Semua
      </button>
      {DAYS.map(day => (
        <button
          key={day}
          className={`day-pill ${selectedDay === day ? 'active' : ''} ${day === today && selectedDay !== day ? 'today' : ''}`}
          onClick={() => onDayChange(day)}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

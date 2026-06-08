'use client';

import { DAYS, TIME_SLOTS, INSTRUMENTS, MODES } from '@/lib/constants';
import { filterSchedule } from '@/lib/filters';
import ScheduleCell from './ScheduleCell';

function getTodayIndonesian() {
  const dayMap = {
    1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis',
    5: 'Jumat', 6: 'Sabtu', 0: 'Minggu'
  };
  return dayMap[new Date().getDay()];
}

export default function ScheduleTable({
  scheduleData,
  selectedDay,
  filters,
  onCellClick,
  readOnly = false,
}) {
  const today = getTodayIndonesian();
  const displayDays = selectedDay === 'Semua' ? DAYS : [selectedDay];
  
  // Build a lookup map: "day-timeSlot" -> data
  const dataMap = {};
  if (scheduleData) {
    scheduleData.forEach(item => {
      const key = `${item.day}-${item.timeSlot}`;
      dataMap[key] = item;
    });
  }

  // Determine filtered items
  const filteredData = filterSchedule(scheduleData || [], filters);
  const filteredKeys = new Set(filteredData.map(item => `${item.day}-${item.timeSlot}`));
  
  const hasActiveFilters = filters.instruments?.length > 0 ||
    filters.mode !== '' ||
    filters.studentName?.trim() !== '' ||
    filters.teacherName?.trim() !== '';

  return (
    <div className="schedule-wrapper">
      {/* Desktop Table View */}
      <div className="schedule-desktop">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Jam</th>
              {displayDays.map(day => (
                <th
                  key={day}
                  className={day === today ? 'today-col' : ''}
                >
                  {day}
                  {day === today && <span style={{ marginLeft: 6, fontSize: '9px', opacity: 0.7 }}>●</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => {
              const endHour = parseInt(time.split(':')[0]) + 1;
              const endTime = `${endHour.toString().padStart(2, '0')}:00`;

              return (
                <tr key={time}>
                  <td>
                    <div className="time-label">
                      <span className="time-start">{time}</span>
                      <span className="time-end">{endTime}</span>
                    </div>
                  </td>
                  {displayDays.map(day => {
                    const key = `${day}-${time}`;
                    const cellData = dataMap[key] || null;
                    const isFilteredOut = hasActiveFilters && cellData && !filteredKeys.has(key);

                    return (
                      <td key={key}>
                        <ScheduleCell
                          data={cellData}
                          isFilteredOut={isFilteredOut}
                          onClick={() => onCellClick(day, time, cellData)}
                          readOnly={readOnly}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="schedule-mobile">
        {displayDays.map(day => (
          <div key={day} className="mobile-day-section">
            {selectedDay === 'Semua' && (
              <div className={`mobile-day-header ${day === today ? 'today' : ''}`}>
                <span className="mobile-day-name">{day}</span>
                {day === today && <span className="mobile-today-badge">Hari Ini</span>}
              </div>
            )}
            <div className="mobile-time-slots">
              {TIME_SLOTS.map((time) => {
                const endHour = parseInt(time.split(':')[0]) + 1;
                const endTime = `${endHour.toString().padStart(2, '0')}:00`;
                const key = `${day}-${time}`;
                const cellData = dataMap[key] || null;
                const isFilteredOut = hasActiveFilters && cellData && !filteredKeys.has(key);
                const instrument = cellData ? INSTRUMENTS[cellData.instrument] : null;
                const mode = cellData ? MODES[cellData.mode] : null;

                if (isFilteredOut) return null;

                return (
                  <div
                    key={key}
                    className={`mobile-slot ${cellData ? 'filled' : 'empty'} ${readOnly && !cellData ? 'read-only' : ''}`}
                    onClick={readOnly && !cellData ? undefined : () => onCellClick(day, time, cellData)}
                    style={cellData && instrument ? { borderLeftColor: instrument.color } : {}}
                  >
                    <div className="mobile-slot-time">
                      <span className="mobile-time-text">{time}</span>
                      <span className="mobile-time-divider">—</span>
                      <span className="mobile-time-text">{endTime}</span>
                    </div>

                    {cellData ? (
                      <div className="mobile-slot-content">
                        <div className="mobile-slot-student">{cellData.studentName}</div>
                        <div className="mobile-slot-badges">
                          {instrument && (
                            <span
                              className="mobile-slot-badge"
                              style={{ background: instrument.bg, color: instrument.color }}
                            >
                              {instrument.emoji} {cellData.instrument}
                            </span>
                          )}
                          {mode && (
                            <span
                              className="mobile-slot-badge"
                              style={{ background: mode.bg, color: mode.color }}
                            >
                              {mode.emoji} {mode.label}
                            </span>
                          )}
                        </div>
                        {cellData.teacherName && (
                          <div className="mobile-slot-teacher">👨‍🏫 {cellData.teacherName}</div>
                        )}
                      </div>
                    ) : (
                      <div className="mobile-slot-empty">
                        {!readOnly && <span className="mobile-add-icon">+</span>}
                        <span className="mobile-empty-text">{readOnly ? 'Kosong' : 'Tambah'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

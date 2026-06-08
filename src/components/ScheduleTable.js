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
  onCellDrop,
  readOnly = false,
  visitorName = '',
  isTeacher = false,
}) {
  const today = getTodayIndonesian();
  const displayDays = selectedDay === 'Semua' ? DAYS.filter(d => d !== 'Minggu') : [selectedDay];
  
  // Build a lookup map: "day-timeSlot" -> { 1: data, 2: data }
  const dataMap = {};
  if (scheduleData) {
    scheduleData.forEach(item => {
      const key = `${item.day}-${item.timeSlot}`;
      if (!dataMap[key]) dataMap[key] = { 1: null, 2: null };
      dataMap[key][item.room || 1] = item;
    });
  }

  // If visitorName is set and NOT a teacher, only show cells that belong to this visitor
  const visitorNameLower = visitorName.trim().toLowerCase();
  const isVisitorMode = visitorNameLower !== '' && !isTeacher;

  // Returns: 'own' | 'booked' | 'empty'
  const getCellStatus = (cellData) => {
    if (!cellData) return 'empty';
    if (!isVisitorMode) return 'own'; // admin/non-visitor mode: show all
    return cellData.studentName?.toLowerCase().includes(visitorNameLower)
      ? 'own'
      : 'booked';
  };

  // Determine filtered items (for filter bar usage, not visitor mode)
  const filteredData = filterSchedule(scheduleData || [], filters);
  const filteredKeys = new Set(filteredData.map(item => `${item.day}-${item.timeSlot}`));
  
  const hasActiveFilters = !isVisitorMode && (
    filters.instruments?.length > 0 ||
    filters.mode !== '' ||
    filters.studentName?.trim() !== '' ||
    filters.teacherName?.trim() !== ''
  );

  const handleDragStart = (e, data) => {
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDay, targetTimeSlot, targetRoom, targetData) => {
    e.preventDefault();
    try {
      const dragDataString = e.dataTransfer.getData('application/json');
      if (!dragDataString) return;
      const draggedData = JSON.parse(dragDataString);
      if (onCellDrop) {
        onCellDrop(draggedData, targetDay, targetTimeSlot, targetRoom, targetData);
      }
    } catch (err) {
      console.error('Failed to parse dropped data', err);
    }
  };

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
                    const cellMap = dataMap[key] || { 1: null, 2: null };

                    return (
                      <td key={key}>
                        <div className="table-rooms-wrapper">
                          {[1, 2].map(room => {
                            const cellData = cellMap[room];
                            const isFilteredOut = hasActiveFilters && cellData && !filteredKeys.has(key);
                            const status = getCellStatus(cellData);

                            return (
                              <ScheduleCell
                                key={room}
                                data={status === 'own' ? cellData : null}
                                isBookedByOther={status === 'booked'}
                                isFilteredOut={isFilteredOut}
                                onClick={() => onCellClick(day, time, cellData, room)}
                                readOnly={readOnly}
                                room={room}
                                onDragStart={handleDragStart}
                                onDragOver={handleDragOver}
                                onDrop={(e, targetData) => handleDrop(e, day, time, room, targetData)}
                              />
                            );
                          })}
                        </div>
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
                const cellMap = dataMap[key] || { 1: null, 2: null };

                return [1, 2].map(room => {
                  const cellData = cellMap[room];
                  const isFilteredOut = hasActiveFilters && cellData && !filteredKeys.has(key);
                  const status = getCellStatus(cellData);
                  const instrument = status === 'own' && cellData ? INSTRUMENTS[cellData.instrument] : null;
                  const mode = status === 'own' && cellData ? MODES[cellData.mode] : null;

                  if (isFilteredOut) return null;

                  return (
                    <div
                      key={`${key}-${room}`}
                      className={`mobile-slot ${status === 'booked' ? 'booked' : (cellData && status === 'own' ? 'filled' : 'empty')} ${readOnly && !cellData && status !== 'booked' ? 'read-only' : ''}`}
                      onClick={readOnly && status !== 'booked' && !cellData ? undefined : status === 'booked' ? undefined : () => onCellClick(day, time, cellData, room)}
                      style={status === 'own' && instrument ? { borderLeftColor: instrument.color } : {}}
                    >
                      <div className="mobile-slot-time">
                        <span className="mobile-time-text">{time}</span>
                        <span className="mobile-time-divider">—</span>
                        <span className="mobile-time-text">{endTime}</span>
                        <span className="mobile-time-room">R{room}</span>
                      </div>

                      {status === 'booked' ? (
                        <div className="mobile-slot-booked">
                          <span className="mobile-booked-icon">🔒</span>
                          <span className="mobile-booked-text">Terisi (Ruang {room})</span>
                        </div>
                      ) : status === 'own' && cellData ? (
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
                });
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

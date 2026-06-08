'use client';

import { useState, useEffect } from 'react';
import { INSTRUMENTS, MODES, DAYS, TIME_SLOTS } from '@/lib/constants';

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  day,
  timeSlot,
  existingData,
  isAdmin = false,
}) {
  const [studentName, setStudentName] = useState('');
  const [instrument, setInstrument] = useState('');
  const [mode, setMode] = useState('P');
  const [teacherName, setTeacherName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!existingData;

  useEffect(() => {
    if (existingData) {
      setStudentName(existingData.studentName || '');
      setInstrument(existingData.instrument || '');
      setMode(existingData.mode || 'P');
      setTeacherName(existingData.teacherName || '');
      setSelectedDay(existingData.day || day || '');
      setSelectedTime(existingData.timeSlot || timeSlot || '');
    } else {
      setStudentName('');
      setInstrument('');
      setMode('P');
      setTeacherName('');
      setSelectedDay(day || 'Senin');
      setSelectedTime(timeSlot || '08:00');
    }
  }, [existingData, isOpen, day, timeSlot]);

  if (!isOpen) return null;

  const activeDay = isAdmin ? selectedDay : day;
  const activeTime = isAdmin ? selectedTime : timeSlot;

  const endHour = parseInt(activeTime?.split(':')[0] || 0) + 1;
  const endTime = `${endHour.toString().padStart(2, '0')}:00`;

  const handleSave = async () => {
    if (!studentName.trim() || !instrument) return;
    setIsSaving(true);
    try {
      await onSave({
        ...(existingData || {}),
        studentName: studentName.trim(),
        instrument,
        mode,
        teacherName: teacherName.trim(),
        day: activeDay,
        timeSlot: activeTime,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existingData?.objectId) return;
    setIsSaving(true);
    try {
      await onDelete(existingData.objectId);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Edit Jadwal' : '➕ Tambah Jadwal'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* If admin and not editing from grid, show day/time selectors */}
          {isAdmin ? (
            <div className="modal-selectors">
              <div className="form-group">
                <label>Hari *</label>
                <select
                  className="form-select"
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Jam *</label>
                <select
                  className="form-select"
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                >
                  {TIME_SLOTS.map(t => {
                    const eh = parseInt(t.split(':')[0]) + 1;
                    const et = `${eh.toString().padStart(2, '0')}:00`;
                    return (
                      <option key={t} value={t}>{t} - {et}</option>
                    );
                  })}
                </select>
              </div>
            </div>
          ) : (
            <div className="modal-info">
              <div className="modal-info-badge">📅 {day}</div>
              <div className="modal-info-badge">🕐 {timeSlot} - {endTime}</div>
            </div>
          )}

          <div className="form-group">
            <label>Nama Murid *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Masukkan nama murid"
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Instrumen *</label>
            <div className="instrument-selector">
              {Object.entries(INSTRUMENTS).map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  className={`instrument-option ${instrument === code ? 'selected' : ''}`}
                  onClick={() => setInstrument(code)}
                  style={
                    instrument === code
                      ? { borderColor: info.color, color: info.color, background: info.bg }
                      : {}
                  }
                >
                  {info.emoji} {code}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Mode</label>
            <div className="instrument-selector">
              {Object.entries(MODES).map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  className={`instrument-option ${mode === code ? 'selected' : ''}`}
                  onClick={() => setMode(code)}
                  style={
                    mode === code
                      ? { borderColor: info.color, color: info.color, background: info.bg }
                      : {}
                  }
                >
                  {info.emoji} {info.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Nama Guru</label>
            <input
              type="text"
              className="form-input"
              placeholder="Masukkan nama guru (opsional)"
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          {isEditing && (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isSaving}
            >
              🗑️ Hapus
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!studentName.trim() || !instrument || isSaving}
          >
            {isSaving ? '⏳ Menyimpan...' : '💾 Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

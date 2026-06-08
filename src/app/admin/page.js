'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import DaySelector from '@/components/DaySelector';
import ScheduleTable from '@/components/ScheduleTable';
import ScheduleModal from '@/components/ScheduleModal';
import Legend from '@/components/Legend';
import { fetchSchedule, saveScheduleItem, deleteScheduleItem } from '@/lib/backendless';
import { INSTRUMENTS, MODES, DAYS, TIME_SLOTS } from '@/lib/constants';
import { EMPTY_FILTERS, filterSchedule } from '@/lib/filters';
import { logoutAction } from '@/app/login/actions';
import FilterBar from '@/components/FilterBar';

export default function AdminPage() {
  const [selectedDay, setSelectedDay] = useState('Semua');
  const [scheduleData, setScheduleData] = useState([]);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState('');
  const [modalTime, setModalTime] = useState('');
  const [modalRoom, setModalRoom] = useState(1);
  const [modalData, setModalData] = useState(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSchedule();
      setScheduleData(data);
      setIsOnline(true);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setIsOnline(false);
      showToast('Gagal memuat jadwal. Periksa koneksi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleCellClick = (day, timeSlot, data, room) => {
    setModalDay(day);
    setModalTime(timeSlot);
    setModalRoom(room);
    setModalData(data);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setModalDay('Senin');
    setModalTime('08:00');
    setModalRoom(1);
    setModalData(null);
    setModalOpen(true);
  };

  const handleEditFromList = (item) => {
    setModalDay(item.day);
    setModalTime(item.timeSlot);
    setModalRoom(item.room || 1);
    setModalData(item);
    setModalOpen(true);
  };

  const handleSave = async (item) => {
    try {
      const saved = await saveScheduleItem(item);

      setScheduleData(prev => {
        const existing = prev.findIndex(
          s => s.day === item.day && s.timeSlot === item.timeSlot && s.room === item.room
        );
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = saved;
          return updated;
        }
        return [...prev, saved];
      });

      setModalOpen(false);
      showToast('✅ Jadwal berhasil disimpan!');
    } catch (error) {
      showToast('❌ Gagal menyimpan jadwal.', 'error');
    }
  };

  const handleDelete = async (objectId) => {
    try {
      await deleteScheduleItem(objectId);
      setScheduleData(prev => prev.filter(s => s.objectId !== objectId));
      setModalOpen(false);
      setDeleteConfirm(null);
      showToast('🗑️ Jadwal berhasil dihapus!');
    } catch (error) {
      showToast('❌ Gagal menghapus jadwal.', 'error');
    }
  };

  const handleDeleteFromList = async (objectId) => {
    if (deleteConfirm === objectId) {
      await handleDelete(objectId);
    } else {
      setDeleteConfirm(objectId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleCellDrop = async (draggedData, targetDay, targetTimeSlot, targetRoom, targetData) => {
    if (
      draggedData.day === targetDay &&
      draggedData.timeSlot === targetTimeSlot &&
      draggedData.room === targetRoom
    ) {
      return;
    }

    try {
      showToast('🔄 Memindahkan jadwal...', 'info');

      const promises = [];

      const updatedDragged = {
        ...draggedData,
        day: targetDay,
        timeSlot: targetTimeSlot,
        room: targetRoom
      };
      promises.push(saveScheduleItem(updatedDragged));

      let updatedTarget = null;
      if (targetData) {
        updatedTarget = {
          ...targetData,
          day: draggedData.day,
          timeSlot: draggedData.timeSlot,
          room: draggedData.room
        };
        promises.push(saveScheduleItem(updatedTarget));
      }

      await Promise.all(promises);

      setScheduleData(prev => {
        let newData = [...prev];
        
        newData = newData.filter(s => s.objectId !== draggedData.objectId);
        if (targetData) {
          newData = newData.filter(s => s.objectId !== targetData.objectId);
        }

        newData.push(updatedDragged);
        if (updatedTarget) {
          newData.push(updatedTarget);
        }

        return newData;
      });

      showToast('✅ Jadwal berhasil dipindahkan!');
    } catch (error) {
      console.error('Failed to drop schedule:', error);
      showToast('❌ Gagal memindahkan jadwal.', 'error');
    }
  };

  // Sort schedule data for list view
  const sortedData = [...scheduleData].sort((a, b) => {
    const dayOrder = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayOrder !== 0) return dayOrder;
    return a.timeSlot.localeCompare(b.timeSlot);
  });

  const filteredByDay = selectedDay === 'Semua'
    ? sortedData
    : sortedData.filter(s => s.day === selectedDay);

  // Apply filter bar on top of day filter
  const filteredListData = filterSchedule(filteredByDay, filters);

  const totalSlots = (selectedDay === 'Semua' ? 7 : 1) * TIME_SLOTS.length * 2;
  const filledSlots = filteredByDay.length; // show total filled slots (before filter bar)

  return (
    <div className="app-container">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <Link href="/" className="admin-back-link">
            ← Kembali
          </Link>
          <div className="admin-header-brand">
            <div className="header-icon">⚙️</div>
            <div>
              <h1 className="header-title">Admin Panel</h1>
              <p className="header-subtitle">Kelola Jadwal Murid</p>
            </div>
          </div>
        </div>
        <div className="admin-header-right">
          <div className="header-status">
            <span className={`status-dot ${isOnline ? '' : 'offline'}`}></span>
            {isOnline ? 'Terhubung' : 'Offline'}
          </div>
          <button onClick={() => logoutAction()} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '14px' }}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-number">{filledSlots}</div>
          <div className="admin-stat-label">Jadwal Terisi</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">{totalSlots - filledSlots}</div>
          <div className="admin-stat-label">Slot Kosong</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-number">R1 & R2</div>
          <div className="admin-stat-label">Aktif</div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="admin-controls" style={{ justifyContent: 'flex-end' }}>
        <div className="admin-actions">
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Tampilan Grid"
            >
              📅 Grid
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Tampilan List"
            >
              📋 List
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleAddNew}>
            ➕ Tambah Jadwal
          </button>
        </div>
      </div>

      <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        scheduleData={scheduleData}
      />

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">Memuat jadwal...</div>
        </div>
      ) : viewMode === 'grid' ? (
        <ScheduleTable
          scheduleData={scheduleData}
          selectedDay={selectedDay}
          filters={filters}
          onCellClick={handleCellClick}
          onCellDrop={handleCellDrop}
        />
      ) : (
        /* List View */
        <div className="admin-list-wrapper">
          {filteredListData.length === 0 ? (
            <div className="empty-state">
              📭 Belum ada jadwal
              {selectedDay !== 'Semua' && ` hari ${selectedDay}`}.
              <br />
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleAddNew}>
                ➕ Tambah Jadwal Baru
              </button>
            </div>
          ) : (
            <table className="admin-list-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Jam</th>
                  <th>Ruangan</th>
                  <th>Nama Murid</th>
                  <th>Instrumen</th>
                  <th>Mode</th>
                  <th>Guru</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredListData.map(item => {
                  const instrument = INSTRUMENTS[item.instrument];
                  const mode = MODES[item.mode];
                  const endHour = parseInt(item.timeSlot?.split(':')[0] || 0) + 1;
                  const endTime = `${endHour.toString().padStart(2, '0')}:00`;

                  return (
                    <tr key={item.objectId || `${item.day}-${item.timeSlot}`}>
                      <td>
                        <span className="list-day">{item.day}</span>
                      </td>
                      <td className="time-col">
                      <div className="list-time">{item.timeSlot}</div>
                      <div className="list-time-end">{endTime}</div>
                    </td>
                    <td>
                      <span className="list-badge">R{item.room || 1}</span>
                    </td>
                    <td className="student-col">
                      <strong>{item.studentName}</strong>
                      </td>
                      <td>
                        {instrument && (
                          <span
                            className="list-badge"
                            style={{ background: instrument.bg, color: instrument.color, border: `1px solid ${instrument.color}30` }}
                          >
                            {instrument.emoji} {item.instrument} - {instrument.short}
                          </span>
                        )}
                      </td>
                      <td>
                        {mode && (
                          <span
                            className="list-badge"
                            style={{ background: mode.bg, color: mode.color, border: `1px solid ${mode.color}30` }}
                          >
                            {mode.emoji} {mode.label}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="list-teacher">{item.teacherName || '—'}</span>
                      </td>
                      <td>
                        <div className="list-actions">
                          <button
                            className="list-action-btn edit"
                            onClick={() => handleEditFromList(item)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className={`list-action-btn delete ${deleteConfirm === item.objectId ? 'confirm' : ''}`}
                            onClick={() => handleDeleteFromList(item.objectId)}
                            title={deleteConfirm === item.objectId ? 'Klik lagi untuk konfirmasi' : 'Hapus'}
                          >
                            {deleteConfirm === item.objectId ? '⚠️' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Legend />

      <ScheduleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        day={modalDay}
        timeSlot={modalTime}
        room={modalRoom}
        existingData={modalData}
        isAdmin={true}
      />

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

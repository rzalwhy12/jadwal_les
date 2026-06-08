'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import RoomTabs from '@/components/RoomTabs';
import DaySelector from '@/components/DaySelector';
import FilterBar from '@/components/FilterBar';
import ScheduleTable from '@/components/ScheduleTable';
import Legend from '@/components/Legend';
import { fetchSchedule } from '@/lib/backendless';
import { EMPTY_FILTERS } from '@/lib/filters';

export default function HomePage() {
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [selectedDay, setSelectedDay] = useState('Semua');
  const [scheduleData, setScheduleData] = useState([]);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSchedule(selectedRoom);
      setScheduleData(data);
      setIsOnline(true);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRoom]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  return (
    <div className="app-container">
      <Header isOnline={isOnline} />

      <div className="toolbar-row">
        <RoomTabs selectedRoom={selectedRoom} onRoomChange={setSelectedRoom} />
        <Link href="/admin" className="admin-link">
          ⚙️ Admin Panel
        </Link>
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
      ) : (
        <ScheduleTable
          scheduleData={scheduleData}
          selectedDay={selectedDay}
          filters={filters}
          onCellClick={() => {}}
          readOnly
        />
      )}

      <Legend />
    </div>
  );
}

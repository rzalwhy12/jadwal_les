'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import DaySelector from '@/components/DaySelector';
import FilterBar from '@/components/FilterBar';
import ScheduleTable from '@/components/ScheduleTable';
import Legend from '@/components/Legend';
import { fetchSchedule } from '@/lib/backendless';
import { EMPTY_FILTERS } from '@/lib/filters';

export default function SchedulePage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState('Semua');
  const [scheduleData, setScheduleData] = useState([]);
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [visitorName, setVisitorName] = useState('');
  const [visitorRole, setVisitorRole] = useState('student');

  useEffect(() => {
    const name = sessionStorage.getItem('tms_visitor_name');
    const role = sessionStorage.getItem('tms_visitor_role');
    if (!name) {
      router.replace('/');
      return;
    }
    setVisitorName(name);
    if (role) setVisitorRole(role);
  }, [router]);

  const loadSchedule = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchSchedule();
      setScheduleData(data);
      setIsOnline(true);
    } catch (error) {
      console.error('Failed to load schedule:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleLogout = () => {
    sessionStorage.removeItem('tms_visitor_name');
    router.replace('/');
  };

  return (
    <div className="app-container">
      <Header isOnline={isOnline} />

      <div className="toolbar-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {visitorName && (
            <div className="visitor-welcome">
              <span>Halo, <strong>{visitorName}</strong>! 👋</span>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ padding: '4px 12px', fontSize: 13 }}>
                Ganti Nama
              </button>
            </div>
          )}
          <Link href="/admin" className="admin-link">
            ⚙️ Admin Panel
          </Link>
        </div>
      </div>

      <DaySelector selectedDay={selectedDay} onDayChange={setSelectedDay} />

      {visitorRole === 'teacher' && (
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          scheduleData={scheduleData}
        />
      )}

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
          visitorName={visitorName}
          isTeacher={visitorRole === 'teacher'}
        />
      )}

      <Legend />
    </div>
  );
}

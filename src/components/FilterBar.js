'use client';

import { useState } from 'react';
import { INSTRUMENTS, MODES } from '@/lib/constants';
import { getActiveFilterCount } from '@/lib/filters';

export default function FilterBar({ filters, onFiltersChange, scheduleData }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = getActiveFilterCount(filters);

  const toggleInstrument = (code) => {
    const current = filters.instruments || [];
    const updated = current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code];
    onFiltersChange({ ...filters, instruments: updated });
  };

  const setMode = (mode) => {
    onFiltersChange({
      ...filters,
      mode: filters.mode === mode ? '' : mode,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      instruments: [],
      mode: '',
      studentName: '',
      teacherName: '',
    });
  };

  return (
    <div className="filter-bar">
      <button
        className={`filter-toggle ${activeCount > 0 ? 'has-filters' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        🔍 Filter
        {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        <span style={{ fontSize: '10px', marginLeft: '4px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="filter-panel">
          <div className="filter-group">
            <label>Instrumen</label>
            <div className="filter-chips">
              {Object.entries(INSTRUMENTS).map(([code, info]) => (
                <button
                  key={code}
                  className={`filter-chip ${(filters.instruments || []).includes(code) ? 'selected' : ''}`}
                  onClick={() => toggleInstrument(code)}
                  style={
                    (filters.instruments || []).includes(code)
                      ? { borderColor: info.color, color: info.color, background: info.bg }
                      : {}
                  }
                >
                  {info.emoji} {code}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Mode</label>
            <div className="filter-chips">
              {Object.entries(MODES).map(([code, info]) => (
                <button
                  key={code}
                  className={`filter-chip ${filters.mode === code ? 'selected' : ''}`}
                  onClick={() => setMode(code)}
                  style={
                    filters.mode === code
                      ? { borderColor: info.color, color: info.color, background: info.bg }
                      : {}
                  }
                >
                  {info.emoji} {info.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Nama Murid</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Cari murid..."
              value={filters.studentName || ''}
              onChange={e => onFiltersChange({ ...filters, studentName: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Nama Guru</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Cari guru..."
              value={filters.teacherName || ''}
              onChange={e => onFiltersChange({ ...filters, teacherName: e.target.value })}
            />
          </div>

          {activeCount > 0 && (
            <div className="filter-group" style={{ justifyContent: 'flex-end' }}>
              <button className="filter-reset" onClick={resetFilters}>
                ✕ Reset Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

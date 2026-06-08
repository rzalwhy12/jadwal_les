'use client';

import { INSTRUMENTS, MODES } from '@/lib/constants';

export default function Legend() {
  return (
    <div className="legend">
      <div className="legend-title">Keterangan</div>
      <div className="legend-grid">
        {Object.entries(INSTRUMENTS).map(([code, info]) => (
          <div key={code} className="legend-item">
            <span className="legend-dot" style={{ background: info.color }} />
            <span className="legend-code" style={{ color: info.color }}>{code}</span>
            <span>= {info.label}</span>
          </div>
        ))}

        <div className="legend-divider" />

        {Object.entries(MODES).map(([code, info]) => (
          <div key={code} className="legend-item">
            <span className="legend-dot" style={{ background: info.color }} />
            <span className="legend-code" style={{ color: info.color }}>{code}</span>
            <span>= {info.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

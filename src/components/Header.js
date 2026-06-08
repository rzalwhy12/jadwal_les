'use client';

export default function Header({ isOnline }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-icon">🎵</div>
        <div>
          <h1 className="header-title">Jadwal TMS</h1>
          <p className="header-subtitle">Manajemen Jadwal Murid</p>
        </div>
      </div>
      <div className="header-status">
        <span className={`status-dot ${isOnline ? '' : 'offline'}`}></span>
        {isOnline ? 'Terhubung' : 'Offline'}
      </div>
    </header>
  );
}

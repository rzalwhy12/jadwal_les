'use client';

import Image from 'next/image';

export default function Header({ isOnline }) {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <Image
            src="/logo_tms.PNG"
            alt="Logo TMS"
            width={56}
            height={56}
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
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

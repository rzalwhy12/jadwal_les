'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { verifyVisitor } from '@/lib/backendless';

export default function OpeningPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState('intro'); // 'intro' | 'form'
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    // Jika sudah pernah masuk, langsung ke jadwal
    const stored = sessionStorage.getItem('tms_visitor_name');
    if (stored) {
      router.replace('/schedule');
      return;
    }
    // Tampilkan intro selama 2 detik, lalu muncul form
    const t = setTimeout(() => setPhase('form'), 2200);
    return () => clearTimeout(t);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError('');

    const { exists, isTeacher } = await verifyVisitor(name.trim());

    if (exists) {
      sessionStorage.setItem('tms_visitor_name', name.trim());
      sessionStorage.setItem('tms_visitor_role', isTeacher ? 'teacher' : 'student');
      router.push('/schedule');
    } else {
      setError('Nama tidak ditemukan. Pastikan nama terdaftar di TMS.');
      setShakeKey(k => k + 1);
      setIsLoading(false);
    }
  };

  return (
    <div className="opening-container">
      {/* Background bokeh/particles */}
      <div className="opening-bg-dots" />

      <div className={`opening-card ${phase === 'form' ? 'opening-card--expanded' : ''}`}>
        {/* Logo + Title */}
        <div className="opening-logo-wrap">
          <div className="opening-logo-ring">
            <Image
              src="/logo_tms.PNG"
              alt="Logo TMS"
              width={90}
              height={90}
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        <h1 className={`opening-title ${phase === 'form' ? 'opening-title--small' : ''}`}>
          Selamat Datang di TMS
        </h1>
        <p className="opening-subtitle">
          {phase === 'intro'
            ? 'Tempat Musik Studio — Jadwal Kelas Murid'
            : 'Masukkan namamu untuk melihat jadwal'}
        </p>

        {/* Divider */}
        <div className={`opening-divider ${phase === 'form' ? 'opening-divider--visible' : ''}`} />

        {/* Form */}
        {phase === 'form' && (
          <form
            onSubmit={handleSubmit}
            className="opening-form"
            key={shakeKey}
          >
            <div className="opening-input-wrap">
              <span className="opening-input-icon">🎵</span>
              <input
                type="text"
                className="opening-input"
                placeholder="Nama kamu..."
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="opening-error" key={`err-${shakeKey}`}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              className="opening-btn"
              disabled={isLoading || !name.trim()}
            >
              {isLoading
                ? <><span className="opening-spinner" /> Memeriksa...</>
                : <>Lihat Jadwal ➔</>
              }
            </button>

            <p className="opening-hint">
              Verifikasi untuk memastikan kamu murid TMS
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { loginAction } from './actions';

const initialState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="login-btn btn-primary" disabled={pending}>
      {pending ? '⏳ Memeriksa...' : 'Masuk ➔'}
    </button>
  );
}

export default function LoginPage() {
  // Gunakan useFormState untuk menangani hasil dari server action
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <div className="login-container">
      <Link href="/" className="login-back-link">
        ← Kembali ke Jadwal
      </Link>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔑</div>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Masukkan password untuk mengakses panel admin</p>
        </div>

        <form action={formAction} className="login-form">
          <div className="form-group">
            <label className="login-label">Password</label>
            <input 
              type="password" 
              name="password" 
              className="login-input" 
              placeholder="••••••••"
              required 
              autoFocus
            />
          </div>
          
          {state?.error && (
            <div className="login-error">
              ❌ {state.error}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

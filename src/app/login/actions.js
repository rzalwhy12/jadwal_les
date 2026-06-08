'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState, formData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPassword) {
    // Set cookie for 1 day
    const cookieStore = await cookies();
    cookieStore.set('tms_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    
    // Server action redirect directly to /admin
    redirect('/admin');
  }

  return { error: 'Password yang Anda masukkan salah.' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('tms_admin_session');
  redirect('/');
}

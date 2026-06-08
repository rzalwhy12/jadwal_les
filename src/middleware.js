import { NextResponse } from 'next/server';

export function middleware(req) {
  const sessionCookie = req.cookies.get('tms_admin_session');
  
  // Jika tidak ada cookie sesi atau tidak valid, redirect ke /login
  if (!sessionCookie || sessionCookie.value !== 'authenticated') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Hanya berlaku untuk halaman admin
  matcher: ['/admin/:path*'],
};

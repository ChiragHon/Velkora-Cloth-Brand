import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const pathname = req.nextUrl.pathname;
    const isAuthPage = pathname.startsWith('/auth');

    // If on auth page and already logged in, redirect based on role
    if (isAuthPage) {
      if (isAuth) {
        if (token.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', req.url));
        }
        return NextResponse.redirect(new URL('/account/profile', req.url));
      }
      return null;
    }

    // If not logged in, redirect to signin
    if (!isAuth) {
      let from = pathname;
      if (req.nextUrl.search) from += req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Non-admins cannot access /admin
    if (pathname.startsWith('/admin') && token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/account/profile', req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/checkout/:path*', '/auth/:path*'],
};

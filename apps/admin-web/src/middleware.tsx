import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// 1. Specify protected and public routes
const basePath = '/lattice/web-admin';
const protectedRoutes = ['/', '/events', '/map', '/pois', '/radar'];
const publicRoutes = ['/login'];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  // We strip the basePath to match our route definitions
  const path = req.nextUrl.pathname.replace(basePath, '') || '/';

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get('session')?.value;
  let session = null;
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      console.error('Failed to decrypt session', e);
    }
  }

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session) {
    const loginUrl = new URL(`${basePath}/login`, req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Redirect to / if the user is authenticated
  if (isPublicRoute && session) {
    const homeUrl = new URL(`${basePath}/`, req.nextUrl);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

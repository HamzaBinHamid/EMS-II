import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Get role from DB
  const { data: roleData } = await supabase
    .from('portal_users')
    .select('role')
    .eq('email', session.user.email)
    .single();

  const role = roleData?.role;

  const roleRoutes: Record<string, string> = {
    admin: '/admin',
    teacher: '/teacher-portal',
    student: '/student-portal',
    parent: '/parents-portal',
  };

  // Protect routes
  for (const [r, path] of Object.entries(roleRoutes)) {
    if (req.nextUrl.pathname.startsWith(path) && role !== r) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/teacher-portal/:path*',
    '/student-portal/:path*',
    '/parents-portal/:path*',
  ],
};

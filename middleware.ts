import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define public paths
const publicPaths = ['/login', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log('Middleware executing for path:', pathname)

  // Check if current path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get Next-Auth.js session token
  const token = request.cookies.get('next-auth.session-token')?.value

  // For development environment, also check secure cookie
  const devToken = request.cookies.get('__Secure-next-auth.session-token')?.value

  const hasValidToken = token || devToken;

  if (!hasValidToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
// Configure middleware to run only on protected routes
export const config = {
    matcher: [
      '/(protected)/:path*',
      '/editor/:path*',
      '/test/:path*',
        '/main/:path*'

    ]
  }

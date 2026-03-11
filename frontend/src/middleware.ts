import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Completely transparent middleware - does nothing
  // All authentication is handled client-side in page components
  return NextResponse.next()
}

// TEMPORARILY DISABLED - No routes are protected
// This ensures /, /login, /signup work without any interference
export const config = {
  matcher: [], // Empty array = middleware doesn't run on ANY route
}
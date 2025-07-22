// middleware.ts - Next.js 15 Middleware for Admin Authentication
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for admin session
    const adminToken = request.cookies.get('admin-token')
    
    // If no token and not on login page, redirect to login
    if (!adminToken && !request.nextUrl.pathname.includes('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // If has token and on login page, redirect to bookings
    if (adminToken && request.nextUrl.pathname.includes('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/bookings', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
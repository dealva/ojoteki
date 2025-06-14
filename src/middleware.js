import { NextResponse } from 'next/server';

export function middleware(request) {
  // Do nothing - just pass the request through
  return NextResponse.next();
}

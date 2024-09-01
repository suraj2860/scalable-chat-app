import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  if (token && token.id) {    
    req.headers.set('current-user-id', token.id.toString());
  }

  // Redirect to home page if logged in and trying to access the sign-in page
  if (token && pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // console.log(token);
  
  // Redirect to sign-in page if not logged in and trying to access a protected route
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Continue with the request if no conditions match
  return NextResponse.next();
}

// Configure the middleware to run on the home page and sign-in page
export const config = {
  matcher: ['/', '/sign-in'],
};

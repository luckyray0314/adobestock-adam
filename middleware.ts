import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtToken } from './libs/auth';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest, response:NextResponse) {
  // Check if token exists in cookies
  const { url, nextUrl, cookies } = request;
  const session = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    raw: true,
  })
  
  const {value: token} = cookies.get('token') ?? {value: null};
  const hasVerifiedToken = token && (await verifyJwtToken(token));
  if(nextUrl.pathname==='/'){
    return NextResponse.redirect(new URL('/home', url));
  }

  if(nextUrl.pathname === '/login' || nextUrl.pathname === '/register'){
    if(!session && !hasVerifiedToken){
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.redirect(new URL('/home', url));
  }

  if(!hasVerifiedToken && !session && nextUrl.pathname === "/home") {
    const response = NextResponse.redirect(new URL('/login', url));
    response.cookies.delete('token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
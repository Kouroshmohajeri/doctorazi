import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt'; // Or your NextAuth configuration

const protectedPaths = ['/dashboard/*']; // Adjust protected routes as needed
const userRoleRedirectMap = {
  1: '/dashboard/clients', // Redirect for user_type 1
  2: '/dashboard/doctor',  // Redirect for user_type 2
  3: '/dashboard/author',  // Redirect for user_type 3
  // Add more mappings for other user types
};

export function middleware(request) {
  const token = getToken({ req: request });

  if (protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      // Redirect to login if no valid token
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = decodeToken(token); // Assuming you have a decodeToken function
    const redirectUrl = userRoleRedirectMap[user.user_type];

    if (!redirectUrl) {
      console.warn(`No redirect mapping found for user_type: ${user.user_type}`);
      // Handle cases where user_type doesn't have a mapping (optional)
    } else {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

// Assuming you have a decodeToken function that extracts user info from the token
const decodeToken = (token) => {
  if (!token) return null;
  try {
    return jwt.decode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

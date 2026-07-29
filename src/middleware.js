import { NextResponse } from 'next/server';
import { createSlug } from '@/functions/createSlug';

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Skip static files, api routes, and next internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // We only want to clean segments that might be dirty slugs (e.g., /kashmir%20divine%20journey)
  // Split by '/' and clean each segment (except the first empty one from split)
  const segments = pathname.split('/');
  
  let hasChanges = false;
  const cleanSegments = segments.map(segment => {
    if (!segment) return segment; // keep empty string for root '/'
    
    // Decode first to handle %20 etc, then apply createSlug
    let decodedSegment = segment;
    try {
      decodedSegment = decodeURIComponent(segment);
    } catch (e) {
      // Ignore decoding errors
    }
    
    const cleanSegment = createSlug(decodedSegment);
    if (segment !== cleanSegment && decodeURIComponent(segment) !== cleanSegment) {
      hasChanges = true;
    }
    return cleanSegment;
  });

  if (hasChanges) {
    const cleanPathname = cleanSegments.join('/');
    
    // Construct the new URL with the clean pathname, preserving search params
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = cleanPathname;
    
    return NextResponse.redirect(newUrl, 301); // 301 Permanent Redirect for SEO
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

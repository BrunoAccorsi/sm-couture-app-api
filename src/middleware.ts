import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

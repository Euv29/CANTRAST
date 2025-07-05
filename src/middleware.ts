import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Rotas públicas que não requerem autenticação
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/signin(.*)',
  '/auth/signup(.*)',
  '/api/webhooks/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
  // Se não for uma rota pública, verificar autenticação
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    
    if (!userId) {
      // Redirecionar para login se não autenticado
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

/*
    ESTE MIDDLEWARE EVALUA SI HAY UNA AUTENTICACION VALIDA EN EL SISTEMA CADA VEZ QUE SE ENTRA
    EN UNA RUTA DE NEXT
*/

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/register', '/api/auth']
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    if (isPublicPath) {
        return NextResponse.next()
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // Si no hay token y no es una ruta pública, redirigir al login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Aquí puedes añadir más lógica de verificación de permisos si necesitas
    // const tokenAccess = (token as any).token.tokenAccess
    // Verificar permisos específicos...

    return NextResponse.next()
}

// Configuración para especificar en qué rutas se ejecutará el middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, etc.
         * - routes that start with /api/auth (NextAuth routes)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/auth).*)',
        /* '/:path*'  // Todas las rutas */
    ],
}
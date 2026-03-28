import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// 1. DICCIONARIO DE PERMISOS (RBAC)
// Aquí mapeas qué rutas exigen qué permisos. Es muy escalable.
const routePermissions: Record<string, string> = {
  '/api/crm/test': 'clientes.ver', 
  '/api/crm/customers': 'clientes.crear',
  // Ejemplos para el futuro:
  // '/api/crm/clientes/crear': 'clientes.crear',
  // '/api/crm/facturacion': 'facturas.ver'
};

export async function middleware(request: NextRequest) {
  
if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const authHeader = request.headers.get('authorization');

  // Verificación 1: ¿Trae token? (Error 401 - No autenticado)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No autorizado. Token faltante.' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Extraer los permisos del payload del token (le decimos a TypeScript que es un array de strings)
    const userPermissions = (payload.permissions as string[]) || [];
    const pathname = request.nextUrl.pathname;

    // 2. VALIDACIÓN DE PERMISOS
    // Buscamos si la ruta a la que intenta entrar está en nuestro diccionario
    const matchedRoute = Object.keys(routePermissions).find(route => pathname.startsWith(route));

    if (matchedRoute) {
      const permissionNeeded = routePermissions[matchedRoute];
      
      // Si el usuario no tiene el permiso requerido en su array...
      if (!userPermissions.includes(permissionNeeded)) {
        return NextResponse.json(
          { 
            error: 'Acceso denegado.', 
            details: `No tienes el permiso requerido: ${permissionNeeded}` 
          }, 
          { status: 403 } // Error 403: Prohibido (Sé quién eres, pero no puedes pasar)
        );
      }
    }

    // 3. Inyectar datos en los headers para que la ruta final los pueda usar
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);
    requestHeaders.set('x-user-email', payload.email as string);
    // Opcional: pasar los permisos por si la API necesita hacer validaciones extra
    requestHeaders.set('x-user-permissions', JSON.stringify(userPermissions));

    return NextResponse.next({
      request: { headers: requestHeaders },
    });

  } catch (error) {
    console.error('Error en Middleware:', error);
    return NextResponse.json({ error: 'Token inválido o expirado.' }, { status: 401 });
  }
}

export const config = {
  matcher: [
    '/api/crm/:path*',
  ],
};
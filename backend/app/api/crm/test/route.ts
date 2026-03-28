import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extraemos los headers que nuestro Middleware inyectó
  const userId = request.headers.get('x-user-id');
  const userEmail = request.headers.get('x-user-email');

  return NextResponse.json({
    message: '¡Éxito! Has entrado a la zona segura del CRM.',
    data: {
      userId: userId,
      email: userEmail,
      info: 'Aquí en el futuro devolveremos datos de clientes, ventas, etc.'
    }
  }, { status: 200 });
}
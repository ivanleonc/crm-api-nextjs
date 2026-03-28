import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // 1. Buscar al usuario
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = users[0];

    // 2. Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // 3. ¡NUEVO! Buscar los roles y permisos del usuario usando un JOIN múltiple
    const [roleData]: any = await pool.query(
      `SELECT r.name AS role, p.name AS permission 
       FROM user_roles ur
       INNER JOIN roles r ON ur.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE ur.user_id = ?`,
      [user.id]
    );

    // 4. Transformar los datos de SQL en arrays limpios sin duplicados
    const roles = [...new Set(roleData.map((row: any) => row.role))];
    const permissions = [...new Set(roleData
      .filter((row: any) => row.permission !== null) // Filtramos si un rol no tiene permisos asignados
      .map((row: any) => row.permission)
    )];

    // 5. Generar el Token inyectando roles y permisos
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        roles: roles,             // Ej: ['admin', 'sales']
        permissions: permissions  // Ej: ['customers.create', 'customers.view']
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    return NextResponse.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        email: user.email,
        roles,        // Devolvemos esto al frontend para que pueda ocultar/mostrar botones
        permissions
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
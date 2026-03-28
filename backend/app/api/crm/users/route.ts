import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs'; // Asumo que ya lo tienes instalado por el login

// GET: Listar todos los usuarios
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  try {
    const connection = await pool.getConnection();

    try {
      // Usamos una subconsulta con GROUP_CONCAT para traer los roles en una sola línea (ej: "admin, ventas")
      let query = `
        SELECT 
          u.id, 
          u.first_name, 
          u.last_name, 
          u.email, 
          u.is_active, 
          u.created_at,
          (SELECT GROUP_CONCAT(r.name SEPARATOR ', ') 
           FROM user_roles ur 
           JOIN roles r ON ur.role_id = r.id 
           WHERE ur.user_id = u.id) as roles
        FROM users u
      `;
      const queryParams: any[] = [];

      if (search) {
        query += ` WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?`;
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern);
      }

      query += ` ORDER BY u.id DESC`;

      const [rows] = await connection.query(query, queryParams);
      
      return NextResponse.json({ data: rows }, { status: 200 });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST: Crear un nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, password, role_id } = body;

    // Validación básica
    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos obligatorios deben ser llenados' }, { status: 400 });
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Encriptar la contraseña
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);

      // 2. Insertar el usuario
      const [userResult]: any = await connection.query(
        'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
        [first_name, last_name, email, password_hash]
      );

      const newUserId = userResult.insertId;

      // 3. Si se envió un role_id, lo asignamos en la tabla intermedia
      if (role_id) {
        await connection.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
          [newUserId, role_id]
        );
      }

      await connection.commit();
      return NextResponse.json({ message: 'Usuario creado exitosamente', userId: newUserId }, { status: 201 });

    } catch (dbError: any) {
      await connection.rollback();
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'El correo electrónico ya está registrado' }, { status: 409 });
      }
      throw dbError;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
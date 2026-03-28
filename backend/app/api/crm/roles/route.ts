import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      // Solo necesitamos el ID y el nombre del rol para llenar nuestro <select>
      const [rows] = await connection.query('SELECT id, name, description FROM roles ORDER BY id ASC');
      return NextResponse.json({ data: rows }, { status: 200 });
    } finally {
      connection.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los roles' }, { status: 500 });
  }
}
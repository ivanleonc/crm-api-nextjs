import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// PUT: Para actualizar un cliente
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = request.headers.get('x-user-id');
  
  // 🌟 EL CAMBIO CLAVE: Esperamos la promesa de los parámetros
  const resolvedParams = await params;
  const customerId = resolvedParams.id;

  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, company, status } = body;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [oldData]: any = await connection.query('SELECT * FROM customers WHERE id = ?', [customerId]);
      if (oldData.length === 0) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }

      await connection.query(
        'UPDATE customers SET first_name=?, last_name=?, email=?, phone=?, company=?, status=? WHERE id=?',
        [first_name, last_name, email || null, phone || null, company || null, status || 'lead', customerId]
      );

      const newValues = JSON.stringify({ first_name, last_name, email, phone, company, status });
      const oldValues = JSON.stringify(oldData[0]);

      await connection.query(
        `INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values, new_values) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, 'customers', customerId, 'UPDATE', oldValues, newValues]
      );

      await connection.commit();
      return NextResponse.json({ message: 'Cliente actualizado exitosamente' }, { status: 200 });

    } catch (dbError: any) {
      await connection.rollback();
      if (dbError.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'El email ya está en uso' }, { status: 409 });
      throw dbError;
    } finally {
      connection.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: Para eliminar un cliente
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = request.headers.get('x-user-id');
  
  // 🌟 EL CAMBIO CLAVE: Esperamos la promesa de los parámetros
  const resolvedParams = await params;
  const customerId = resolvedParams.id;

  try {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [oldData]: any = await connection.query('SELECT * FROM customers WHERE id = ?', [customerId]);
      if (oldData.length === 0) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }

      await connection.query('DELETE FROM customers WHERE id = ?', [customerId]);

      await connection.query(
        `INSERT INTO audit_logs (user_id, table_name, record_id, action, old_values) VALUES (?, ?, ?, ?, ?)`,
        [userId, 'customers', customerId, 'DELETE', JSON.stringify(oldData[0])]
      );

      await connection.commit();
      return NextResponse.json({ message: 'Cliente eliminado exitosamente' }, { status: 200 });

    } catch (dbError) {
      await connection.rollback();
      throw dbError;
    } finally {
      connection.release();
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  // 1. Extraer el ID del usuario logueado que viene en los headers (puesto por el Middleware)
  const userId = request.headers.get('x-user-id');

  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, company } = body;

    // 2. Validación básica
    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'El nombre y apellido son obligatorios' }, 
        { status: 400 }
      );
    }

    // 3. Obtener una conexión exclusiva del Pool para hacer una Transacción
    const connection = await pool.getConnection();

    try {
      // Iniciar la transacción ("Todo o nada")
      await connection.beginTransaction();

      // --- A. INSERTAR EL CLIENTE ---
      const [customerResult]: any = await connection.query(
        'INSERT INTO customers (first_name, last_name, email, phone, company) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email || null, phone || null, company || null]
      );
      
      const newCustomerId = customerResult.insertId;

      // --- B. REGISTRAR LA AUDITORÍA ---
      const newValues = JSON.stringify({ 
        first_name, last_name, email, phone, company, status: 'lead' 
      });

      await connection.query(
        `INSERT INTO audit_logs (user_id, table_name, record_id, action, new_values) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, 'customers', newCustomerId.toString(), 'INSERT', newValues]
      );

      // Si todo salió bien, confirmamos los cambios en la base de datos
      await connection.commit();

      return NextResponse.json(
        { message: 'Cliente creado exitosamente', customerId: newCustomerId },
        { status: 201 }
      );

    } catch (dbError: any) {
      // Si algo falló (ej. email duplicado), revertimos TODOS los cambios
      await connection.rollback();
      
      // Manejar error de email duplicado específico de MySQL
      if (dbError.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ error: 'El email ya está en uso por otro cliente' }, { status: 409 });
      }
      throw dbError; // Lanzar al catch principal
      
    } finally {
      // Siempre debemos liberar la conexión para que otros usuarios la puedan usar
      connection.release();
    }

  } catch (error) {
    console.error('Error creando cliente:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // 1. Obtener parámetros de la URL (ej: ?page=1&limit=10&search=carlos)
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Calcular el "salto" de registros (Offset)
    const offset = (page - 1) * limit;

    let dataQuery = 'SELECT id, first_name, last_name, email, phone, company, status, created_at FROM customers';
    let countQuery = 'SELECT COUNT(*) as total FROM customers';
    const queryParams: any[] = [];

    // 2. Si el usuario escribió algo en el buscador, añadimos filtros
    if (search) {
      const searchTerm = `%${search}%`;
      const whereClause = ' WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?';
      dataQuery += whereClause;
      countQuery += whereClause;
      // Añadimos el término de búsqueda 4 veces (una por cada columna que buscamos)
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm); 
    }

    // 3. Añadir orden y paginación a la consulta principal
    dataQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    const dataParams = [...queryParams, limit, offset];

    // 4. Ejecutar ambas consultas en paralelo para mayor velocidad
    const [ [dataRows], [countRows] ]: any = await Promise.all([
      pool.query(dataQuery, dataParams),
      pool.query(countQuery, queryParams)
    ]);

    const totalRecords = countRows[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // 5. Devolver la respuesta estructurada
    return NextResponse.json({
      data: dataRows,
      pagination: {
        total_records: totalRecords,
        total_pages: totalPages,
        current_page: page,
        per_page: limit
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
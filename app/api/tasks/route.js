import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextResponse } from 'next/server';

export async function GET() {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas and MONGODB_URI is correct.' }, { status: 503 });
  }
  try {
    const tasks = await Task.find({}).sort({ startDate: 1 }).lean();
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Fallo de conexión a la base de datos' }, { status: 503 });
  }
  try {
    const body = await request.json();
    console.log('--- NUEVA TAREA RECIBIDA ---');
    console.log('Body:', body);
    
    // Validación manual de campos requeridos para loguear errores específicos
    const requiredFields = ['title', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('Campos faltantes:', missingFields);
      return NextResponse.json({ 
        success: false, 
        error: `Faltan campos obligatorios: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    const task = await Task.create(body);
    console.log('✅ Tarea creada con ID:', task._id);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error('❌ Error detallado en POST /api/tasks:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 400 });
  }
}

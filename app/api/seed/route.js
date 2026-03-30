import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextResponse } from 'next/server';

const tasks = [
  { title: 'Planificación Estratégica Q3', startDate: '2026-03-01', endDate: '2026-03-10', color: '#1E3A8A', priority: 'High', subtasks: [] },
  { title: 'Análisis de Mercado Borcelle', startDate: '2026-03-05', endDate: '2026-03-15', color: '#1E3A8A', priority: 'Medium', subtasks: [] },
  { title: 'Definición de KPIs Corporativos', startDate: '2026-03-08', endDate: '2026-03-20', color: '#1E3A8A', priority: 'High', subtasks: [] },
  { title: 'Optimización de Procesos Internos', startDate: '2026-03-12', endDate: '2026-03-25', color: '#3B82F6', priority: 'Medium', subtasks: [] },
  { title: 'Auditoría de Sistemas TI', startDate: '2026-03-18', endDate: '2026-03-28', color: '#3B82F6', priority: 'High', subtasks: [] },
  { title: 'Capacitación de Personal Senior', startDate: '2026-03-22', endDate: '2026-04-05', color: '#3B82F6', priority: 'Low', subtasks: [] },
  { title: 'Lanzamiento Nueva App Móvil', startDate: '2026-03-26', endDate: '2026-04-10', color: '#8B5CF6', priority: 'High', subtasks: [] },
  { title: 'Investigación I+D Borcelle Lab', startDate: '2026-04-01', endDate: '2026-04-15', color: '#8B5CF6', priority: 'Medium', subtasks: [] },
  { title: 'Implementación IA en Logística', startDate: '2026-04-05', endDate: '2026-04-20', color: '#8B5CF6', priority: 'High', subtasks: [] },
  { title: 'Cierre Fiscal Anual', startDate: '2026-04-12', endDate: '2026-04-25', color: '#EF4444', priority: 'High', subtasks: [] },
  { title: 'Renovación Licencias Globales', startDate: '2026-04-18', endDate: '2026-04-30', color: '#EF4444', priority: 'High', subtasks: [] },
  { title: 'Mantenimiento Servidores Core', startDate: '2026-04-22', endDate: '2026-05-05', color: '#EF4444', priority: 'Medium', subtasks: [] },
  { title: 'Revisión de Seguridad Perimetral', startDate: '2026-04-28', endDate: '2026-05-15', color: '#EF4444', priority: 'High', subtasks: [] },
];

export async function GET() {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }

  try {
    await Task.deleteMany({});
    await Task.insertMany(tasks);
    return NextResponse.json({ success: true, message: 'Database seeded successfully with 13 tasks' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

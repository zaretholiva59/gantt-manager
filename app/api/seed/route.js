import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextResponse } from 'next/server';

const corporateTasks = [
  // JULIO 2026
  { title: 'Auditoría Inicial Borcelle', startDate: '2026-07-01', endDate: '2026-07-10', color: '#1E3A8A', priority: 'High' },
  { title: 'Análisis de Riesgos Q3', startDate: '2026-07-08', endDate: '2026-07-18', color: '#1E3A8A', priority: 'Medium' },
  { title: 'Definición de Roadmap TI', startDate: '2026-07-15', endDate: '2026-07-25', color: '#1E3A8A', priority: 'High' },
  { title: 'Diseño de Infraestructura Cloud', startDate: '2026-07-22', endDate: '2026-08-02', color: '#1E3A8A', priority: 'Medium' },
  
  // AGOSTO 2026
  { title: 'Migración de Servidores Core', startDate: '2026-07-28', endDate: '2026-08-10', color: '#3B82F6', priority: 'High' },
  { title: 'Implementación de IA Logística', startDate: '2026-08-05', endDate: '2026-08-15', color: '#3B82F6', priority: 'High' },
  { title: 'Pruebas de Estrés de Red', startDate: '2026-08-12', endDate: '2026-08-22', color: '#3B82F6', priority: 'Medium' },
  
  // SEPTIEMBRE 2026
  { title: 'Optimización de Consultas SQL', startDate: '2026-08-18', endDate: '2026-09-01', color: '#8B5CF6', priority: 'Medium' },
  { title: 'Despliegue Staging Corporativo', startDate: '2026-08-25', endDate: '2026-09-05', color: '#8B5CF6', priority: 'High' },
  { title: 'QA Final de Aplicaciones', startDate: '2026-09-02', endDate: '2026-09-12', color: '#8B5CF6', priority: 'Medium' },
  
  // GRUPO FINAL
  { title: 'Capacitación Ejecutiva Senior', startDate: '2026-09-08', endDate: '2026-09-18', color: '#EF4444', priority: 'Low' },
  { title: 'Lanzamiento Global Borcelle', startDate: '2026-09-15', endDate: '2026-09-25', color: '#EF4444', priority: 'High' },
  { title: 'Soporte Post-Lanzamiento L1', startDate: '2026-09-22', endDate: '2026-10-05', color: '#EF4444', priority: 'Medium' },
];

export async function GET() {
  console.log('🚀 SEED ENDPOINT: Iniciando población forzada de datos...');
  
  const conn = await dbConnect();
  if (!conn) {
    console.error('❌ SEED ERROR: No se pudo conectar a MongoDB. Revisa los logs anteriores.');
    return NextResponse.json({ 
      success: false, 
      error: 'Error de conexión. Posible fallo de Whitelist o Credenciales.' 
    }, { status: 503 });
  }

  try {
    console.log('🗑️ SEED: Limpiando colección de tareas...');
    await Task.deleteMany({});
    
    console.log('📤 SEED: Insertando 13 tareas corporativas...');
    const result = await Task.insertMany(corporateTasks);
    
    console.log('✅ SEED COMPLETADO: Tareas insertadas con éxito.');
    return NextResponse.json({ 
      success: true, 
      count: result.length, 
      message: 'Base de datos reiniciada con cronograma Borcelle.' 
    });
  } catch (error) {
    console.error('❌ SEED ERROR CRÍTICO:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/tasks.json');

const corporateTasks = [
  // JULIO 2026
  { id: '1', title: 'Auditoría Inicial Borcelle', startDate: '2026-07-01', endDate: '2026-07-10', color: '#1E3A8A', priority: 'High', status: 'Pending' },
  { id: '2', title: 'Análisis de Riesgos Q3', startDate: '2026-07-08', endDate: '2026-07-18', color: '#1E3A8A', priority: 'Medium', status: 'Pending' },
  { id: '3', title: 'Definición de Roadmap TI', startDate: '2026-07-15', endDate: '2026-07-25', color: '#1E3A8A', priority: 'High', status: 'Pending' },
  { id: '4', title: 'Diseño de Infraestructura Cloud', startDate: '2026-07-22', endDate: '2026-08-02', color: '#1E3A8A', priority: 'Medium', status: 'Pending' },
  
  // AGOSTO 2026
  { id: '5', title: 'Migración de Servidores Core', startDate: '2026-07-28', endDate: '2026-08-10', color: '#3B82F6', priority: 'High', status: 'Pending' },
  { id: '6', title: 'Implementación de IA Logística', startDate: '2026-08-05', endDate: '2026-08-15', color: '#3B82F6', priority: 'High', status: 'Pending' },
  { id: '7', title: 'Pruebas de Estrés de Red', startDate: '2026-08-12', endDate: '2026-08-22', color: '#3B82F6', priority: 'Medium', status: 'Pending' },
  
  // SEPTIEMBRE 2026
  { id: '8', title: 'Optimización de Consultas SQL', startDate: '2026-08-18', endDate: '2026-09-01', color: '#8B5CF6', priority: 'Medium', status: 'Pending' },
  { id: '9', title: 'Despliegue Staging Corporativo', startDate: '2026-08-25', endDate: '2026-09-05', color: '#8B5CF6', priority: 'High', status: 'Pending' },
  { id: '10', title: 'QA Final de Aplicaciones', startDate: '2026-09-02', endDate: '2026-09-12', color: '#8B5CF6', priority: 'Medium', status: 'Pending' },
  
  // GRUPO FINAL
  { id: '11', title: 'Capacitación Ejecutiva Senior', startDate: '2026-09-08', endDate: '2026-09-18', color: '#EF4444', priority: 'Low', status: 'Pending' },
  { id: '12', title: 'Lanzamiento Global Borcelle', startDate: '2026-09-15', endDate: '2026-09-25', color: '#EF4444', priority: 'High', status: 'Pending' },
  { id: '13', title: 'Soporte Post-Lanzamiento L1', startDate: '2026-09-22', endDate: '2026-10-05', color: '#EF4444', priority: 'Medium', status: 'Pending' },
];

export async function GET() {
  console.log('🚀 SEED ENDPOINT: Iniciando población forzada de datos JSON...');
  
  try {
    // Asegurar que el directorio data existe
    const dataDir = path.dirname(DATA_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    console.log('📤 SEED: Escribiendo 13 tareas corporativas en tasks.json...');
    await fs.writeFile(DATA_FILE, JSON.stringify(corporateTasks, null, 2), 'utf8');
    
    console.log('✅ SEED COMPLETADO: Tareas insertadas con éxito en JSON.');
    return NextResponse.json({ 
      success: true, 
      count: corporateTasks.length, 
      message: 'Base de datos JSON reiniciada con cronograma Borcelle.' 
    });
  } catch (error) {
    console.error('❌ SEED ERROR CRÍTICO:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

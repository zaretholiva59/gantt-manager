import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

// Definición de esquema para evitar dependencias circulares en el script
const TaskSchema = new mongoose.Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  priority: { type: String, enum: ['High', 'Medium', 'Low'] },
  color: String,
  subtasks: [{ title: String, completed: Boolean }],
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

const tasks = [
  // JULIO 2026
  { title: 'Análisis de Requerimientos Borcelle', startDate: '2026-07-01', endDate: '2026-07-10', color: '#67b7dc', priority: 'High', subtasks: [] },
  { title: 'Diseño de Arquitectura de Datos', startDate: '2026-07-08', endDate: '2026-07-18', color: '#67b7dc', priority: 'Medium', subtasks: [] },
  { title: 'Configuración de Infraestructura Cloud', startDate: '2026-07-15', endDate: '2026-07-25', color: '#67b7dc', priority: 'High', subtasks: [] },
  { title: 'Desarrollo de Prototipo UI/UX', startDate: '2026-07-22', endDate: '2026-08-02', color: '#67b7dc', priority: 'Medium', subtasks: [] },
  
  // AGOSTO 2026
  { title: 'Implementación de API Core', startDate: '2026-07-28', endDate: '2026-08-10', color: '#6794dc', priority: 'High', subtasks: [] },
  { title: 'Integración de Pasarela de Pagos', startDate: '2026-08-05', endDate: '2026-08-15', color: '#6794dc', priority: 'High', subtasks: [] },
  { title: 'Pruebas de Seguridad Perimetral', startDate: '2026-08-12', endDate: '2026-08-22', color: '#6794dc', priority: 'Medium', subtasks: [] },
  
  // SEPTIEMBRE 2026
  { title: 'Optimización de Consultas DB', startDate: '2026-08-18', endDate: '2026-09-01', color: '#a367dc', priority: 'Medium', subtasks: [] },
  { title: 'Despliegue en Ambiente de Staging', startDate: '2026-08-25', endDate: '2026-09-05', color: '#a367dc', priority: 'High', subtasks: [] },
  { title: 'Control de Calidad (QA) Final', startDate: '2026-09-02', endDate: '2026-09-12', color: '#a367dc', priority: 'Medium', subtasks: [] },
  
  // GRUPO FINAL
  { title: 'Capacitación a Usuarios Clave', startDate: '2026-09-08', endDate: '2026-09-18', color: '#dc6767', priority: 'Low', subtasks: [] },
  { title: 'Lanzamiento Oficial Borcelle', startDate: '2026-09-15', endDate: '2026-09-25', color: '#dc6767', priority: 'High', subtasks: [] },
  { title: 'Soporte Post-Lanzamiento Semanal', startDate: '2026-09-22', endDate: '2026-10-05', color: '#dc6767', priority: 'Medium', subtasks: [] },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI no encontrada en .env.local');
    process.exit(1);
  }

  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conexión establecida');

    await Task.deleteMany({});
    console.log('🗑️ Colección de tareas limpiada');

    const result = await Task.insertMany(tasks);
    console.log(`🚀 Éxito: Se han insertado ${result.length} tareas corporativas`);
    
    console.log('--- Resumen del Cronograma ---');
    result.forEach(t => console.log(`- ${t.title}: ${t.startDate.toLocaleDateString()} a ${t.endDate.toLocaleDateString()}`));

    await mongoose.disconnect();
    console.log('👋 Conexión cerrada. Script finalizado.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    process.exit(1);
  }
}

seed();

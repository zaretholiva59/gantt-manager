import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

const TaskSchema = new mongoose.Schema({
  title: String,
  startDate: Date,
  endDate: Date,
  priority: String,
  color: String,
  subtasks: [{ title: String, completed: Boolean }],
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

const tasks = [
  // GRUPO ESTRATEGIA (AZUL PROFUNDO - #1E3A8A)
  { title: 'Planificación Estratégica Q3', startDate: '2026-03-01', endDate: '2026-03-10', color: '#1E3A8A', priority: 'High', subtasks: [] },
  { title: 'Análisis de Mercado Borcelle', startDate: '2026-03-05', endDate: '2026-03-15', color: '#1E3A8A', priority: 'Medium', subtasks: [] },
  { title: 'Definición de KPIs Corporativos', startDate: '2026-03-08', endDate: '2026-03-20', color: '#1E3A8A', priority: 'High', subtasks: [] },
  
  // GRUPO OPERACIONES (AZUL CIELO - #3B82F6)
  { title: 'Optimización de Procesos Internos', startDate: '2026-03-12', endDate: '2026-03-25', color: '#3B82F6', priority: 'Medium', subtasks: [] },
  { title: 'Auditoría de Sistemas TI', startDate: '2026-03-18', endDate: '2026-03-28', color: '#3B82F6', priority: 'High', subtasks: [] },
  { title: 'Capacitación de Personal Senior', startDate: '2026-03-22', endDate: '2026-04-05', color: '#3B82F6', priority: 'Low', subtasks: [] },
  
  // GRUPO INNOVACIÓN (PÚRPURA - #8B5CF6)
  { title: 'Lanzamiento Nueva App Móvil', startDate: '2026-03-26', endDate: '2026-04-10', color: '#8B5CF6', priority: 'High', subtasks: [] },
  { title: 'Investigación I+D Borcelle Lab', startDate: '2026-04-01', endDate: '2026-04-15', color: '#8B5CF6', priority: 'Medium', subtasks: [] },
  { title: 'Implementación IA en Logística', startDate: '2026-04-05', endDate: '2026-04-20', color: '#8B5CF6', priority: 'High', subtasks: [] },
  
  // GRUPO CRÍTICO (ROJO - #EF4444)
  { title: 'Cierre Fiscal Anual', startDate: '2026-04-12', endDate: '2026-04-25', color: '#EF4444', priority: 'High', subtasks: [] },
  { title: 'Renovación Licencias Globales', startDate: '2026-04-18', endDate: '2026-04-30', color: '#EF4444', priority: 'High', subtasks: [] },
  { title: 'Mantenimiento Servidores Core', startDate: '2026-04-22', endDate: '2026-05-05', color: '#EF4444', priority: 'Medium', subtasks: [] },
  { title: 'Revisión de Seguridad Perimetral', startDate: '2026-04-28', endDate: '2026-05-15', color: '#EF4444', priority: 'High', subtasks: [] },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    await Task.insertMany(tasks);
    console.log('Inserted 13 professional tasks for Borcelle Company');

    await mongoose.disconnect();
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();

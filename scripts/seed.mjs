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
  // BLUE GROUP (#67b7dc)
  { title: 'Task One', startDate: '2016-07-25', endDate: '2016-07-30', color: '#67b7dc', priority: 'High', subtasks: [{ title: 'Subtask 1', completed: false }] },
  { title: 'Task Two', startDate: '2016-07-26', endDate: '2016-08-01', color: '#67b7dc', priority: 'Medium', subtasks: [] },
  { title: 'Task Three', startDate: '2016-07-26', endDate: '2016-08-04', color: '#67b7dc', priority: 'Low', subtasks: [] },
  { title: 'Task Four', startDate: '2016-07-26', endDate: '2016-08-07', color: '#67b7dc', priority: 'Medium', subtasks: [] },
  
  // DARKER BLUE GROUP (#6794dc)
  { title: 'Task Five', startDate: '2016-07-31', endDate: '2016-08-11', color: '#6794dc', priority: 'High', subtasks: [] },
  { title: 'Task Six', startDate: '2016-07-31', endDate: '2016-08-06', color: '#6794dc', priority: 'Medium', subtasks: [] },
  { title: 'Task Seven', startDate: '2016-08-03', endDate: '2016-08-16', color: '#6794dc', priority: 'Low', subtasks: [] },
  
  // PURPLE GROUP (#a367dc)
  { title: 'Task Eight', startDate: '2016-08-07', endDate: '2016-08-19', color: '#a367dc', priority: 'High', subtasks: [] },
  { title: 'Task Nine', startDate: '2016-08-07', endDate: '2016-08-12', color: '#a367dc', priority: 'Medium', subtasks: [] },
  { title: 'Task Ten', startDate: '2016-08-10', endDate: '2016-08-18', color: '#a367dc', priority: 'Low', subtasks: [] },
  
  // RED/CORAL GROUP (#dc6767)
  { title: 'Task Eleven', startDate: '2016-08-08', endDate: '2016-08-20', color: '#dc6767', priority: 'High', subtasks: [] },
  { title: 'Task Twelve', startDate: '2016-08-12', endDate: '2016-08-24', color: '#dc6767', priority: 'Medium', subtasks: [] },
  { title: 'Task Thirteen', startDate: '2016-08-17', endDate: '2016-08-29', color: '#dc6767', priority: 'Low', subtasks: [] },
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await Task.deleteMany({});
  console.log('Cleared existing tasks');

  await Task.insertMany(tasks);
  console.log('Inserted 13 tasks');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

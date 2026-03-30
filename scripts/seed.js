const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  startDate: Date,
  endDate: Date,
  assignedTo: String,
  color: String,
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

const tasks = [
  // BLUE GROUP (#67b7dc)
  { title: 'Task One', startDate: '2016-07-25', endDate: '2016-07-30', color: '#67b7dc' },
  { title: 'Task Two', startDate: '2016-07-26', endDate: '2016-08-01', color: '#67b7dc' },
  { title: 'Task Three', startDate: '2016-07-26', endDate: '2016-08-04', color: '#67b7dc' },
  { title: 'Task Four', startDate: '2016-07-26', endDate: '2016-08-07', color: '#67b7dc' },
  
  // GREEN GROUP (#6794dc - following hex from prompt, though name says green)
  { title: 'Task Five', startDate: '2016-07-31', endDate: '2016-08-11', color: '#6794dc' },
  { title: 'Task Six', startDate: '2016-07-31', endDate: '2016-08-06', color: '#6794dc' },
  { title: 'Task Seven', startDate: '2016-08-03', endDate: '2016-08-16', color: '#6794dc' },
  
  // PURPLE GROUP (#a367dc)
  { title: 'Task Eight', startDate: '2016-08-07', endDate: '2016-08-19', color: '#a367dc' },
  { title: 'Task Nine', startDate: '2016-08-07', endDate: '2016-08-12', color: '#a367dc' },
  { title: 'Task Ten', startDate: '2016-08-10', endDate: '2016-08-18', color: '#a367dc' },
  
  // CORAL GROUP (#dc6767)
  { title: 'Task Eleven', startDate: '2016-08-08', endDate: '2016-08-20', color: '#dc6767' },
  { title: 'Task Twelve', startDate: '2016-08-12', endDate: '2016-08-24', color: '#dc6767' },
  { title: 'Task Thirteen', startDate: '2016-08-17', endDate: '2016-08-29', color: '#dc6767' },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Task.deleteMany({});
  console.log('Cleared existing tasks');

  await Task.insertMany(tasks.map(t => ({
    ...t,
    status: 'in_progress',
    priority: 'medium',
    description: `Sample description for ${t.title}`,
    assignedTo: 'John Doe',
  })));
  console.log('Inserted 13 tasks');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

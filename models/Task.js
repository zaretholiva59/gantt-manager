import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this task.'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date.'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date.'],
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  color: {
    type: String,
    default: '#67b7dc',
  },
  subtasks: [SubtaskSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);

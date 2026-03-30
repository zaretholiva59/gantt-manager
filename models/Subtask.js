import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this subtask.'],
  },
  description: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Subtask || mongoose.model('Subtask', SubtaskSchema);

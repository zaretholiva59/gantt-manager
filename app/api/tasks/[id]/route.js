import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }
  const { id } = await params;
  try {
    console.log('Deleting task:', id);
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    console.log('Task deleted successfully');
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('DELETE /api/tasks/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PATCH(request, { params }) {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    console.log('Updating task:', id, 'with body:', body);
    const task = await Task.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    console.log('Task updated successfully');
    return NextResponse.json({ success: true, data: task });
  } catch (error) {
    console.error('PATCH /api/tasks/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

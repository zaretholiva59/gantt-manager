import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/tasks.json');

async function getTasks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveTasks(tasks) {
  await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter(t => (t._id || t.id).toString() !== id.toString());
    
    if (tasks.length === updatedTasks.length) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    
    await saveTasks(updatedTasks);
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const tasks = await getTasks();
    
    let taskFound = false;
    const updatedTasks = tasks.map(t => {
      if ((t._id || t.id).toString() === id.toString()) {
        taskFound = true;
        return { ...t, ...body };
      }
      return t;
    });

    if (!taskFound) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    await saveTasks(updatedTasks);
    const updatedTask = updatedTasks.find(t => (t._id || t.id).toString() === id.toString());
    
    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

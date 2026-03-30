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

export async function GET() {
  console.log(">>> [GET] EJECUTANDO API TASKS EN MODO JSON");
  try {
    const tasks = await getTasks();
    return NextResponse.json({ success: true, data: tasks });
  } catch (err) {
    console.error(">>> ERROR CRÍTICO EN API (GET):", err.message);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}

export async function POST(request) {
  console.log(">>> [POST] EJECUTANDO API TASKS EN MODO JSON");
  try {
    const body = await request.json();
    const tasks = await getTasks();
    
    const newTask = {
      ...body,
      id: body.id || Date.now().toString(), // Use provided id or generate one
      status: body.status || 'Pending'
    };
    
    tasks.push(newTask);
    await saveTasks(tasks);
    
    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (err) {
    console.error(">>> ERROR CRÍTICO EN API (POST):", err.message);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 400 });
  }
}

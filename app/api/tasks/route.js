import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';
import { NextResponse } from 'next/server';

export async function GET() {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Database connection failed. Check your MONGODB_URI.' }, { status: 500 });
  }
  try {
    console.log('Fetching tasks...');
    const tasks = await Task.find({}).sort({ startDate: 1 }).lean();
    console.log(`Found ${tasks.length} tasks`);
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  const conn = await dbConnect();
  if (!conn) {
    return NextResponse.json({ success: false, error: 'Database connection failed. Check your MONGODB_URI.' }, { status: 500 });
  }
  try {
    const body = await request.json();
    console.log('Creating task with body:', body);
    const task = await Task.create(body);
    console.log('Task created successfully');
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

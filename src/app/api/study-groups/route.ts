
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(request: NextRequest) {
  const studyGroups = await db.studyGroups.find();
  return NextResponse.json(studyGroups);
}

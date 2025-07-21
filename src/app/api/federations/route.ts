
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(request: NextRequest) {
  const federations = await db.federations.find();
  return NextResponse.json(federations);
}

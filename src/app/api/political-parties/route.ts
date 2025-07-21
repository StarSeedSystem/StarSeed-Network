
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(request: NextRequest) {
  const politicalParties = await db.politicalParties.find();
  return NextResponse.json(politicalParties);
}

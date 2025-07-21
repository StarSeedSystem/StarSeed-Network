
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/db';
import { User } from '@/types/content-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const user = await db.users.findUnique(userId);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
    const userId = params.userId;
    const body: Partial<User> = await request.json();

    const updatedUser = await db.users.update(userId, body);

    if (!updatedUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
}


import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/db';
import { Community } from '@/types/content-types';

export async function GET(request: NextRequest) {
  const communities = await db.communities.find();
  return NextResponse.json(communities);
}

export async function POST(request: NextRequest) {
    try {
        const body: Omit<Community, 'type'> = await request.json();
        
        if (!body.name || !body.slug || !body.description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newCommunity = await db.communities.create(body);
        return NextResponse.json(newCommunity, { status: 201 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        if (errorMessage.includes("already exists")) {
            return NextResponse.json({ error: errorMessage }, { status: 409 }); // Conflict
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

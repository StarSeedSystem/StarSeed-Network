
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const community = await db.communities.findUnique(slug);

  if (!community) {
    return NextResponse.json({ error: 'Community not found' }, { status: 404 });
  }

  return NextResponse.json(community);
}

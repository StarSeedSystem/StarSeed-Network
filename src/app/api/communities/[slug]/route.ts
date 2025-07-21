
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/data/firebase";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Community slug is required' }, { status: 400 });
    }

    const docRef = doc(db, "communities", slug);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 });
    }

    const communityData = { id: docSnap.id, ...docSnap.data() };
    return NextResponse.json(communityData);
  } catch (error) {
    console.error(`Error fetching community ${params.slug}:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

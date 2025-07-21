
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/firebase'; // Assuming you have firebase initialized db
import { collection, getDocs, addDoc } from "firebase/firestore";

// This function is kept for potential future use or for other parts of the app,
// but the creation logic is now handled client-side directly with Firestore.
export async function GET(request: NextRequest) {
  try {
    const querySnapshot = await getDocs(collection(db, "communities"));
    const communities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(communities);
  } catch (error) {
    console.error("Error fetching communities: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST is no longer needed as creation is handled on the client
// but we keep it here as an example or for other potential uses.
export async function POST(request: NextRequest) {
    return NextResponse.json({ message: "Creation handled client-side." }, { status: 405 }); // Method Not Allowed
}

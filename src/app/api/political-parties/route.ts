
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/firebase';
import { collection, getDocs } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const querySnapshot = await getDocs(collection(db, "politicalParties"));
    const politicalParties = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(politicalParties);
  } catch (error) {
    console.error("Error fetching political parties: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

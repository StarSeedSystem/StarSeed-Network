
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/data/firebase';
import { collection, getDocs } from "firebase/firestore";

export async function GET(request: NextRequest) {
  try {
    const querySnapshot = await getDocs(collection(db, "studyGroups"));
    const studyGroups = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(studyGroups);
  } catch (error) {
    console.error("Error fetching study groups: ", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

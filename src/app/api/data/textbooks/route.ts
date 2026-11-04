import { NextRequest, NextResponse } from 'next/server';
import { getTextbooks, deleteTextbook, syncIcseSyllabus } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('childId') || undefined;
  const subjectId = req.nextUrl.searchParams.get('subjectId') || undefined;
  const classGrade = req.nextUrl.searchParams.get('classGrade') || undefined;
  const textbooks = getTextbooks(childId, subjectId, classGrade);
  return NextResponse.json({ textbooks });
}

export async function POST() {
  const textbooks = syncIcseSyllabus();
  return NextResponse.json({
    success: true,
    message: 'Synced all 9 official ICSE E-Books (Class 4 & UKG) with 46 chapters!',
    count: textbooks.length,
    textbooks,
  });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing textbook id' }, { status: 400 });
  const deleted = deleteTextbook(id);
  return NextResponse.json({ success: deleted });
}


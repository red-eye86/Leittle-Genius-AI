import { NextRequest, NextResponse } from 'next/server';
import { getTextbooks, deleteTextbook } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('childId') || undefined;
  const subjectId = req.nextUrl.searchParams.get('subjectId') || undefined;
  const textbooks = getTextbooks(childId, subjectId);
  return NextResponse.json({ textbooks });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing textbook id' }, { status: 400 });
  const deleted = deleteTextbook(id);
  return NextResponse.json({ success: deleted });
}


import { NextRequest, NextResponse } from 'next/server';
import { getSubjects, addSubject, deleteSubject } from '@/lib/db/store';
import { Subject } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('childId') || undefined;
  const subjects = getSubjects(childId);
  return NextResponse.json({ subjects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      childId: body.childId,
      name: body.name,
      malayalamName: body.malayalamName || body.name,
      icon: body.icon || '📖',
      color: body.color || '#3b82f6',
      bgGradient: body.bgGradient || 'from-blue-400 to-indigo-500',
      classGrade: body.classGrade || 'Class 4',
      description: body.description || '',
      malayalamDescription: body.malayalamDescription || '',
    };
    const saved = addSubject(newSubject);
    return NextResponse.json({ success: true, subject: saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add subject' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing subject id' }, { status: 400 });
  const deleted = deleteSubject(id);
  return NextResponse.json({ success: deleted });
}


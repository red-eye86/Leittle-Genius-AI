import { NextRequest, NextResponse } from 'next/server';
import { getDb, updateChildProfile } from '@/lib/db/store';

export async function GET() {
  const db = getDb();
  return NextResponse.json({ children: db.children });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, starIncrement, ...updates } = body;

    const db = getDb();
    const child = db.children.find((c) => c.id === id);
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    if (typeof starIncrement === 'number') {
      child.stars = (child.stars || 0) + starIncrement;
      child.coins = (child.coins || 0) + starIncrement * 2;
    }

    const updated = updateChildProfile(id, { ...child, ...updates });
    return NextResponse.json({ success: true, child: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}


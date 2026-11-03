import { NextRequest, NextResponse } from 'next/server';
import { getDb, recordQuizAttempt, recordSession, getAchievements } from '@/lib/db/store';
import { QuizAttempt, LearningSession } from '@/lib/db/types';

export async function GET(req: NextRequest) {
  const childId = req.nextUrl.searchParams.get('childId');
  if (!childId) return NextResponse.json({ error: 'Missing childId' }, { status: 400 });

  const db = getDb();
  const attempts = db.quizAttempts.filter((a) => a.childId === childId);
  const sessions = db.sessions.filter((s) => s.childId === childId);
  const achievements = getAchievements(childId);
  const child = db.children.find((c) => c.id === childId);

  // Calculate analytics
  const totalQuizzes = attempts.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
    : 0;
  const totalMinutes = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Subject breakdown
  const subjectStats: Record<string, { sessions: number; minutes: number }> = {};
  sessions.forEach((s) => {
    if (!subjectStats[s.subjectId]) {
      subjectStats[s.subjectId] = { sessions: 0, minutes: 0 };
    }
    subjectStats[s.subjectId].sessions += 1;
    subjectStats[s.subjectId].minutes += s.durationMinutes;
  });

  return NextResponse.json({
    child,
    stats: {
      totalQuizzes,
      avgScore,
      totalMinutes,
      stars: child?.stars || 0,
      coins: child?.coins || 0,
      streak: child?.streakDays || 0,
    },
    attempts: attempts.slice(0, 10),
    sessions: sessions.slice(0, 15),
    achievements,
    subjectStats,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === 'quiz_attempt') {
      const attempt: QuizAttempt = {
        id: `att-${Date.now()}`,
        quizId: data.quizId,
        childId: data.childId,
        chapterId: data.chapterId,
        score: data.score,
        totalQuestions: data.totalQuestions,
        percentage: Math.round((data.score / data.totalQuestions) * 100),
        starsEarned: data.starsEarned || data.score,
        timestamp: new Date().toISOString(),
        answers: data.answers || [],
      };
      recordQuizAttempt(attempt);
      return NextResponse.json({ success: true, attempt });
    }

    if (type === 'session') {
      const session: LearningSession = {
        id: `sess-${Date.now()}`,
        childId: data.childId,
        subjectId: data.subjectId,
        chapterId: data.chapterId,
        activityType: data.activityType,
        durationMinutes: data.durationMinutes || 5,
        timestamp: new Date().toISOString(),
        notes: data.notes || '',
      };
      recordSession(session);
      return NextResponse.json({ success: true, session });
    }

    return NextResponse.json({ error: 'Unknown activity type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record progress' }, { status: 500 });
  }
}


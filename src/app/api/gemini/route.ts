import { NextResponse } from 'next/server';
import { generateAffirmations } from '@/lib/gemini';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { input, goals, mood } = body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    if (input.length > 500) {
      return NextResponse.json({ error: 'Input too long (max 500 chars)' }, { status: 400 });
    }

    const result = await generateAffirmations(input.trim(), goals, mood);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ affirmations: result.affirmations });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

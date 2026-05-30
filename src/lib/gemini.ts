import { GROQ_MODEL, GROQ_MAX_TOKENS } from '@/lib/constants';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

interface AIResponse {
  affirmations: string[];
  error?: string;
}

/**
 * Generate personalized affirmations using Groq API.
 * Server-side only — API key never exposed to client.
 */
export async function generateAffirmations(
  input: string,
  goals: string[] = [],
  mood?: string
): Promise<AIResponse> {
  if (!GROQ_API_KEY) {
    console.error('[Groq] No API key found in GROQ_API_KEY env var');
    return { affirmations: [], error: 'Groq API key not configured' };
  }

  const goalsContext = goals.length > 0
    ? `The user's personal goals are: ${goals.join(', ')}.`
    : '';

  const moodContext = mood
    ? `The user is feeling: ${mood}.`
    : '';

  const systemPrompt = `You are a compassionate wellness coach and affirmation expert. Generate 3 personalized, powerful "I am" affirmations based on the user's input.

Rules:
- Each affirmation MUST start with "I am" or "I"
- Make them specific and personal to the input
- Keep them positive, empowering, and present-tense
- Each should be 1-2 sentences max
- No numbering, no bullets, no extra formatting
- Return ONLY the 3 affirmations, each on its own line
- Do NOT include quotes around them`;

  const userMessage = `${goalsContext}\n${moodContext}\n\nUser's input: "${input}"`;

  try {
    console.log(`[Groq] Generating affirmations with model: ${GROQ_MODEL}`);

    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: GROQ_MAX_TOKENS,
        temperature: 0.8,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'no body');
      console.error(`[Groq] HTTP ${response.status}: ${errorText}`);
      return {
        affirmations: [],
        error: `AI error (${response.status}). ${response.status === 429 ? 'Rate limited — please wait and try again.' : 'Check server logs.'}`,
      };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    console.log(`[Groq] Success. Raw response:`, text.substring(0, 100));

    // Parse affirmations — split by newlines, clean up
    const affirmations = text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 10)
      .filter((line: string) =>
        line.startsWith('I ') ||
        line.startsWith('I\'') ||
        line.startsWith('My ') ||
        line.startsWith('Every ')
      )
      .slice(0, 3);

    if (affirmations.length > 0) {
      return { affirmations };
    }

    // Lenient fallback parse
    const lenientAffirmations = text
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 10 && !line.startsWith('*') && !line.startsWith('#'))
      .slice(0, 3);

    if (lenientAffirmations.length > 0) {
      return { affirmations: lenientAffirmations };
    }

    return { affirmations: [], error: 'Could not parse response. Please try again.' };

  } catch (error) {
    console.error('[Groq] Network error:', error);
    return { affirmations: [], error: 'Network error. Please check your connection.' };
  }
}

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, position, ageGroup, percentile, stats } = await req.json();

    const prompt = `You are an elite football scout. Generate a concise 3-sentence scouting evaluation for:
    Player: ${name}
    Position: \({position} | Age Group:\){ageGroup}
    Overall Percentile Rating: ${percentile}th percentile
    Per 90 Stats: ${JSON.stringify(stats)}

    Highlight key positional strengths, work rate, and tactical suitability. Keep it professional and punchy.`;

    // Example OpenAI API Call
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 120
      })
    });

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content || 'Player demonstrates high positional discipline and consistent tactical contribution across all recorded fixtures.';

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({
      summary: 'Solid youth prospect showing strong fundamental technique and high involvement rate in key transitions.'
    });
  }
}
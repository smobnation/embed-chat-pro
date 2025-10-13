import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Test the API key by making a simple request
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Make a simple test request
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: 'Hello, this is a test message.' }
      ],
      max_tokens: 10,
    });

    if (completion.choices[0]?.message?.content) {
      return NextResponse.json({ message: 'API key is valid and working!' });
    } else {
      return NextResponse.json({ error: 'API key test failed' }, { status: 400 });
    }

  } catch (error) {
    console.error('OpenAI test error:', error);
    return NextResponse.json({ error: 'Invalid API key or connection failed' }, { status: 400 });
  }
}

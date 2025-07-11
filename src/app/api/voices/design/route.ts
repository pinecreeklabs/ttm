import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { voice_description, text, auto_generate_text = false } = body;

    if (!voice_description || voice_description.length < 20 || voice_description.length > 1000) {
      return NextResponse.json({ 
        error: 'Voice description must be between 20 and 1000 characters' 
      }, { status: 400 });
    }

    const response = await fetch('https://api.elevenlabs.io/v1/text-to-voice/create-previews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        voice_description,
        text,
        auto_generate_text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorText);
      throw new Error(`Failed to design voice: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Voice design error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to design voice' 
    }, { status: 500 });
  }
}
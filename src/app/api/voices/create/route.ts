import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const files = formData.getAll('files') as File[];

    if (!name || files.length === 0) {
      return NextResponse.json({ error: 'Name and audio files are required' }, { status: 400 });
    }

    const apiFormData = new FormData();
    apiFormData.append('name', name);
    if (description) {
      apiFormData.append('description', description);
    }
    
    // Add audio files
    for (const file of files) {
      apiFormData.append('files', file);
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API Error:', response.status, errorText);
      throw new Error(`Failed to create voice: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Voice creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create voice' 
    }, { status: 500 });
  }
}
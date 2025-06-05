import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body.texts)) {
      return NextResponse.json(
        { error: 'texts field must be an array' },
        { status: 400 }
      );
    }

    if (body.texts.length > 50) {
      return NextResponse.json(
        { error: 'Batch size cannot exceed 50 texts' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/analyze/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Batch analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch analysis' },
      { status: 500 }
    );
  }
}

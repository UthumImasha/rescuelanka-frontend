import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend health check failed: ${response.status}`);
    }

const backendHealth = await response.json();

return NextResponse.json({
  status: 'healthy',
  timestamp: Date.now(),
  frontend: {
    status: 'healthy',
    version: '1.0.0',
  },
  backend: backendHealth,
});
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: Date.now(),
      frontend: {
        status: 'healthy',
        version: '1.0.0',
      },
      backend: {
        status: 'unhealthy',
        error: (error as Error).message,
      },
    }, { status: 500 });
  }
}

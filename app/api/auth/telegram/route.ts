import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy authentication to backend
 * Frontend just passes initData, backend validates everything
 */
export async function POST(request: NextRequest) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json(
        { error: 'initData is required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Forward initData to backend for validation
    const response = await fetch(`${backendUrl}/api/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Authentication failed' },
        { status: response.status }
      );
    }

    // Backend returns user data and token
    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth proxy error:', error);

    // If backend is not available, return mock data for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Backend not available, returning mock user data');
      return NextResponse.json({
        success: true,
        user: {
          id: 123456789,
          firstName: 'Dev',
          lastName: 'User',
          username: 'devuser',
          role: 'client',
        },
        token: 'mock_jwt_token',
      });
    }

    return NextResponse.json(
      { error: 'Backend service unavailable' },
      { status: 503 }
    );
  }
}

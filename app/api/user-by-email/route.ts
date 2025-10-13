import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      name: user.name,
      hasApiKey: !!user.openaiApiKey,
      apiKeyLength: user.openaiApiKey?.length || 0,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('User by email API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

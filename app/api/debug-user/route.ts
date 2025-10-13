import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Debug - Session:', session);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    console.log('Debug - User found:', user);
    
    const responseData = {
      session: {
        email: session.user.email,
        name: session.user.name
      },
      user: user ? {
        email: user.email,
        name: user.name,
        hasApiKey: !!user.openaiApiKey,
        apiKeyLength: user.openaiApiKey?.length || 0
      } : null
    };
    
    console.log('Debug - Response data:', responseData);
    
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Debug error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}

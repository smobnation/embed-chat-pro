import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

console.log('Settings API - User model imported:', User);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Settings GET - Session:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    console.log('Settings GET - User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('Settings GET - User data:', {
        email: user.email,
        hasApiKey: !!user.openaiApiKey,
        apiKeyLength: user.openaiApiKey?.length || 0
      });
    }
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      openaiApiKey: user.openaiApiKey || '',
      isDemo: process.env.DEMO === 'true'
    });

  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('Settings POST - Session:', session?.user?.email);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Settings POST - Request body:', body);
    
    const { openaiApiKey } = body;

    if (!openaiApiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    await connectDB();
    
    console.log('Settings POST - Updating user:', session.user.email, 'with API key:', openaiApiKey.substring(0, 10) + '...');
    
    // First, let's check if the user exists
    const existingUser = await User.findOne({ email: session.user.email });
    console.log('Settings POST - Existing user found:', existingUser ? 'Yes' : 'No');
    if (existingUser) {
      console.log('Settings POST - Current user data:', {
        email: existingUser.email,
        hasApiKey: !!existingUser.openaiApiKey,
        apiKeyLength: existingUser.openaiApiKey?.length || 0
      });
    }
    
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { openaiApiKey },
      { new: true }
    );
    
    console.log('Settings POST - User found/updated:', user ? 'Yes' : 'No');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Settings POST - Updated user data:', {
      email: user.email,
      hasApiKey: !!user.openaiApiKey,
      apiKeyLength: user.openaiApiKey?.length || 0,
      apiKeyPreview: user.openaiApiKey?.substring(0, 10) + '...'
    });

    console.log('Settings POST - API key saved successfully');
    return NextResponse.json({ message: 'Settings saved successfully' });

  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

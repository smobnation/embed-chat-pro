import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import BotSettings from '@/lib/models/BotSettings';
import Message from '@/lib/models/Message';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    await connectDB();
    
    // Get user data
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get total bots count for this user
    const totalBots = await BotSettings.countDocuments({ userId: user._id.toString() });
    
    // Get total messages count for this user
    const totalMessages = await Message.countDocuments({ userId: user._id.toString() });
    
    // Calculate account age
    const accountCreated = user.createdAt;
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get last login (we'll use account creation for now, but this could be tracked separately)
    const lastLogin = 'Recently'; // This could be tracked in a separate login log
    
    const analytics = {
      totalBots,
      totalMessages,
      lastLogin,
      accountCreated: accountCreated.toISOString().split('T')[0], // Format as YYYY-MM-DD
      accountAgeDays,
      hasApiKey: !!user.openaiApiKey,
      apiKeyLength: user.openaiApiKey?.length || 0
    };
    
    return NextResponse.json(analytics);

  } catch (error) {
    console.error('User analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

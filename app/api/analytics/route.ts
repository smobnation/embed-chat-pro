import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import BotSettings from '@/lib/models/BotSettings';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Store analytics data in database
    const { botId, event, timestamp } = data;
    
    await connectDB();
    
    // For now, we'll just track basic events
    // In the future, you could create a separate Analytics model for more detailed tracking
    console.log('Analytics event:', { botId, event, timestamp });

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Analytics error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('botId');
    
    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    await connectDB();

    // Get real analytics data from database
    const messages = await Message.find({ botId }).sort({ timestamp: -1 });
    
    // Get bot settings to verify bot exists
    const botSettings = await BotSettings.findOne({ botId });
    
    if (!botSettings) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Calculate summary stats from real data
    const stats = {
      totalInteractions: messages.length,
      messagesSent: messages.length, // Each message record represents a conversation
      chatOpens: messages.length, // For now, assume each message = one chat session
      uniqueSessions: new Set(messages.map(m => m.sessionId || m.timestamp)).size,
      lastActivity: messages[0]?.timestamp || null
    };

    return NextResponse.json(
      { stats, events: messages.slice(0, 50) },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Analytics error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

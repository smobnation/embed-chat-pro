import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import BotSettings from '@/lib/models/BotSettings';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const botId = searchParams.get('botId');

    await connectDB();

    if (botId) {
      // Get specific bot settings
      const botSettings = await BotSettings.findOne({ botId });
      return NextResponse.json(botSettings);
    } else {
      // Get all bots (for backward compatibility)
      const botSettings = await BotSettings.findOne({});
      return NextResponse.json(botSettings);
    }

  } catch (error) {
    console.error('Error fetching bot settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { botId, name, welcomeMessage, themeColor, faqs, documents, urls, structuredData, categories } = await request.json();

    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Upsert bot settings
    const botSettings = await BotSettings.findOneAndUpdate(
      { botId },
      {
        botId,
        name: name || 'AI Assistant',
        welcomeMessage: welcomeMessage || 'Hello! How can I help you today?',
        themeColor: themeColor || '#3B82F6',
        faqs: faqs || [],
        documents: documents || [],
        urls: urls || [],
        structuredData: structuredData || [],
        categories: categories || []
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(botSettings);

  } catch (error) {
    console.error('Error saving bot settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

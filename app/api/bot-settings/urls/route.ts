import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import BotSettings from '@/lib/models/BotSettings';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { botId, url, category, tags } = await request.json();

    if (!botId || !url) {
      return NextResponse.json(
        { error: 'Bot ID and URL are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if bot exists
    const botSettings = await BotSettings.findOne({ botId });
    if (!botSettings) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    // Scrape content from URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL content' },
        { status: 400 }
      );
    }

    const html = await response.text();
    
    // Simple HTML to text conversion (you might want to use a more sophisticated parser)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

    // Create URL source
    const urlSource = {
      id: uuidv4(),
      url: url,
      title: title,
      content: textContent,
      enabled: true,
      category: category || 'General',
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      scrapedAt: new Date()
    };

    // Add URL to bot settings
    await BotSettings.findOneAndUpdate(
      { botId },
      { 
        $push: { urls: urlSource },
        $addToSet: { categories: category || 'General' }
      }
    );

    return NextResponse.json({ 
      success: true, 
      urlSource: urlSource 
    });

  } catch (error) {
    console.error('URL scraping error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { botId, urlId } = await request.json();

    if (!botId || !urlId) {
      return NextResponse.json(
        { error: 'Bot ID and URL ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Remove URL from bot settings
    await BotSettings.findOneAndUpdate(
      { botId },
      { $pull: { urls: { id: urlId } } }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('URL deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { botId, urlId, enabled, category, tags } = await request.json();

    if (!botId || !urlId) {
      return NextResponse.json(
        { error: 'Bot ID and URL ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update URL settings
    const updateData: any = {};
    if (enabled !== undefined) updateData['urls.$.enabled'] = enabled;
    if (category !== undefined) updateData['urls.$.category'] = category;
    if (tags !== undefined) updateData['urls.$.tags'] = tags;

    await BotSettings.findOneAndUpdate(
      { botId, 'urls.id': urlId },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('URL update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

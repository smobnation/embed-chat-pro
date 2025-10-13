import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import BotSettings from '@/lib/models/BotSettings';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { botId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { botId } = params;

    await connectDB();

    // Delete bot
    const deletedBot = await BotSettings.findOneAndDelete({ botId });
    
    if (!deletedBot) {
      return NextResponse.json(
        { error: 'Bot not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Delete bot error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newEmail } = await request.json();

    if (!currentPassword || !newEmail) {
      return NextResponse.json({ error: 'Current password and new email are required' }, { status: 400 });
    }

    if (!newEmail.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Email address is already in use' }, { status: 400 });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    return NextResponse.json({ message: 'Email changed successfully' });

  } catch (error) {
    console.error('Change email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

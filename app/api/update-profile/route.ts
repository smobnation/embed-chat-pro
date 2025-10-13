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

    const { newName, newEmail, newPassword } = await request.json();

    if (!newName && !newEmail && !newPassword) {
      return NextResponse.json({ error: 'At least one field is required' }, { status: 400 });
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let message = 'Profile updated successfully!';
    let shouldSignOut = false;

    // Update name if provided
    if (newName) {
      if (newName.trim().length < 2) {
        return NextResponse.json({ error: 'Name must be at least 2 characters long' }, { status: 400 });
      }
      user.name = newName.trim();
      message = 'Name updated successfully!';
    }

    // Update email if provided
    if (newEmail) {
      if (!newEmail.includes('@')) {
        return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
      }

      // Only check if new email already exists if it's different from current email
      if (newEmail !== user.email) {
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
          return NextResponse.json({ error: 'Email address is already in use' }, { status: 400 });
        }
      }

      user.email = newEmail;
      if (newName) {
        message = 'Name and email updated successfully!';
      } else {
        message = 'Email updated successfully!';
      }
      shouldSignOut = false;
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
      }

      user.password = newPassword;
      if (newName && newEmail) {
        message = 'Name, email, and password updated successfully!';
      } else if (newName) {
        message = 'Name and password updated successfully!';
      } else if (newEmail) {
        message = 'Email and password updated successfully!';
      } else {
        message = 'Password updated successfully!';
      }
    }

    await user.save();

    return NextResponse.json({ 
      message,
      shouldSignOut,
      newName: newName || null,
      newEmail: newEmail || null
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

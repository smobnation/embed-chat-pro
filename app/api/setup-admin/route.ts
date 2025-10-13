import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { 
          message: 'Admin user already exists!',
          email: existingUser.email,
          name: existingUser.name
        },
        { status: 200 }
      );
    }

    // Create admin user
    const user = new User({
      name,
      email,
      password, // Will be hashed by pre-save middleware
    });

    await user.save();

    return NextResponse.json(
      { 
        message: 'Admin user created successfully!',
        email: user.email,
        name: user.name
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

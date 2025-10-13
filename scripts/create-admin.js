const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema (same as in your models)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatbotdb';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@chatai.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@chatai.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@chatai.com',
      password: 'admin123' // Will be hashed by pre-save middleware
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@chatai.com');
    console.log('Password: admin123');
    console.log('You can now login to the dashboard at http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

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

async function seedDatabase() {
  try {
    // Check if MONGODB_URI is set
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      console.error('💡 Please create a .env.local file with your MongoDB connection string.');
      console.error('📝 Example: MONGODB_URI="mongodb://localhost:27017/chatbotdb"');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@chatai.com' });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists!');
      console.log('📧 Email: admin@chatai.com');
      console.log('🔑 Password: 123456');
      console.log('🌐 Login at: http://localhost:3000/login');
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@chatai.com',
      password: '123456' // Will be hashed by pre-save middleware
    });

    await admin.save();
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@chatai.com');
    console.log('🔑 Password: 123456');
    console.log('🌐 Login at: http://localhost:3000/login');
    console.log('');
    console.log('💡 You can now start the application with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Connection refused - please check:');
      console.error('   1. MongoDB server is running');
      console.error('   2. MONGODB_URI in .env.local is correct');
      console.error('   3. Network connectivity to MongoDB server');
    }
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();

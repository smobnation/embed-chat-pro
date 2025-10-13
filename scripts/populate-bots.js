const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Bot Settings Schema
const BotSettingsSchema = new mongoose.Schema({
  botId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    default: 'AI Assistant'
  },
  welcomeMessage: {
    type: String,
    required: true,
    default: 'Hello! How can I help you today?'
  },
  themeColor: {
    type: String,
    required: true,
    default: '#3B82F6'
  },
  faqs: [{
    type: String
  }],
}, {
  timestamps: true
});

const BotSettings = mongoose.model('BotSettings', BotSettingsSchema);

// Sample data for generating bots
const botNames = [
  'Customer Support Bot', 'Sales Assistant', 'Technical Help Bot', 'FAQ Bot', 'Welcome Bot',
  'E-commerce Assistant', 'Booking Bot', 'Info Bot', 'Help Desk Bot', 'Support Agent',
  'AI Helper', 'Smart Assistant', 'Chat Bot', 'Service Bot', 'Guide Bot',
  'Assistant Bot', 'Helper Bot', 'Info Assistant', 'Support Bot', 'Help Bot',
  'Customer Care Bot', 'Service Assistant', 'Info Guide', 'Help Assistant', 'Support Helper',
  'AI Support', 'Smart Helper', 'Chat Assistant', 'Service Guide', 'Info Bot Pro',
  'Help Center Bot', 'Support Center', 'Customer Service', 'Tech Support', 'General Help',
  'Product Info Bot', 'Order Assistant', 'Shipping Bot', 'Payment Helper', 'Account Bot',
  'Login Assistant', 'Registration Bot', 'Profile Helper', 'Settings Bot', 'Account Guide',
  'Billing Assistant', 'Subscription Bot', 'Plan Helper', 'Upgrade Bot', 'Downgrade Assistant',
  'Feature Guide', 'Tutorial Bot', 'Learning Assistant', 'Education Bot', 'Training Helper',
  'Onboarding Bot', 'Welcome Guide', 'Getting Started', 'Setup Assistant', 'Installation Bot',
  'Configuration Helper', 'Customization Bot', 'Personalization', 'Theme Assistant', 'Style Bot',
  'Design Helper', 'Layout Bot', 'Appearance Assistant', 'Color Bot', 'Brand Helper',
  'Marketing Bot', 'Promotion Assistant', 'Campaign Bot', 'Newsletter Helper', 'Update Bot',
  'Notification Assistant', 'Alert Bot', 'Reminder Helper', 'Schedule Bot', 'Calendar Assistant',
  'Event Bot', 'Meeting Helper', 'Appointment Assistant', 'Booking Guide', 'Reservation Bot',
  'Travel Assistant', 'Trip Planner', 'Vacation Bot', 'Holiday Helper', 'Destination Guide',
  'Location Bot', 'Map Assistant', 'Navigation Helper', 'Route Bot', 'Direction Guide',
  'Weather Bot', 'Forecast Assistant', 'Climate Helper', 'Temperature Bot', 'Season Guide',
  'News Bot', 'Update Assistant', 'Information Helper', 'Current Events', 'Latest News',
  'Trend Bot', 'Popular Assistant', 'Featured Helper', 'Top Bot', 'Best Guide'
];

const welcomeMessages = [
  'Hello! How can I help you today?',
  'Hi there! What can I assist you with?',
  'Welcome! I\'m here to help you.',
  'Good day! How may I assist you?',
  'Hello! What questions do you have?',
  'Hi! I\'m your AI assistant. How can I help?',
  'Welcome! I\'m ready to answer your questions.',
  'Hello there! What do you need help with?',
  'Hi! I\'m here to provide support.',
  'Welcome! How can I make your day better?',
  'Hello! I\'m your virtual assistant.',
  'Hi! What can I do for you today?',
  'Welcome! I\'m here to help you succeed.',
  'Hello! How can I assist you today?',
  'Hi there! What brings you here?',
  'Welcome! I\'m your friendly AI helper.',
  'Hello! I\'m ready to help you.',
  'Hi! What questions can I answer?',
  'Welcome! I\'m here to provide guidance.',
  'Hello! How can I support you today?'
];

const themeColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
  '#84CC16', '#F97316', '#EC4899', '#6366F1', '#14B8A6'
];

const sampleFAQs = [
  'What are your business hours?',
  'How can I contact support?',
  'What payment methods do you accept?',
  'How do I create an account?',
  'What is your refund policy?',
  'How do I reset my password?',
  'What services do you offer?',
  'How do I cancel my subscription?',
  'What are your pricing plans?',
  'How do I update my profile?',
  'What is your privacy policy?',
  'How do I download the app?',
  'What features are available?',
  'How do I get technical support?',
  'What are the system requirements?',
  'How do I upgrade my plan?',
  'What is included in the free trial?',
  'How do I contact sales?',
  'What integrations are available?',
  'How do I get started?'
];

// Function to generate random FAQs
function generateRandomFAQs() {
  const numFAQs = Math.floor(Math.random() * 10) + 5; // 5-15 FAQs
  const shuffled = sampleFAQs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numFAQs);
}

// Function to generate a bot
function generateBot(index) {
  const botId = `bot_${String(index + 1).padStart(3, '0')}`;
  const name = botNames[index % botNames.length];
  const welcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
  const themeColor = themeColors[Math.floor(Math.random() * themeColors.length)];
  const faqs = generateRandomFAQs();

  return {
    botId,
    name,
    welcomeMessage,
    themeColor,
    faqs
  };
}

async function populateBots() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing bots (optional - remove this if you want to keep existing data)
    await BotSettings.deleteMany({});
    console.log('Cleared existing bots');

    // Generate 100 bots
    const bots = [];
    for (let i = 0; i < 100; i++) {
      bots.push(generateBot(i));
    }

    // Insert bots into database
    await BotSettings.insertMany(bots);
    console.log(`Successfully created ${bots.length} bots`);

    // Display some sample bots
    console.log('\nSample bots created:');
    const sampleBots = await BotSettings.find().limit(5);
    sampleBots.forEach(bot => {
      console.log(`- ${bot.botId}: ${bot.name} (${bot.themeColor})`);
    });

  } catch (error) {
    console.error('Error populating bots:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the script
populateBots();

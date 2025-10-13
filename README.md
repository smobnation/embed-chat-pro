# AI Chatbot Embed

A standalone AI chatbot script that businesses can embed into their websites with one line of code. Built with Next.js 14, MongoDB, and OpenAI API.

## 🚀 Features

### Admin Panel
- **Authentication**: Secure admin login/registration with NextAuth.js
- **Bot Configuration**: Customize bot name, welcome message, and theme color
- **FAQ Management**: Upload and manage FAQs in TXT format
- **Embed Code Generation**: Generate one-line embed codes for websites
- **Real-time Preview**: See changes instantly in the dashboard

### Chat Widget
- **Vanilla JavaScript**: No framework dependencies, works on any website
- **Responsive Design**: Mobile-friendly chat interface
- **Conversation History**: Persistent chat history using localStorage
- **Typing Indicators**: Visual feedback during AI responses
- **Customizable Styling**: Theme colors and branding support

### AI Integration
- **OpenAI gpt-4o-mini**: Powered by advanced AI for intelligent responses
- **FAQ-based Responses**: AI answers based on uploaded knowledge base
- **Context Awareness**: Maintains conversation context
- **Fallback Handling**: Graceful error handling and user feedback

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas (via Mongoose ODM)
- **Authentication**: NextAuth.js (Email/Password)
- **Styling**: TailwindCSS + shadcn/ui
- **AI**: OpenAI API (gpt-4o-mini)
- **Widget**: Vanilla JavaScript (no dependencies)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- OpenAI API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-chatbot-embed
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI="your-mongodb-connection-string"
MONGODB_DB="chatbotdb"
OPENAI_API_KEY="your-openai-api-key"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup

The application will automatically create the necessary collections when you first run it. No manual database setup required.

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to access the admin dashboard.

## 🎯 Usage

### Admin Dashboard

1. **Register/Login**: Create an admin account or sign in
2. **Configure Bot**: Set bot name, welcome message, and theme color
3. **Upload FAQs**: Add your knowledge base in Q&A format
4. **Get Embed Code**: Copy the generated embed code for your website

### Embedding on Websites

Add this single line to any website:

```html
<script src="https://yourdomain.com/bot.js" data-bot="BOT_ID"></script>
```

Replace `BOT_ID` with your actual bot ID from the dashboard.

### FAQ Format

Upload FAQs in this format:

```
Q: What are your business hours?
A: We're open Monday-Friday 9AM-5PM.

Q: How can I contact support?
A: You can reach us at support@example.com or call (555) 123-4567.

Q: Do you offer refunds?
A: Yes, we offer a 30-day money-back guarantee on all products.
```

## 📁 Project Structure

```
/app
  /api
    /auth/[...nextauth]/route.ts    # NextAuth configuration
    /auth/register/route.ts         # User registration
    /bot-settings/route.ts          # Bot settings CRUD
    /chat/route.ts                  # Chat API endpoint
  /dashboard/page.tsx               # Admin dashboard
  /login/page.tsx                   # Login/register page
  /layout.tsx                       # Root layout
  /page.tsx                         # Home page (redirects)
  /providers.tsx                    # Session provider
  /globals.css                      # Global styles

/lib
  /auth.ts                          # NextAuth configuration
  /db.ts                            # MongoDB connection
  /models
    /BotSettings.ts                 # Bot settings model
    /User.ts                        # User model
  /utils.ts                         # Utility functions

/components/ui/                     # shadcn/ui components
  /button.tsx
  /card.tsx
  /input.tsx
  /label.tsx
  /textarea.tsx

/public
  /bot.js                           # Embeddable widget

package.json
tailwind.config.js
tsconfig.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Bot Management
- `GET /api/bot-settings` - Get bot settings
- `POST /api/bot-settings` - Create/update bot settings

### Chat
- `POST /api/chat` - Send message to AI chatbot
  - Body: `{ botId: string, message: string }`
  - Response: `{ reply: string }`

## 🎨 Customization

### Theme Colors
The chat widget automatically uses the theme color set in the admin dashboard. Colors are applied to:
- Chat button
- Header background
- User message bubbles
- Send button

### Styling
The widget uses CSS custom properties and can be further customized by modifying the styles in `/public/bot.js`.

### Bot Behavior
Modify the system prompt in `/app/api/chat/route.ts` to change how the AI responds.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Environment Variables for Production

```env
MONGODB_URI="your-production-mongodb-uri"
MONGODB_DB="chatbotdb"
OPENAI_API_KEY="your-openai-api-key"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

## 🔒 Security Features

- **Authentication**: Secure admin access with NextAuth.js
- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Built-in protection against abuse
- **CORS**: Proper cross-origin resource sharing configuration
- **Environment Variables**: Sensitive data stored securely

## 📊 Monitoring & Analytics

The application includes basic error logging and can be extended with:
- Analytics tracking
- Usage metrics
- Error monitoring (Sentry, etc.)
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Updates

### Version 1.0.0
- Initial release
- Admin dashboard
- Embeddable widget
- OpenAI integration
- MongoDB storage
- Authentication system

---

**Built with ❤️ for businesses who want to add AI-powered chat to their websites.**

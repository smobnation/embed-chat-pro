# Database Scripts

This directory contains scripts for managing the EmbedChat Pro database.

## Available Scripts

### 1. Create Admin User
Creates an admin user for the application.

```bash
npm run create-admin
```

### 2. Populate Bots
Adds 100 sample bots to the database for testing and demonstration purposes.

#### JavaScript Version
```bash
npm run populate-bots
```

#### TypeScript Version
```bash
npm run populate-bots:ts
```

## Prerequisites

1. Make sure your MongoDB database is running
2. Set up your `.env.local` file with the correct `MONGODB_URI`
3. Install dependencies: `npm install`

## Bot Data Generated

The populate-bots script creates 100 bots with:

- **Unique Bot IDs**: `bot_001`, `bot_002`, ..., `bot_100`
- **Varied Names**: 100 different bot names from a predefined list
- **Random Welcome Messages**: 20 different welcome message variations
- **Random Theme Colors**: 20 different color variations
- **Random FAQs**: 5-15 FAQs per bot from a pool of 20 common questions

## Sample Bot Data

Each bot includes:
- `botId`: Unique identifier (e.g., "bot_001")
- `name`: Display name (e.g., "Customer Support Bot")
- `welcomeMessage`: Initial greeting (e.g., "Hello! How can I help you today?")
- `themeColor`: Hex color code (e.g., "#3B82F6")
- `faqs`: Array of frequently asked questions
- `createdAt`: Timestamp when created
- `updatedAt`: Timestamp when last updated

## Database Schema

The bots are stored in the `botsettings` collection with the following schema:

```typescript
{
  botId: string;           // Unique identifier
  name: string;            // Display name
  welcomeMessage: string;  // Initial greeting
  themeColor: string;      // Hex color code
  faqs: string[];          // Array of FAQs
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

## Notes

- The script will clear existing bots before adding new ones
- Make sure to backup your data if you have important bot configurations
- The script uses the same schema as the main application
- All bots are created with realistic, varied data for testing purposes

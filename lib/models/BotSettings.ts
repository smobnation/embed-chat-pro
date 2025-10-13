import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentSource {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt';
  content: string;
  enabled: boolean;
  category?: string;
  tags?: string[];
  uploadedAt: Date;
}

export interface IURLSource {
  id: string;
  url: string;
  title: string;
  content: string;
  enabled: boolean;
  category?: string;
  tags?: string[];
  scrapedAt: Date;
}

export interface IStructuredDataSource {
  id: string;
  name: string;
  type: 'products' | 'pricing' | 'services' | 'catalog';
  data: any;
  enabled: boolean;
  category?: string;
  tags?: string[];
  createdAt: Date;
}

export interface IBotSettings extends Document {
  botId: string;
  userId: string;
  name: string;
  welcomeMessage: string;
  themeColor: string;
  faqs: string[];
  documents: IDocumentSource[];
  urls: IURLSource[];
  structuredData: IStructuredDataSource[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BotSettingsSchema = new Schema<IBotSettings>({
  botId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
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
  documents: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'docx', 'txt'], required: true },
    content: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    category: { type: String },
    tags: [{ type: String }],
    uploadedAt: { type: Date, default: Date.now }
  }],
  urls: [{
    id: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    category: { type: String },
    tags: [{ type: String }],
    scrapedAt: { type: Date, default: Date.now }
  }],
  structuredData: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['products', 'pricing', 'services', 'catalog'], required: true },
    data: { type: Schema.Types.Mixed, required: true },
    enabled: { type: Boolean, default: true },
    category: { type: String },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
  }],
  categories: [{
    type: String
  }],
}, {
  timestamps: true
});

// Prevent re-compilation during development
export default mongoose.models.BotSettings || mongoose.model<IBotSettings>('BotSettings', BotSettingsSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  userId: string;
  botId: string;
  message: string;
  response: string;
  timestamp: Date;
  sessionId?: string;
}

const MessageSchema = new Schema<IMessage>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  botId: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  sessionId: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

// Prevent re-compilation during development
export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

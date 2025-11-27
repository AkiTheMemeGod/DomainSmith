import mongoose from 'mongoose';

const DomainSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    embeddingCollection: { type: String, required: true },
    status: { type: String, enum: ['idle', 'building', 'ready', 'error'], default: 'idle' },
    progress: { type: Number, default: 0 },
    totalChunks: { type: Number, default: 0 },
    processedChunks: { type: Number, default: 0 },
    errorMessage: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Domain', DomainSchema);
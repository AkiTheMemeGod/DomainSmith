import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    domain: { type: mongoose.Schema.Types.ObjectId, ref: 'Domain', required: true, index: true },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Document', DocumentSchema);
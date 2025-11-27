import mongoose from 'mongoose';

const EmbeddingSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

const modelCache = new Map();

export function getEmbeddingModel(collectionName) {
  if (modelCache.has(collectionName)) return modelCache.get(collectionName);
  const model = mongoose.model(collectionName, EmbeddingSchema, collectionName);
  modelCache.set(collectionName, model);
  return model;
}
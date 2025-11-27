import { Ollama } from 'ollama';
import config from '../config/index.js';

const client = new Ollama({ host: config.ollamaUrl });

export default async function getEmbedding(text) {
  // Use the single-prompt embeddings API which returns { embedding: number[] }
  const res = await client.embeddings({
    model: config.embeddingModel,
    prompt: text
  });
  if (!res || !Array.isArray(res.embedding)) {
    throw new Error('Embedding service returned invalid payload');
  }
  return res.embedding;
}

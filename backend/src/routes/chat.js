import { Router } from 'express';
import auth from '../middleware/auth.js';
import Domain from '../models/Domain.js';
import { getEmbeddingModel } from '../models/embeddingStore.js';
import getEmbedding from '../utils/embedding.js';
import { Ollama } from 'ollama';
import config from '../config/index.js';
import { cosineSim } from '../utils/similarity.js';

const router = Router();
const client = new Ollama({ host: config.ollamaUrl });

router.post('/', auth, async (req, res) => {
  const { domainId, message } = req.body;
  if (!domainId || !message) return res.status(400).json({ error: 'domainId and message required' });
  const domain = await Domain.findOne({ _id: domainId, user: req.user.id });
  if (!domain) return res.status(404).json({ error: 'Domain not found' });
  if (domain.status !== 'ready') return res.status(400).json({ error: 'Domain is not ready' });

  const Emb = getEmbeddingModel(domain.embeddingCollection);

  const qEmbedding = await getEmbedding(message);

  // Naive search: load all vectors and compute cosine similarity
  const items = await Emb.find({}, { embedding: 1, text: 1 }).lean();
  const scored = items.map(it => ({ text: it.text, score: cosineSim(qEmbedding, it.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const context = scored.map((s, i) => `Context ${i + 1}: ${s.text}`).join('\n\n');
  const prompt = `You are a helpful assistant for the domain "${domain.name}". Use the provided context to answer the user's question. If the answer is not in the context, say you are unsure.\n\n${context}`;

  const response = await client.chat({
    model: config.ollamaModel,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: message }
    ],
    stream: false
  });

  const content = response?.message?.content || '';
  res.json({ answer: content, sources: scored });
});

export default router;
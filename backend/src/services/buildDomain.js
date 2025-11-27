import fs from 'fs';
import path from 'path';
import Domain from '../models/Domain.js';
import Document from '../models/Document.js';
import { getEmbeddingModel } from '../models/embeddingStore.js';
import getEmbedding from '../utils/embedding.js';
import chunker from '../utils/chunker.js';
import pdfParser from '../utils/pdfParser.js';
import mammoth from 'mammoth';

async function readTextFromFile(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();
  if (mimetype === 'application/pdf' || ext === '.pdf') {
    return await pdfParser(filePath);
  }
  if (ext === '.txt' || mimetype.startsWith('text/')) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '';
  }
  // Unsupported types can be skipped
  return '';
}

export default async function buildDomain(domainId) {
  const domain = await Domain.findById(domainId);
  if (!domain) throw new Error('Domain not found');
  const docs = await Document.find({ domain: domain._id });
  const Emb = getEmbeddingModel(domain.embeddingCollection);

  let totalChunks = 0;
  // First pass to count chunks
  for (const doc of docs) {
    const text = await readTextFromFile(doc.path, doc.mimetype);
    const chunks = chunker(text);
    totalChunks += chunks.length;
  }

  domain.totalChunks = totalChunks;
  domain.processedChunks = 0;
  await domain.save();

  // Clear any previous embeddings
  await Emb.deleteMany({});

  // Second pass to compute embeddings
  for (const doc of docs) {
    const text = await readTextFromFile(doc.path, doc.mimetype);
    const chunks = chunker(text);
    for (const ch of chunks) {
      if (!ch.trim()) continue;
      const emb = await getEmbedding(ch);
      await Emb.create({ text: ch, embedding: emb, metadata: { docId: doc._id, originalName: doc.originalName } });
      domain.processedChunks += 1;
      domain.progress = Math.floor((domain.processedChunks / Math.max(1, domain.totalChunks)) * 100);
      await domain.save();
    }
  }

  domain.status = 'ready';
  domain.progress = 100;
  await domain.save();
}
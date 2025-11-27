import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
import auth from '../middleware/auth.js';
import config from '../config/index.js';
import Domain from '../models/Domain.js';
import Document from '../models/Document.js';
import { getEmbeddingModel } from '../models/embeddingStore.js';
import mongoose from 'mongoose';
import buildDomain from '../services/buildDomain.js';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(config.uploadDir, req.params.id || 'temp');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

router.get('/', auth, async (req, res) => {
  const domains = await Domain.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(domains);
});

router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Name required' });
  const slug = slugify(name);
  const embeddingCollection = `embeddings_${slug}`;
  const exists = await Domain.findOne({ embeddingCollection });
  if (exists) return res.status(400).json({ error: 'Domain with similar name exists' });
  const domain = await Domain.create({ user: req.user.id, name, slug, embeddingCollection });
  res.json(domain);
});

router.post('/:id/upload', auth, upload.array('files', 100), async (req, res) => {
  const { id } = req.params;
  const domain = await Domain.findOne({ _id: id, user: req.user.id });
  if (!domain) return res.status(404).json({ error: 'Not found' });
  const docs = await Promise.all(
    (req.files || []).map(f =>
      Document.create({
        domain: id,
        filename: f.filename,
        originalName: f.originalname,
        mimetype: f.mimetype || mime.lookup(f.originalname) || 'application/octet-stream',
        size: f.size,
        path: f.path
      })
    )
  );
  res.json({ uploaded: docs.length });
});

router.post('/:id/build', auth, async (req, res) => {
  const { id } = req.params;
  const domain = await Domain.findOne({ _id: id, user: req.user.id });
  if (!domain) return res.status(404).json({ error: 'Not found' });

  if (domain.status === 'building') return res.json({ started: true });

  domain.status = 'building';
  domain.progress = 0;
  domain.totalChunks = 0;
  domain.processedChunks = 0;
  domain.errorMessage = '';
  await domain.save();

  setImmediate(() => buildDomain(domain._id).catch(async (err) => {
    const d = await Domain.findById(domain._id);
    if (d) {
      d.status = 'error';
      d.errorMessage = err?.message || 'Build failed';
      await d.save();
    }
  }));

  res.json({ started: true });
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const domain = await Domain.findOne({ _id: id, user: req.user.id });
  if (!domain) return res.status(404).json({ error: 'Not found' });
  res.json(domain);
});

// Delete domain, its documents (and files) and embedding collection
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const domain = await Domain.findOne({ _id: id, user: req.user.id });
  if (!domain) return res.status(404).json({ error: 'Not found' });

  try {
    // Delete uploaded files and Document entries
    const docs = await Document.find({ domain: id });
    for (const d of docs) {
      try { if (d.path && fs.existsSync(d.path)) fs.unlinkSync(d.path); } catch (e) { /* ignore file errors */ }
    }
    // remove the upload directory for this domain (if any)
    try { fs.rmSync(path.join(config.uploadDir, id), { recursive: true, force: true }); } catch (e) { /* ignore */ }
    await Document.deleteMany({ domain: id });

    // Drop embedding collection if exists
    const col = domain.embeddingCollection;
    try {
      // Drop via native driver to avoid model caching issues
      const db = mongoose.connection.db;
      const collections = await db.listCollections({ name: col }).toArray();
      if (collections.length) {
        await db.dropCollection(col);
      }
    } catch (e) {
      // ignore errors dropping collection
    }

    // Finally remove the domain record
    await Domain.deleteOne({ _id: id });

    res.json({ deleted: true });
  } catch (err) {
    console.error('Error deleting domain', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;
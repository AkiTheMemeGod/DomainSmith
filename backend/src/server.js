// backend/src/server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import config from './config/index.js';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/auth.js';
import domainRoutes from './routes/domains.js';
import chatRoutes from './routes/chat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure upload directory exists
fs.mkdirSync(config.uploadDir, { recursive: true });

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static serving of uploaded files (optional)
app.use('/uploads', express.static(config.uploadDir));

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/chat', chatRoutes);

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port}`);
  });
};

start();

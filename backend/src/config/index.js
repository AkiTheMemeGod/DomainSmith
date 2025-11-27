// backend/src/config/index.js
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env from project backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/domainsmith',
  port: parseInt(process.env.PORT, 10) || 5000,
  jwt_secret: process.env.JWT_SECRET || 'change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ollamaUrl: process.env.OLLAMA_URL || 'http://127.0.0.1:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'mistral',
  embeddingModel: process.env.EMBEDDING_MODEL || 'nomic-embed-text',
  uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads')
};

export default config;

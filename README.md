# DomainSmith

DomainSmith is a technical platform designed to transform static documents—such as manuals, datasets, and internal documentation—into interactive, domain-aware AI assistants. It solves the problem of "context-blind" AI by implementing a local Retrieval-Augmented Generation (RAG) pipeline, allowing users to query their own data privately using local large language models (LLMs). [1](#0-0) 

## Features

- **Universal Uploads**: Support for PDF, Word, and plain text files that are parsed, chunked, and stored for retrieval 
- **Embeddings & Search**: Local Ollama embeddings with per-domain collections for fast, relevant retrieval 
- **Chat & RAG**: Ask natural questions with responses that reference relevant source documents for explainability 
- **Private & Local**: Runs with your own Ollama and MongoDB—you keep control over data and models.

## Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Single Page Application (SPA) for domain management and chat interface |
| **Backend** | Express.js | REST API handling authentication, file uploads, and RAG orchestration |
| **Database** | MongoDB | Stores user metadata, domain configurations, and vector embeddings |
| **AI Engine** | Ollama | Local service for generating embeddings and LLM chat completions |

## Prerequisites

- **Node.js** v18.0.0+
- **MongoDB** v6.0+
- **Ollama** (Latest)
- **npm** v9.0.0+

### AI Model Setup

After installing Ollama, pull the required models:

```bash
ollama pull mistral
ollama pull nomic-embed-text
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AkiTheMemeGod/DomainSmith.git
cd DomainSmith
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/domainsmith
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=mistral
EMBEDDING_MODEL=nomic-embed-text
UPLOAD_DIR=./uploads
```

### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.

## Architecture

DomainSmith operates on the concept of a "Domain," which acts as a siloed knowledge base. The system follows a classic client-server architecture with a specialized AI integration layer.

### RAG Pipeline

The core value of DomainSmith is its ability to bridge "Natural Language Space" and "Code Entity Space" through vectorization:

1. **Document Ingestion**: Users upload PDF, Word, or text files
2. **Parsing**: Documents are parsed using `pdfParser` or `mammoth` for Word documents
3. **Chunking**: Text is split into chunks using a sliding window chunker
4. **Embedding**: Chunks are converted to vectors using `nomic-embed-text` via Ollama
5. **Storage**: Vectors are stored in MongoDB for retrieval
6. **Retrieval**: When a user asks a question, the system retrieves relevant document chunks
7. **Generation**: Context is provided to a `Mistral` model to generate an informed response

## Usage

1. **Create an Account**: Register a new account on the landing page
2. **Create a Domain**: Navigate to the dashboard and create a new domain
3. **Upload Documents**: Upload PDF, Word, or text files to your domain
4. **Build Domain**: Trigger the build process to parse, chunk, and embed your documents
5. **Chat**: Once the domain status is "ready", start chatting with your domain-aware AI assistant

## Project Structure

```
DomainSmith/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── pages/
    │   └── App.jsx
    └── package.json
```

## Notes

This README is based on the DomainSmith Overview and Getting Started wiki pages. For more detailed technical documentation, refer to the wiki pages in the repository. The project uses local Ollama models (`mistral` for chat and `nomic-embed-text` for embeddings) which must be pulled separately before running the application. [6](#0-5) 


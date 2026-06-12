# DomainSmith README

DomainSmith is a technical platform designed to transform static documents—such as manuals, datasets, and internal documentation—into interactive, domain-aware AI assistants. It solves the problem of "context-blind" AI by implementing a local Retrieval-Augmented Generation (RAG) pipeline, allowing users to query their own data privately using local large language models (LLMs). [1](#0-0) 

## Features

- **Universal Uploads**: Support for PDF, Word, and plain text files that are parsed, chunked, and stored for retrieval [2](#0-1) 
- **Embeddings & Search**: Local Ollama embeddings with per-domain collections for fast, relevant retrieval [3](#0-2) 
- **Chat & RAG**: Ask natural questions with responses that reference relevant source documents for explainability [4](#0-3) 
- **Private & Local**: Runs with your own Ollama and MongoDB—you keep control over data and models [5](#0-4) 

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

## License

ISC

## Notes

This README is based on the DomainSmith Overview and Getting Started wiki pages. For more detailed technical documentation, refer to the wiki pages in the repository. The project uses local Ollama models (`mistral` for chat and `nomic-embed-text` for embeddings) which must be pulled separately before running the application. [6](#0-5) 

Wiki pages you might want to explore:
- [DomainSmith Overview (AkiTheMemeGod/DomainSmith)](/wiki/AkiTheMemeGod/DomainSmith#1)
- [Getting Started (AkiTheMemeGod/DomainSmith)](/wiki/AkiTheMemeGod/DomainSmith#1.1)
- [Pages & Routing (AkiTheMemeGod/DomainSmith)](/wiki/AkiTheMemeGod/DomainSmith#4.1)

### Citations

**File:** frontend/src/pages/Landing.jsx (L39-41)
```javascript
            <h1 className="lp-title">Build domain-aware AI assistants — faster.</h1>
            <p className="lp-sub">Turn documents, manuals and datasets into searchable, chat-ready domains powered by local Ollama embeddings and Mistral models.</p>

```

**File:** frontend/src/pages/Landing.jsx (L70-72)
```javascript
            title="Universal uploads"
            desc="PDF, Word, plain text — parsed, chunked, and stored for retrieval."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/><path d='M7 10l5-5 5 5' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
```

**File:** frontend/src/pages/Landing.jsx (L76-78)
```javascript
            title="Embeddings & search"
            desc="Local Ollama embeddings with per-domain collections for fast, relevant retrieval."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h10' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
```

**File:** frontend/src/pages/Landing.jsx (L82-84)
```javascript
            title="Chat & RAG"
            desc="Ask natural questions — responses reference relevant source documents for explainability."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
```

**File:** frontend/src/pages/Landing.jsx (L88-90)
```javascript
            title="Private & local"
            desc="Runs with your own Ollama and MongoDB — you keep control over data and models."
            icon={`<svg width=24 height=24 viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M12 11c2.21 0 4-1.79 4-4S14.21 3 12 3 8 4.79 8 7s1.79 4 4 4z' stroke='currentColor' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/><path d='M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2' stroke='currentColor' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'/></svg>`}
```

**File:** backend/src/config/index.js (L18-19)
```javascript
  ollamaModel: process.env.OLLAMA_MODEL || 'mistral',
  embeddingModel: process.env.EMBEDDING_MODEL || 'nomic-embed-text',
```

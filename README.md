# Chat with PDF

An AI-powered SaaS application that allows users to upload PDF documents and have natural conversations with their content using Retrieval-Augmented Generation (RAG). The application processes PDF files, generates vector embeddings, stores them in Pinecone, and leverages OpenAI models through LangChain to provide context-aware answers.

## Live Website
Live website can be viewed via vercel deployment at [Chat With Pdf](https://chat-with-pdf-phi-neon.vercel.app/)

## Features

* Upload and manage PDF documents
* Chat with PDF content using AI
* Semantic search powered by vector embeddings
* Retrieval-Augmented Generation (RAG)
* User authentication and account management with Clerk
* Cloud-based document storage and metadata management
* Subscription management with Stripe
* Usage limits for free and premium users
* Modern responsive UI built with Next.js, Tailwind CSS, and ShadCN UI
* Real-time updates with Firebase Firestore
* Live deployment using Vercel

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS 4
* ShadCN UI
* Radix UI
* Sonner
* Lucide React

### Backend & Infrastructure

* Next.js Server Actions
* Firebase Firestore
* Firebase Admin SDK
* Clerk Authentication
* Stripe Billing
* Vercel Deployment

### AI & Document Processing

* OpenAI
* LangChain
* Pinecone Vector Database
* PDF Parse
* React PDF
* Nvidia NV Embed v1 (Embedding Model)
* OpenAI gpt-oss-120b (Text Model)

## How It Works

1. User uploads a PDF document.
2. The PDF text is extracted and processed.
3. The content is split into chunks for embedding generation.
4. OpenAI generates embeddings for each chunk.
5. Embeddings are stored in Pinecone.
6. User asks questions about the document.
7. Relevant chunks are retrieved from Pinecone.
8. LangChain combines retrieved context with the user's query.
9. OpenAI generates a context-aware response.

## Project Structure

```text
actions/
├── askQuestion.ts
├── createCheckoutSession.ts
├── createStripePortal.ts
├── deleteDocument.ts
└── generateEmbeddings.ts

app/
├── dashboard/
└── webhook/

components/
├── ui/
├── Chat.tsx
├── ChatMessage.tsx
├── Document.tsx
├── Documents.tsx
├── FileUploader.tsx
├── Header.tsx
├── PdfView.tsx
├── PlaceholderDocument.tsx
└── UpgradeButton.tsx

configs/
└── langchain.ts

hooks/
├── useSubscription.ts
└── useUpload.ts

lib/
├── getBaseUrl.ts
├── langchain.ts
├── pinecone.ts
├── stripe-js.ts
├── stripe.ts
└── utils.ts

firebase/
firebaseAdmin/
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/ernztga/chat-with-pdf.git
cd chat-with-pdf
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory with your credentials:

```env
# OpenAI
OPENAI_API_KEY=

# Pinecone
PINECONE_API_KEY=
PINECONE_INDEX_NAME=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# NVidia NIM keys
NVIDIA_EMBEDDING_MODEL_API_KEY=
NVIDIA_TEXT_MODEL_API_KEY=

# Firebase
FIREBASE_STORAGE_BUCKET=
FIREBASE_SERVICE_ACCOUNT=

# Stripe
STRIPE_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Running the Application

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Stripe Webhooks

Run Stripe webhook forwarding during development:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the generated webhook secret into:

```env
STRIPE_WEBHOOK_SECRET=
```

## Subscription Model

### Free Plan

* Limited PDF uploads (2 files)
* Basic AI chat functionality (Limited to 2 messages)

### Pro Plan

* Higher upload limits (20 files)
* Increased document capacity
* Enhanced usage allowances (Limited to 20 messages)

## AI Workflow

```text
PDF Upload
     │
     ▼
Text Extraction
     │
     ▼
Chunking
     │
     ▼
OpenAI Embeddings
     │
     ▼
Pinecone Storage
     │
     ▼
User Query
     │
     ▼
Similarity Search
     │
     ▼
Context Retrieval
     │
     ▼
OpenAI Response
```

## Key Learning Areas Demonstrated

* Full-Stack Development
* Retrieval-Augmented Generation (RAG)
* Vector Databases
* AI Application Development
* SaaS Architecture
* Authentication & Authorization
* Subscription Billing
* Serverless Web Applications
* Cloud Database Integration

## Future Improvements

* Streaming AI responses
* Multi-document conversations
* Document sharing
* Chat history export
* OCR support for scanned PDFs
* Team workspaces
* Citation and source highlighting
* Usage analytics dashboard

## License

This project is for educational and portfolio purposes.

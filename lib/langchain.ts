// LangChain
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebaseAdmin";
import { embeddingModel, textModel } from "@/configs/langchain";
import pineconeClient from "./pinecone";

// Initialize OpenAI text model
const model = new ChatOpenAI(textModel);
const indexName = process.env.PINECONE_INDEX_NAME!

async function fetchMessagesFromDB(docId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not found");
  }

  console.log("--- Fetching chat history from the firestore database... ---");

  // Get the last n messages from the caht history
  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    // .limit(LIMIT) -> optional limit
    .get();

  const chatHistory = chats.docs.map((doc) => {
    return doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message);
  });

  console.log(
    `--- Fetched last ${chatHistory.length} messages successfully ---`,
  );

  return chatHistory;
}

export async function generateDocs(docId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("User not found");

  console.log("--- Fetching the download URL from Firebase... ---");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();

  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) throw new Error("Download URL not found");

  console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

  // Fetch the PDF from the specified URL
  const response = await fetch(downloadUrl);

  // Load the PDF into a PDFDocument object
  const data = await response.blob();

  // Load the PDF document from the specified path
  console.log("--- Loading PDF document... ---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  // Split the document into smaller parts for easier processing
  console.log("--- Splitting the document into smaller parts... ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);

  return splitDocs;
}

async function namespaceExists(
  index: Index<RecordMetadata>,
  namespace: string,
) {
  if (namespace === null) throw new Error("No namespace value provided.");

  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] != undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  let pineconeVectorStore;

  console.log("--- Generating Embeddings... ---");

  // Use Nvidia embedding model
  const embeddings = new OpenAIEmbeddings(embeddingModel);

  const index = pineconeClient.index({
    name: indexName,
  });

  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(
      `--- Namespace ${docId} already exists, reusing existing embeddings... ---`,
    );

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    // If the namespace does not exist, download the PDF from firestore via the stored download URL and generate the embeddings and store them in the Pinecone vector store

    const splitDocs = await generateDocs(docId);

    console.log(`
      --- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... --- 
    `);

    const texts = splitDocs.map((d) => d.pageContent);
    const vectors = await embeddings.embedDocuments(texts);

    if (!vectors.length) {
      throw new Error("No embeddings generated");
    }

    // Convert to Pinecone format
    const records = vectors.map((values, i) => ({
      id: `${docId}-${i}`,
      values,
      metadata: {
        text: splitDocs[i].pageContent,
      },
    }));

    await index.namespace(docId).upsert({
      records,
    });

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  }
}

async function generateLangchainCompletion(docId: string, question: string) {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);
  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found");
  }

  // Create a retriever to search through the vector store
  console.log("--- Creating a retriever... ---");
  const retriever = pineconeVectorStore.asRetriever();

  // Fetch database messages
  const chatHistory = await fetchMessagesFromDB(docId);

  console.log("--- Retrieving relevant documents... ---");

  const relevantDocs = await retriever.invoke(question);

  const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

  console.log("--- Building prompt... ---");

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant. Answer the user's question ONLY using the provided context.

      Context:
      {context}
      `,
    ],

    new MessagesPlaceholder("chat_history"),

    ["human", "{input}"],
  ]);

  console.log("--- Creating chain... ---");

  const chain = RunnableSequence.from([
    prompt,
    model,
    new StringOutputParser(),
  ]);

  console.log("--- Generating response... ---");

  const answer = await chain.invoke({
    context,
    chat_history: chatHistory,
    input: question,
  });

  console.log(answer);

  return answer;
}

export { model, generateLangchainCompletion };

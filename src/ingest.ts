import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';

// Use require for pdf-parse to ensure compatibility
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

// NEW: Import AI SDK components for embeddings
import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';

// NEW: Initialize the OpenAI client. It automatically uses the OPENAI_API_KEY from your .env file.
const openai = createOpenAI();

// --- PLACEHOLDERS for the fictional Mastra framework ---

// Placeholder for the fictional MastraVectorDB class
class MastraVectorDB {
  async upsert(data: { id: string; vector: number[]; metadata: object }) {
    // In a real application, this would save the data to PostgreSQL/pgvector.
    // For now, we'll just log a success message for the first item to show it's working.
    if (data.id.endsWith('-0')) {
       console.log(`  - Simulating save for chunk ID: ${data.id}`);
    }
    // Simulate a small delay as a real database call would have.
    await new Promise(resolve => setTimeout(resolve, 2)); 
    return { success: true };
  }
}

// Placeholder for the fictional MDocument class
class MDocument {
  content: string;
  metadata: { source: string };

  constructor(options: { content: string; metadata: { source: string } }) {
    this.content = options.content;
    this.metadata = options.metadata;
  }

  chunk(options: { size: number; overlap: number }): { content: string; metadata: { source: string } }[] {
    const chunks: { content: string; metadata: { source: string } }[] = [];
    let index = 0;
    while (index < this.content.length) {
      const end = Math.min(index + options.size, this.content.length);
      const chunkContent = this.content.slice(index, end);
      chunks.push({ content: chunkContent, metadata: this.metadata });
      index += options.size - options.overlap;
      if (options.size <= options.overlap) break;
    }
    return chunks;
  }
}

// --- MAIN SCRIPT LOGIC ---

const dataDirectory = path.join(process.cwd(), 'data');
const vectorDB = new MastraVectorDB(); // Initialize our placeholder DB

async function processDocuments() {
  console.log('Starting document ingestion...');
  try {
    const files = await fs.readdir(dataDirectory);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.log('No PDF files found in the "data" directory.');
      return;
    }

    console.log(`Found ${pdfFiles.length} PDF files to process.`);
    const allChunks: { content: string; metadata: { source: string } }[] = [];

    for (const fileName of pdfFiles) {
      console.log(`- Processing ${fileName}...`);
      const filePath = path.join(dataDirectory, fileName);
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdf(dataBuffer);
      const mdoc = new MDocument({ content: pdfData.text, metadata: { source: fileName } });
      const chunks = mdoc.chunk({ size: 1500, overlap: 200 });
      allChunks.push(...chunks);
    }

    console.log(`\nTotal chunks created: ${allChunks.length}`);

    // --- NEW: Embedding Generation and Storage Section ---
    console.log('\nStarting embedding generation and storage...');
    const embeddingModel = openai.embedding('text-embedding-3-small');

    for (let i = 0; i < allChunks.length; i++) {
      const chunk = allChunks[i];
      const { embedding } = await embed({ model: embeddingModel, value: chunk.content });
      
      await vectorDB.upsert({
        id: `${chunk.metadata.source}-${i}`,
        vector: embedding,
        metadata: { text: chunk.content, source: chunk.metadata.source },
      });

      if ((i + 1) % 100 === 0) {
        console.log(`  - Embedded and stored ${i + 1} of ${allChunks.length} chunks.`);
      }
    }

    console.log('\nEmbedding and storage process complete!');

  } catch (error) {
    console.error('An error occurred during the process:', error);
  }
}

processDocuments();
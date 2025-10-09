// src/agent.ts

import { createOpenAI } from '@ai-sdk/openai';
import { embed, generateText } from 'ai'; // MODIFIED: Added generateText

// Initialize the OpenAI client
const openai = createOpenAI();
const embeddingModel = openai.embedding('text-embedding-3-small');

// --- PLACEHOLDERS for the fictional Mastra framework ---

// Placeholder for the Vector DB, now with a 'search' method
class MastraVectorDB {
  async search(queryVector: number[]) {
    console.log("\n[Tool Call: SIMULATING Vector DB Search...]");
    console.log("[DB] Found 2 dummy chunks.");
    return [
      { metadata: { text: "Warren Buffett emphasizes that the best way to own common stocks is through an index fund that incurs minimal costs. He believes attempting to pick individual stocks is a loser's game for most people.", source: "2016.pdf" } },
      { metadata: { text: "Regarding acquisitions, Buffett looks for businesses with consistent earning power, good returns on equity, and management in place. He is not interested in turnaround situations.", source: "2003.pdf" } }
    ];
  }
}

// Placeholder for the MastraAgent class, now with tool-using logic
class MastraAgent {
  private model: any;
  private systemPrompt: string;
  private vectorDB: MastraVectorDB;

  constructor(options: { model: any; systemPrompt: string }) {
    this.model = options.model;
    this.systemPrompt = options.systemPrompt;
    this.vectorDB = new MastraVectorDB(); // Agent has its own DB connection
    console.log("Berkshire Hathaway Agent Initialized!");
  }

  // MODIFIED: The main chat logic is now IMPLEMENTED
  async chat(userInput: string): Promise<string> {
    console.log(`\nUser Query: "${userInput}"`);

    // =================================================================
    // STEP 1: RETRIEVE - Find relevant documents
    // =================================================================
    console.log("\n[Step 1: RETRIEVE]");

    // Create an embedding of the user's query
    const { embedding } = await embed({
      model: embeddingModel,
      value: userInput,
    });
    console.log("[RETRIEVE] Generated query embedding.");

    // Search the vector DB with the embedding
    const searchResults = await this.vectorDB.search(embedding);
    console.log("[RETRIEVE] Found relevant chunks in vector DB.");

    // =================================================================
    // STEP 2: AUGMENT - Create a prompt with the retrieved context
    // =================================================================
    console.log("\n[Step 2: AUGMENT]");

    const context = searchResults.map(r => r.metadata.text).join('\n---\n');
    
    const augmentedPrompt = `
      Based on the following context from Berkshire Hathaway shareholder letters, please answer the user's question.

      CONTEXT:
      ---
      ${context}
      ---
      
      USER QUESTION:
      ${userInput}
    `;
    console.log("[AUGMENT] Created augmented prompt for the model.");


    // =================================================================
    // STEP 3: GENERATE - Call the LLM with the augmented prompt
    // =================================================================
    console.log("\n[Step 3: GENERATE]");
    console.log("[GENERATE] Sending request to OpenAI...");

    const { text } = await generateText({
      model: this.model,
      system: this.systemPrompt,
      prompt: augmentedPrompt,
    });
    console.log("[GENERATE] Received response from OpenAI.");

    return text;
  }
}

// --- FULL SYSTEM PROMPT from the assignment document ---
const systemPrompt = `You are a knowledgeable financial analyst specializing in Warren Buffett's investment philosophy and Berkshire Hathaway's business strategy. Your expertise comes from analyzing years of Berkshire Hathaway annual shareholder letters.

Core Responsibilities:
- Answer questions about Warren Buffett's investment principles and philosophy.
- Provide insights into Berkshire Hathaway's business strategies and decisions.
- Reference specific examples from the shareholder letters when appropriate.
- Maintain context across conversations for follow-up questions.

Guidelines:
- Always ground your responses in the provided shareholder letter content.
- Quote directly from the letters when relevant, with proper citations.
- If information isn't available in the documents, clearly state this limitation.
- For numerical data or specific acquisitions, cite the exact source letter and year.
- Explain complex financial concepts in accessible terms while maintaining accuracy.

Response Format:
- Provide comprehensive, well-structured answers.
- Include relevant quotes from the letters with year attribution.
- List source documents used for your response.`;

// --- Initialize and Export the Agent ---
export const berkshireAgent = new MastraAgent({
  model: openai.chat('gpt-4o'),
  systemPrompt: systemPrompt
});
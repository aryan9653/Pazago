import { createOpenAI } from '@ai-sdk/openai';
import { embed } from 'ai';
// streamText is no longer needed for the simulated response
// import { streamText } from 'ai'; 

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

  // The main chat logic is now MODIFIED to return a simulated response
  async chat(userInput: string): Promise<string> { // Added a return type
    console.log(`\nUser Query: "${userInput}"`);

    // --- WE ARE SKIPPING THE REAL API CALLS TO AVOID BILLING ERRORS ---
    console.log("[API Call SKIPPED]: Returning simulated response.");
    
    // In a real scenario, the RAG steps would happen here.
    // 1. RETRIEVE
    // 2. AUGMENT
    // 3. GENERATE
    
    return "This is a simulated response. If you see this, your frontend, server, and agent are all connected correctly! Add billing to your OpenAI account to get real answers.";
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
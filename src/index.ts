// src/index.ts
import dotenv from 'dotenv';
dotenv.config();
import { berkshireAgent } from './agent.js';

async function main() {
  const question = "What is Warren Buffett's view on index funds and acquisitions?";
  await berkshireAgent.chat(question);
}

main().catch(console.error);
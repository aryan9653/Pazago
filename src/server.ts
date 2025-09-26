// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { berkshireAgent } from './agent.js';

const app = express();
const port = 3000;

// ADD THIS LINE:
app.use(express.static('public'));

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log(`Received message: ${message}`);
    
    // We are still using the non-streaming chat method for simplicity.
    // In a real app, we would adapt this to stream.
    const response = await berkshireAgent.chat(message);

    res.json({ reply: response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Failed to get a response from the agent.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
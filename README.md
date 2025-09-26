# Berkshire Hathaway RAG Agent 📈

This project is a complete Retrieval-Augmented Generation (RAG) application built with TypeScript and Node.js. It functions as an intelligent agent capable of answering questions about Warren Buffett's investment philosophy by using Berkshire Hathaway's annual shareholder letters (1977-2024) as its knowledge base.

The application was built as a solution to the "Berkshire Hathaway Intelligence" assignment, conceptually based on the fictional "Mastra" framework.

## ✨ Features

* **Document Ingestion**: Processes dozens of PDF shareholder letters, chunking them into manageable pieces.
* **Vector Embeddings**: Uses OpenAI's `text-embedding-3-small` model to convert text chunks into vector embeddings.
* **RAG Pipeline**: Implements a full RAG pipeline:
    1.  **Retrieve**: Searches a (simulated) vector database to find the most relevant context for a user's question.
    2.  **Augment**: Injects the retrieved context into a prompt for the language model.
    3.  **Generate**: Uses OpenAI's **GPT-4o** to generate a final, context-aware answer.
* **Intelligent Agent**: Features a defined agent with a system prompt that gives it the personality of an expert financial analyst.
* **Web Interface**: A simple and clean chat interface built with HTML, CSS, and vanilla JavaScript allows users to interact with the agent.
* **API Server**: A backend server built with Express.js to handle communication between the frontend and the AI agent.

## 🛠️ Tech Stack

* **Language**: TypeScript
* **Runtime**: Node.js
* **AI & Embeddings**: OpenAI API (GPT-4o, text-embedding-3-small)
* **AI SDK**: Vercel AI SDK (`@ai-sdk/openai`, `ai`)
* **Backend Server**: Express.js
* **Tooling**: `ts-node`, `dotenv`, `pdf-parse`

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v20.9.0 or higher)
* npm (Node Package Manager)
* An OpenAI API key with billing set up.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    * Create a new file in the project root named `.env`.
    * Add your OpenAI API key to this file:
        ```env
        OPENAI_API_KEY="sk-..."
        ```

4.  **Add PDF Knowledge Base (Optional):**
    * The document ingestion script (`ingest.ts`) is set up to read PDF files. To run it yourself, place your PDF files inside the `/data` directory.

### Running the Application

1.  **Start the server:**
    ```bash
    node --loader ts-node/esm src/server.ts
    ```

2.  **Open the application:**
    * Open your web browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
    * You can now start chatting with the Berkshire Hathaway agent!

## 📂 Project Structure

```
/
├── public/               # Frontend files (HTML, CSS, JS)
│   ├── index.html
│   └── app.js
├── src/                  # Backend source code
│   ├── ingest.ts         # Script for processing PDFs and generating embeddings
│   ├── agent.ts          # Core logic for the AI agent and RAG pipeline
│   ├── server.ts         # Express.js server to handle API requests
│   └── index.ts          # Script for command-line testing of the agent
├── data/                 # Folder for PDF documents
├── .env                  # Environment variables (e.g., API keys)
├── package.json
└── tsconfig.json
```

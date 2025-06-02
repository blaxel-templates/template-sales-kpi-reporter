# Blaxel Sales KPI Reporter Agent

<p align="center">
  <img src="https://blaxel.ai/logo.png" alt="Blaxel" width="200"/>
</p>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/downloads/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-powered-brightgreen.svg)](https://github.com/langchain-ai/langgraph)
[![Qdrant](https://img.shields.io/badge/Qdrant-vector_db-red.svg)](https://qdrant.tech/)
[![AWS S3](https://img.shields.io/badge/AWS-S3-orange.svg)](https://aws.amazon.com/s3/)

</div>

An intelligent sales KPI reporting agent built with LangGraph and TypeScript. This agent combines sales best practices knowledge with real-time KPI data from AWS S3 to provide comprehensive sales insights, analysis, and recommendations. It leverages vector search through Qdrant for contextual information retrieval and provides streaming responses for real-time interaction.

## 📑 Table of Contents

- [✨ Features](#features)
- [🚀 Quick Start](#quick-start)
- [📋 Prerequisites](#prerequisites)
- [💻 Installation](#installation)
- [🔧 Usage](#usage)
  - [Running Locally](#running-locally)
  - [Testing](#testing)
  - [Deployment](#deployment)
- [📁 Project Structure](#project-structure)
- [❓ Troubleshooting](#troubleshooting)
- [👥 Contributing](#contributing)
- [🆘 Support](#support)
- [📄 License](#license)

## ✨ Features

- Intelligent sales KPI analysis and reporting with natural language queries
- Integration with AWS S3 for real-time KPI data access
- Vector-based knowledge retrieval using Qdrant for contextual information
- Pre-loaded sales best practices and Amazon selling guides
- LangGraph-powered agent with tool integration and state management
- Streaming responses for real-time interaction
- Memory persistence across conversation sessions
- TypeScript implementation with robust type safety
- Easy deployment and integration with Blaxel platform

## 🚀 Quick Start

For those who want to get up and running quickly:

```bash
# Clone the repository
git clone https://github.com/blaxel-ai/template-sales-kpi-reporter.git

# Navigate to the project directory
cd template-sales-kpi-reporter

# Install dependencies
npm install

# Set up environment variables
cp .env-sample .env
# Edit .env with your AWS and Qdrant credentials

# Fill the knowledge base with sales documents
npm run fill-knowledge-base

# Start the development server
npm run dev

# In another terminal, deploy to Blaxel
bl deploy

# Test the agent
bl chat --local sales-kpi-agent
```

## 📋 Prerequisites

- **Node.js:** 18.0 or later
- **[NPM](https://www.npmjs.com/):** Node package manager
- **AWS Account:** For S3 bucket access to KPI data
- **Qdrant Database:** For vector storage and similarity search
- **Blaxel Platform Setup:** Complete Blaxel setup by following the [quickstart guide](https://docs.blaxel.ai/Get-started#quickstart)
  - **[Blaxel CLI](https://docs.blaxel.ai/Get-started):** Ensure you have the Blaxel CLI installed. If not, install it globally:
    ```bash
    curl -fsSL https://raw.githubusercontent.com/blaxel-ai/toolkit/main/install.sh | BINDIR=/usr/local/bin sudo -E sh
    ```
  - **Blaxel login:** Login to Blaxel platform
    ```bash
    bl login YOUR-WORKSPACE
    ```

## 💻 Installation

**Clone the repository and install dependencies:**

```bash
git clone https://github.com/blaxel-ai/template-sales-kpi-reporter.git
cd template-sales-kpi-reporter
npm install
```

**Set up environment variables:**

```bash
cp .env-sample .env
```

Edit the `.env` file with your credentials:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

QDRANT_API_KEY=your_qdrant_api_key
QDRANT_COLLECTION_NAME=sales_knowledge

OPENAI_API_KEY=your_openai_api_key
```

**Initialize the knowledge base:**

```bash
npm run fill-knowledge-base
```

## 🔧 Usage

### Running Locally

Start the development server with hot reloading:

```bash
npm run dev
```

For production build and run:

```bash
# Build the TypeScript code
npm run build

# Run the compiled JavaScript
npm run prod
```

_Note:_ The development server automatically restarts when you make changes to the source code.

### Testing

You can test your sales KPI agent locally:

```bash
# Using the Blaxel CLI chat interface
bl chat --local sales-kpi-agent

# Or make direct HTTP requests
curl -X POST http://localhost:8080/ \
  -H "Content-Type: application/json" \
  -H "thread-id: test-session-1" \
  -d '{"inputs": "What are our top sales KPIs this quarter?"}'
```

Example queries you can ask:
- "What are our current sales performance metrics?"
- "Show me the best practices for Amazon listings"
- "How can we improve our conversion rates?"
- "What KPI data do we have in our S3 bucket?"

### Deployment

When you are ready to deploy your agent:

```bash
bl deploy
```

This command uses your code and the configuration in `blaxel.toml` to deploy your sales KPI reporter as an agent on the Blaxel platform.

## 📁 Project Structure

- **src/index.ts** - Fastify server setup and main application entry point
- **src/agent.ts** - Core LangGraph agent implementation with context handling
- **src/knowledgebase.ts** - Qdrant vector database integration and search functionality
- **src/prompt.ts** - System prompt configuration for the sales KPI assistant
- **src/types.ts** - TypeScript type definitions
- **src/embeddings.ts** - Text embedding functionality for vector search
- **src/error.ts** - Error handling utilities
- **documents/** - Sales best practices and guides for knowledge base
- **fillKnowledgeBase.ts** - Script to populate Qdrant with document embeddings
- **blaxel.toml** - Blaxel deployment configuration with AWS S3 and model settings
- **package.json** - NPM package configuration with scripts and dependencies

## ❓ Troubleshooting

### Common Issues

1. **Blaxel Platform Issues**:
   - Ensure you're logged in to your workspace: `bl login MY-WORKSPACE`
   - Verify models are available: `bl get models`
   - Check that functions exist: `bl get functions`

2. **AWS S3 Connection Issues**:
   - Verify AWS credentials are correctly set in environment variables
   - Ensure the S3 bucket exists and is accessible
   - Check IAM permissions for S3 bucket access
   - Verify the AWS region is correct for your bucket

3. **Qdrant Vector Database Issues**:
   - Ensure Qdrant API key is valid and properly configured
   - Verify the collection name exists in your Qdrant instance
   - Check that embeddings are being generated correctly
   - Run `npm run fill-knowledge-base` to populate the knowledge base
   - Verify network connectivity to Qdrant endpoint

4. **Dependency and Environment Issues**:
   - Make sure you have Node.js 18+
   - Try `npm install` to reinstall dependencies
   - Check for TypeScript compilation errors with `npm run build`
   - Verify all environment variables are properly set

For more help, please [submit an issue](https://github.com/blaxel-templates/template-sales-kpi-reporter/issues) on GitHub.

## 👥 Contributing

Contributions are welcome! Here's how you can contribute:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Submit** a Pull Request

Please make sure to update tests as appropriate and follow the TypeScript code style of the project.

## 🆘 Support

If you need help with this template:

- [Submit an issue](https://github.com/blaxel-templates/template-sales-kpi-reporter/issues) for bug reports or feature requests
- Visit the [Blaxel Documentation](https://docs.blaxel.ai) for platform guidance
- Check the [LangGraph Documentation](https://langchain-ai.github.io/langgraph/) for framework-specific help
- Review the [Qdrant Documentation](https://qdrant.tech/documentation/) for vector database guidance
- Join our [Discord Community](https://discord.gg/G3NqzUPcHP) for real-time assistance

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
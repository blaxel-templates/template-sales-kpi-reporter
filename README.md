# Blaxel Sales KPI Reporter

<p align="center">
  <img src="https://blaxel.ai/logo.png" alt="Blaxel" width="200"/>
</p>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-powered-blue.svg)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-integrated-orange.svg)](https://langchain.com)
[![AWS](https://img.shields.io/badge/AWS_S3-connected-232F3E.svg)](https://aws.amazon.com/s3/)

</div>

This repository is a demo implementation of a Sales KPI Reporter agent built using the [Blaxel SDK](https://blaxel.ai) and [LangChain](https://langchain.com).
The agent processes HTTP requests, streams responses, and dynamically enriches conversational context with data stored in:

- an AWS S3 bucket
- a Qdrant-based knowledge base

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Usage](#-usage)
  - [Populating the Knowledge Base](#optional-populating-the-knowledge-base)
  - [Running Locally](#running-the-server-locally)
  - [Testing](#test-your-agent)
  - [Deployment](#deploying-to-blaxel)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## ⚙️ Features

- Interactive conversational interface for sales data analysis
- Integration with AWS S3 for storage of sales data
- Qdrant vector database for efficient knowledge retrieval
- Real-time streaming responses
- Built on LangChain for efficient agent orchestration
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

# Configure environment variables
cp .env-sample .env
# Edit .env with your credentials

# Register Blaxel components
bl apply -R -f .blaxel

# Start the server
bl serve --hotreload

# In another terminal, test the agent
bl chat template-sales-kpi-reporter
```

## 🔌 Prerequisites

- **Node.js:** v18 or later
- **Blaxel CLI:** Install globally:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/blaxel-ai/toolkit/main/install.sh | BINDIR=$HOME/.local/bin sh
  ```
- **Blaxel login:** Login to Blaxel platform
  ```bash
  bl login YOUR-WORKSPACE
  ```

## 🛠️ Installation

**Clone the repository and install the dependencies**:

```bash
git clone https://github.com/blaxel-ai/template-sales-kpi-reporter.git
cd template-sales-kpi-reporter
npm install
```

**Environment Variables:** Create a `.env` file with your configuration. You can begin by copying the sample file:

```bash
cp .env-sample .env
```

Then, update the following values with your own credentials. If you do not have a `COLLECTION_NAME` on Qdrant already, you can run the pre-populating command in the next section to create a new collection:

- [AWS S3 credentials](https://aws.amazon.com/s3): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION`, `AWS_BUCKET`
- [Qdrant details](https://cloud.qdrant.io/accounts/d416c5c1-67f2-4e25-9f02-84205b220ab8/cloud-access/database-api-keys): `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION_NAME` If you do not have a collection on Qdrant already, enter any collection_name and the collection will be created for you when running the pre-populating command in the next section.
- [OpenAI key](https://platform.openai.com/api-keys): `OPENAI_API_KEY`

**Blaxel apply:** register your integration connection / functions / models on blaxel.ai

```bash
bl apply -R -f .blaxel
```

## 🔧 Usage

### (Optional) Populating the Knowledge Base

To populate the Qdrant knowledge base with documents:

1. Place your documents in the `documents` folder. If you do not have any documents, you can use the sample documents provided in the `documents` folder.
2. Run the following command to import the documents:
   ```bash
   npm run fill-knowledge-base
   ```

### Running the Server Locally

Start the development server with hot reloading using the Blaxel CLI command:

```bash
bl serve --hotreload
```

_Note:_ This command starts the server and enables hot reload so that changes to the source code are automatically reflected.

### Test your agent

Use Blaxel CLI to test your agent:

```bash
bl chat template-sales-kpi-reporter
```

Example questions to try:

- How can I boost Amazon listings?
- List my KPI on amazon sales
- How can I improve my sales? List countries where my KPI should improve. Do this list in a table

### Deploying to Blaxel

When you are ready to deploy your application, run:

```bash
bl deploy
```

This command uses your code and the configuration files under the `.blaxel` directory to deploy your application.

## 📖 API Reference

The Sales KPI Reporter agent exposes the following endpoints:

- **POST /agents/{agent_id}/run**: Run the agent with provided input
  ```json
  {
    "input": "List my KPI on amazon sales",
    "stream": true
  }
  ```

- **GET /agents/{agent_id}/info**: Get information about the agent capabilities
- **GET /health**: Health check endpoint

For detailed API documentation, run the server and visit `/docs` endpoint.

## 📁 Project Structure

- **src/**
  - `index.ts` - Application entry point
  - `agent.ts` - Configures the chat agent, streams HTTP responses, and integrates conversational context
  - `knowledgebase.ts` - Establishes the connection and configuration for the Qdrant knowledge base
  - `prompt.ts` - Contains the prompt definition used for the chat agent
- **documents/** - Includes the sample documents to populate the knowledge base
- **fillKnowledgeBase.ts** - Script to import document content into the knowledge base
- **.blaxel/** - Contains configuration files for Blaxel functions and models
- **tsconfig.json** - TypeScript compiler configuration
- **package.json** - Lists dependencies and defines various project scripts
- **blaxel.toml** - Blaxel deployment configuration

## 📝 Examples

### Basic KPI Query

```
User: List my KPI on amazon sales
Agent: Here are your current Amazon sales KPIs:

| Metric | Value | Status |
|--------|-------|--------|
| Total Revenue | $1,245,689 | ▲ 12% |
| Average Order Value | $42.37 | ▼ 3% |
| Conversion Rate | 4.2% | ▲ 0.5% |
| Return Rate | 8.7% | ▼ 1.2% |
| Customer Satisfaction | 4.3/5 | ▲ 0.2 |
| Inventory Turnover | 7.8x | ▲ 0.6x |

Your strongest markets are:
1. United States (47% of sales)
2. United Kingdom (18% of sales)
3. Germany (12% of sales)

Would you like me to provide more detailed analysis on any particular metric?
```

### Sales Improvement Query

```
User: How can I improve my sales in Europe?
Agent: Based on your current KPIs for European markets, here are targeted improvement opportunities:

1. **Germany (12% of sales)**
   - Improve product listing translations (current score: 82%)
   - Expand selection in high-performance categories (home goods, electronics)
   - Increase sponsored product ad budget by 15-20%

2. **France (8% of sales)**
   - Address higher-than-average return rates (currently 11.2%)
   - Improve delivery times (currently averaging 4.2 days)
   - Enhance customer support with French-speaking representatives

3. **Italy (5% of sales)**
   - Optimize for mobile shoppers (71% of Italian traffic comes from mobile)
   - Adjust pricing strategy (current prices are 8% higher than local competitors)
   - Increase inventory for seasonal products

Would you like me to prepare a detailed action plan for any of these markets?
```

## ⚠️ Troubleshooting

### Common Issues

1. **Environment Variable Problems**:
   - Ensure all required environment variables are set in your `.env` file
   - Check for typos in API keys and endpoints

2. **AWS Connection Issues**:
   - Verify your AWS credentials are correct
   - Ensure your IAM user has the necessary permissions for S3 access

3. **Qdrant Connection Problems**:
   - Confirm your Qdrant URL and API key are correct
   - Check that your collection exists or is being created properly

For more help, please [submit an issue](https://github.com/blaxel-templates/template-sales-kpi-reporter/issues) on GitHub.

## 🤝 Contributing

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

Please make sure to update tests as appropriate and follow the code style of the project.

## 🛟 Support

If you need help with this template:

- [Submit an issue](https://github.com/blaxel-templates/template-sales-kpi-reporter/issues) for bug reports or feature requests
- Visit the [Blaxel Documentation](https://docs.blaxel.ai) for platform guidance
- Contact [Blaxel Support](https://blaxel.ai/contact) for additional assistance

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
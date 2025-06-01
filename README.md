# Template Sales KPI Reporter

[![Build Status](https://img.shields.io/github/actions/workflow/status/blaxel-templates/template-sales-kpi-reporter/ci.yml?branch=main&style=flat-square)](https://github.com/blaxel-templates/template-sales-kpi-reporter/actions)
[![PyPI Version](https://img.shields.io/pypi/v/template-sales-kpi-reporter?style=flat-square)](https://pypi.org/project/template-sales-kpi-reporter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

An agent for Sales KPI reporting built using the Blaxel SDK and LangChain. It processes HTTP requests, streams responses, and dynamically adapts context with AWS S3 storage and Qdrant.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Populating the Knowledge Base](#populating-the-knowledge-base)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- HTTP API for Sales KPI queries (`/kpi?metric=<value>`)
- Real-time streaming responses
- Contextual insights with vector search (Qdrant) & document storage (AWS S3)
- Easy deployment and environment configuration via Blaxel CLI

## Prerequisites

- Node.js v18 or later
- [Blaxel CLI](https://github.com/blaxel-ai/toolkit)
- AWS account with S3 access
- Qdrant account & API key
- OpenAI API key (for embeddings)

## Installation

```bash
git clone https://github.com/blaxel-templates/template-sales-kpi-reporter.git
cd template-sales-kpi-reporter
npm install
```

## Configuration

Copy the sample environment file and update credentials:

```bash
cp .env-sample .env
```

Edit `.env`:
```env
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_REGION=<aws-region>
QDRANT_API_KEY=<your-qdrant-key>
QDRANT_URL=<your-qdrant-url>
OPENAI_API_KEY=<your-openai-key>
```

## Populating the Knowledge Base

Place your documents in `./documents` and run:

```bash
npm run file-knowledge-base
```

Or use OpenAI embeddings:

```bash
npm run openai-knowledge-base
```

## Usage

### Running Locally

```bash
bl serve --hotreload
```

### Example Request

```bash
curl http://localhost:3000/kpi?metric=revenue
```

Sample streamed JSON response:
```json
{
  "metric": "revenue",
  "value": "$1,200,000",
  "insights": "Revenue has grown 10% QoQ."
}
```

## API Reference

| Endpoint   | Method | Query Params | Description                      |
|------------|--------|--------------|----------------------------------|
| `/kpi`     | GET    | `metric`     | Fetch KPI report for a metric    |
| `/health`  | GET    | -            | Health check                     |

## Project Structure

```
src/
├── index.ts                 # Application entry point
├── agent.ts                 # Agent configuration & handlers
├── knowledgeBase.ts         # Build knowledge base scripts
├── prompt.ts                # Chat prompts for the agent
├── file-knowledge-base.ts   # Document loader script
├── openai-knowledge-base.ts # OpenAI embeddings loader
└── ...

documents/                   # Sample documents
.env-sample                  # Environment variables template
```

## Contributing

Contributions welcome!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes
4. Open a pull request

See [CONTRIBUTING](CONTRIBUTING.md) for details.

## License

MIT © 2025 Blaxel AI

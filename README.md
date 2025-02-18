# Demo Sales KPI Reporter

This repository is a demo implementation of a Sales KPI Reporter agent built using the [Beamlit SDK](https://beamlit.com) and [LangChain](https://langchain.com). The agent processes HTTP requests, streams responses, and dynamically enriches conversational context with data stored in a Qdrant-based knowledge base.

## Prerequisites

- **Node.js:** v18 or later.
- **Beamlit CLI:** Ensure you have the Beamlit CLI installed. If not, install it globally:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/beamlit/toolkit/main/install.sh | BINDIR=$HOME/.local/bin sh
  ```
- **Beamlit login:** Login to Beamlit platform
  ```bash
    bl login YOUR-WORKSPACE
  ```

## Installation

- **Clone the repository and install the dependencies**:

  ```bash
  git clone https://github.com/beamlit/demo-sales-kpi-reporter.git
  cd demo-sales-kpi-reporter
  npm install
  ```

- **Environment Variables:** Create a `.env` file with your configuration. You can begin by copying the sample file:

  ```bash
  cp .env-sample .env
  ```

  Then, update the following values with your own credentials:

  - AWS credentials: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION`, `AWS_BUCKET`
  - Qdrant details: `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION_NAME`
  - OpenAI key: `OPENAI_API_KEY`

## (Optional) Populating the Knowledge Base

To populate the Qdrant knowledge base with documents:

1. Place your documents in the `documents` folder.
2. Run the following command to import the documents:
   ```bash
   npm run fill-knowledge-base
   ```

## Running the Server Locally

Start the development server with hot reloading using the Beamlit CLI command:

```bash
bl serve --hotrealod
```

_Note:_ This command starts the server and enables hot reload so that changes to the source code are automatically reflected.

## Deploying to Beamlit

When you are ready to deploy your application, run:

```bash
bl deploy
```

This command uses your code and the configuration files under the `.beamlit` directory to deploy your application.

## Project Structure

- **src/**
  - `agent.ts` - Configures the chat agent, streams HTTP responses, and integrates conversational context.
  - `knowledgebase.ts` - Establishes the connection and configuration for the Qdrant knowledge base.
  - `prompt.ts` - Contains the prompt definition used for the chat agent.
- **documents/** - Includes the sample documents to populate the knowledge base.
- **fillKnowledgeBase.ts** - Script to import document content into the knowledge base.
- **.beamlit/** - Contains configuration files for Beamlit functions and models.
- **index.ts** - The main entry point of the application.
- **tsconfig.json** - TypeScript compiler configuration.
- **package.json** - Lists dependencies and defines various project scripts.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

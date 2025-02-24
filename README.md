# Template Sales KPI Reporter

This repository is a demo implementation of a Sales KPI Reporter agent built using the [Blaxel SDK](https://blaxel.ai) and [LangChain](https://langchain.com).
The agent processes HTTP requests, streams responses, and dynamically enriches conversational context with data stored in:

- an AWS S3 bucket
- a Qdrant-based knowledge base

## Prerequisites

- **Node.js:** v18 or later.
- **Blaxel CLI:** Ensure you have the Blaxel CLI installed. If not, install it globally:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/beamlit/toolkit/main/install.sh | BINDIR=$HOME/.local/bin sh
  ```
- **Blaxel login:** Login to Blaxel platform
  ```bash
    bl login YOUR-WORKSPACE
  ```

## Installation

- **Clone the repository and install the dependencies**:

  ```bash
  git clone https://github.com/beamlit/template-sales-kpi-reporter.git
  cd template-sales-kpi-reporter
  npm install
  ```

- **Environment Variables:** Create a `.env` file with your configuration. You can begin by copying the sample file:

  ```bash
  cp .env-sample .env
  ```

  Then, update the following values with your own credentials. If you do not have a `COLLECTION_NAME` on Qdrant already, you can run the pre-populating command in the next section to create a new collection:

  - [AWS S3 credentials](https://aws.amazon.com/s3): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`, `AWS_REGION`, `AWS_BUCKET`
  - [Qdrant details](https://cloud.qdrant.io/accounts/d416c5c1-67f2-4e25-9f02-84205b220ab8/cloud-access/database-api-keys): `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION_NAME` If you do not have a collection on Qdrant already, enter any collection_name and the collection will be created for you when running the pre-populating command in the next section.
  - [OpenAI key](https://platform.openai.com/api-keys): `OPENAI_API_KEY`

- **Blaxel apply:** register your integration connection / functions / models on blaxel.ai

```bash
bl apply -R -f .blaxel
```

## (Optional) Populating the Knowledge Base

To populate the Qdrant knowledge base with documents:

1. Place your documents in the `documents` folder. If you do not have any documents, you can use the sample documents provided in the `documents` folder.
2. Run the following command to import the documents:
   ```bash
   npm run fill-knowledge-base
   ```

## Running the Server Locally

Start the development server with hot reloading using the Blaxel CLI command:

```bash
bl serve --hotreload
```

_Note:_ This command starts the server and enables hot reload so that changes to the source code are automatically reflected.

## Deploying to Blaxel

When you are ready to deploy your application, run:

```bash
bl deploy
```

This command uses your code and the configuration files under the `.blaxel` directory to deploy your application.

## Example inputs

- How can I boost Amazon listings
- List my KPI on amazon sales
- How can I improve my sales ? List countries where my KPI should improve. Do this list in a table

## Project Structure

- **src/**
  - `agent.ts` - Configures the chat agent, streams HTTP responses, and integrates conversational context.
  - `knowledgebase.ts` - Establishes the connection and configuration for the Qdrant knowledge base.
  - `prompt.ts` - Contains the prompt definition used for the chat agent.
  - `functions` - Directory to add your functions/tools available to your agent. Documentation on how to develop your own functions
- **documents/** - Includes the sample documents to populate the knowledge base.
- **fillKnowledgeBase.ts** - Script to import document content into the knowledge base.
- **.blaxel/** - Contains configuration files for Blaxel functions and models.
- **index.ts** - The main entry point of the application.
- **tsconfig.json** - TypeScript compiler configuration.
- **package.json** - Lists dependencies and defines various project scripts.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

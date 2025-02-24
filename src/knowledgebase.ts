import { KnowledgebaseFactory } from "@blaxel/sdk/knowledgebases/factory.js";

export const getKnowledgebase = async () => {
  return await KnowledgebaseFactory.create({
    type: "qdrant",
    knowledgeBase: {
      spec: {
        collectionName: "knowledgebase",
        embeddingModel: "text-embedding-3-large",
        embeddingModelType: "openai",
      },
    },
    connection: {
      config: {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
      },
      secrets: {
        apiKey: process.env.QDRANT_API_KEY,
      },
    },
  });
};

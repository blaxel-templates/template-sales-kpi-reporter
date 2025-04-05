/* eslint-disable @typescript-eslint/no-require-imports */
import { env } from "@blaxel/sdk";
import { EmbeddingModel } from "./embeddings";

type KnowledgebaseSearchResult = {
  key: string;
  value: string;
  similarity: number;
};

export class QdrantKnowledgebase {
  private client: any;
  private collectionName!: string;
  private scoreThreshold!: number;
  private limit!: number;
  private config: any;
  private secrets: any;
  private embeddingModel!: EmbeddingModel;

  private constructor() {}

  static async create({
    connection,
  }: {
    connection: {
      collectionName: string;
      embeddingModel: string;
      embeddingModelType: string;
      scoreThreshold?: number;
      limit?: number;
      config?: any;
      secrets?: any;
    };
  }): Promise<QdrantKnowledgebase> {
    const instance = new QdrantKnowledgebase();
    instance.config = connection.config || {};
    instance.secrets = connection.secrets || {};
    const { QdrantClient } = await import("@qdrant/js-client-rest");
    instance.client = new QdrantClient({
      url: instance.config.url || "http://localhost:6333",
      apiKey: instance.secrets.apiKey || "",
      checkCompatibility: false,
    });

    instance.collectionName = connection.collectionName;

    instance.scoreThreshold = instance.config.scoreThreshold || 0.25;
    instance.limit = instance.config.limit || 5;
    instance.embeddingModel = new EmbeddingModel({
      model: connection.embeddingModel,
    });

    return instance;
  }

  handleError(action: string, error: Error) {
    if (error instanceof Error && "status" in error) {
      if (
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "status" in error.data &&
        typeof error.data.status === "object" &&
        error.data.status &&
        "error" in error.data.status
      ) {
        return new Error(
          `Qdrant http error for ${action}: ${error.status} - ${error.data.status.error}`
        );
      } else {
        return new Error(
          `Qdrant http error for ${action}: ${error.status} - ${error.message}`
        );
      }
    }
    return error;
  }

  async getOrCreateCollection(embeddings: {
    size: number;
    distance: string;
    retry?: number;
  }): Promise<void> {
    try {
      if (embeddings.retry === undefined) {
        embeddings.retry = 0;
      }
      const response = await this.client.getCollections();
      if (
        !response.collections.find(
          (collection: any) => collection.name === this.collectionName
        )
      ) {
        await this.client.createCollection(this.collectionName, {
          vectors: {
            default: {
              size: embeddings.size,
              distance: embeddings.distance,
            },
          },
        });
      }
    } catch (error: any) {
      const message = error.toString().toLowerCase();
      if (
        (embeddings.retry || 0) < 3 &&
        (message.includes("conflict") || message.includes("already exists"))
      ) {
        return this.getOrCreateCollection({
          ...embeddings,
          retry: (embeddings.retry || 0) + 1,
        });
      }
      throw this.handleError("creating collection", error as Error);
    }
  }

  async add(key: string, value: string, infos?: any): Promise<void> {
    try {
      const embedding = await this.embeddingModel.embed(value);
      await this.getOrCreateCollection({
        size: embedding.length,
        distance: infos?.distance || "Cosine",
      });
      await this.client.upsert(this.collectionName, {
        points: [
          {
            id: key,
            vector: {
              default: embedding,
            },
            payload: {
              text: value,
              ...infos,
            },
          },
        ],
      });
    } catch (error) {
      throw this.handleError("adding", error as Error);
    }
  }

  async search(
    query: string,
    filters?: any,
    scoreThreshold?: number,
    limit?: number
  ): Promise<Array<KnowledgebaseSearchResult>> {
    try {
      const embedding = await this.embeddingModel.embed(query);
      const results = await this.client.query(this.collectionName, {
        query: embedding,
        using: "default",
        with_payload: true,
        score_threshold: scoreThreshold || this.scoreThreshold,
        limit: limit || this.limit,
      });
      return results.points.map((point: any) => {
        return {
          key: point.id,
          value: JSON.stringify(point.payload),
          similarity: point.score,
        };
      });
    } catch (error) {
      throw this.handleError("searching", error as Error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.delete(this.collectionName, {
        points: [key],
      });
    } catch (error) {
      throw this.handleError("deleting", error as Error);
    }
  }
}

export const getKnowledgebase = async () => {
  const connection = {
    config: {
      url: env.QDRANT_URL,
    },
    secrets: {
      apiKey: env.QDRANT_API_KEY,
    },
    collectionName: env.QDRANT_COLLECTION_NAME || "knowledgebase",
    embeddingModel: env.QDRANT_EMBEDDING_MODEL || "text-embedding-3-large",
    embeddingModelType: env.QDRANT_EMBEDDING_MODEL_TYPE || "openai",
  };
  return await QdrantKnowledgebase.create({ connection });
};

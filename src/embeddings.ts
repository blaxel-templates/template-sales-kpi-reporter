import { logger, settings } from "@blaxel/sdk";
import { SpanManager } from "@blaxel/sdk/instrumentation/span";
import { HTTPError } from "./error";

export interface EmbeddingsConfig {
  model: string;
}

export class EmbeddingModel {
  constructor(private readonly config: EmbeddingsConfig) {
    this.config = config;
  }

  async embed(query: string): Promise<number[]> {
    try {
      const data = (await this.run(query)) as {
        data: [{ embedding: number[] }];
      };
      return data.data[0].embedding;
    } catch (error: any) {
      if (error instanceof HTTPError) {
        throw this.handleError(error);
      }
      throw error;
    }
  }

  handleError(error: HTTPError) {
    const { model } = this.config;
    const message = `Error embedding request with model ${model} -> ${error.status_code} ${error.message}`;
    return new HTTPError(error.status_code, message);
  }

  async run(query: string) {
    const url = `${settings.runUrl}/${settings.workspace}/models/${this.config.model}/v1/embeddings`;
    const body = JSON.stringify({ input: query });

    const spanManager = new SpanManager("blaxel-tracer");
    return spanManager.createActiveSpan(
      this.config.model,
      {
        "model.name": this.config.model,
        "model.args": JSON.stringify(query),
      },
      async () => {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              ...settings.headers,
              "Content-Type": "application/json",
            },
            body,
          });
          if (response.status >= 400) {
            throw new HTTPError(response.status, await response.text());
          }
          return await response.json();
        } catch (err: any) {
          logger.error(err.stack);
          throw err;
        }
      }
    );
  }
}

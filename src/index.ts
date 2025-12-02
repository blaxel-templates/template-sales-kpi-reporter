import { env } from "@blaxel/core";
import "@blaxel/telemetry";
import Fastify from "fastify";
import { v4 as uuidv4 } from "uuid";
import { agent } from "./agent";

interface RequestBody {
  inputs: string;
}

async function main() {
  console.info("Booting up...");
  const app = Fastify();

  app.addHook("onResponse", async (request, reply) => {
    console.info(`${request.method} ${request.url} ${reply.statusCode} ${Math.round(reply.elapsedTime)}ms`);
  });

  app.addHook("onError", async (request, reply, error) => {
    console.error(error);
  });

  app.post<{ Body: RequestBody }>("/", async (request, reply) => {
    try {
      const thread_id = (request.headers["thread-id"] as string) || uuidv4();
      await agent(thread_id, request.body.inputs, reply.raw);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send(error.stack);
    }
  });
  const port = parseInt(env.PORT || "80");
  const host = env.HOST || "0.0.0.0";
  try {
    await app.listen({ port, host });
    console.info(`Server is running on port ${host}:${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main().catch(console.error);

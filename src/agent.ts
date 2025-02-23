/**
 * @file agent.ts
 * @description This file sets up a chat agent using the BeamLit SDK and LangChain tools.
 * It handles incoming HTTP requests, streams responses from the underlying agent,
 * and dynamically enriches the conversation context using a knowledgebase.
 */

import {
  getChatModel,
  getDefaultThread,
  getFunctions,
  logger,
  wrapAgent,
} from "@blaxel/sdk";
import { KnowledgebaseClass } from "@blaxel/sdk/knowledgebase/types.js";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import {
  CompiledGraph,
  LangGraphRunnableConfig,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { FastifyRequest } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { getKnowledgebase } from "./knowledgebase";
import { prompt } from "./prompt";

/**
 * Input type for handling chat inputs.
 *
 * @typedef {Object} InputType
 * @property {string | null} inputs - Primary input field.
 * @property {string | null} input - Alternative input field.
 */
type InputType = {
  inputs: string | null;
  input: string | null;
};

/**
 * Type representing the agent instance.
 *
 * @typedef {Object} AgentType
 * @property {CompiledGraph<any, any, any, any, any, any>} agent - The compiled graph for the agent.
 */
type AgentType = {
  agent: CompiledGraph<any, any, any, any, any, any>;
};

/**
 * Enhances the chat conversation context by incorporating relevant previous information.
 *
 * This function searches for prior conversation "memories" in the knowledgebase based on
 * the content of the last message in the conversation state. If relevant memories are found,
 * they are appended to a context string which is then included in the system prompt.
 * In case of an error during the search, the error details are appended to the prompt.
 *
 * @async
 * @function handleContext
 * @param {typeof MessagesAnnotation.State} state - The current conversation state.
 * @param {LangGraphRunnableConfig} config - Configuration details for the langgraph execution.
 * @param {KnowledgebaseClass} knowledgebase - Instance used to perform knowledgebase searches.
 * @returns {Promise<BaseMessage[]>} An array of chat messages including the enhanced context.
 */
const handleContext = async (
  state: typeof MessagesAnnotation.State,
  config: LangGraphRunnableConfig,
  knowledgebase: KnowledgebaseClass
) => {
  const messages: BaseMessage[] = [];
  try {
    // Use the content of the latest message to search for relevant memories.
    const documents = await knowledgebase.search(
      state.messages[state.messages.length - 1].content as string
    );
    if (documents.length > 0) {
      let context = "Relevant information from previous conversations:\n";
      logger.info(`Retrieved ${documents.length} documents from knowledgebase`);
      // Append each found doc with its similarity score.
      documents.forEach((doc: { value: string; similarity: number }) => {
        context += `- ${doc.value} (score: ${doc.similarity})\n`;
      });
      // Merge the defined prompt with the contextual documents.
      const message = new SystemMessage(prompt + context);
      messages.push(message);
    } else {
      // Fallback to the basic prompt if no relevant documents are found.
      messages.push(new SystemMessage(prompt));
    }
  } catch (error) {
    let context = "";
    // Gracefully handle any errors during the search and include error details.
    if (error instanceof Error && "status" in error) {
      context = ` Could not retrieve documents from store: ${
        (error as any).status
      } - ${error.message}`;
    } else {
      context = ` Could not retrieve documents from store: ${error}`;
    }
    logger.warn(context);
    // Append the error information to the prompt.
    const message = new SystemMessage(prompt + context);
    messages.push(message);
  }
  // Append the original messages to maintain state.
  messages.push(...state.messages);
  return messages;
};

/**
 * Processes an incoming HTTP request and streams the response from the agent.
 *
 * The function extracts the input from the request body, creates or retrieves
 * a thread ID for tracking, and then streams the response from the agent.
 * The last message from the agent's response is returned.
 *
 * @async
 * @function req
 * @param {FastifyRequest} request - The incoming HTTP request object.
 * @param {AgentType} args - An object containing the agent instance.
 * @returns {Promise<string>} The final message content from the agent.
 */
const req = async (request: FastifyRequest, args: AgentType) => {
  const { agent } = args;
  const body = (await request.body) as InputType;
  // Retrieve an existing thread ID or generate a new one for the conversation.
  const thread_id = getDefaultThread(request) || uuidv4();
  // Extract the user input from one of the possible fields.
  const input = body.inputs || body.input || "";
  const responses: any[] = [];

  // Stream the chat agent response; wrap the input in a HumanMessage.
  const stream = await agent.stream(
    { messages: [new HumanMessage(input)] },
    { configurable: { thread_id } }
  );

  // Accumulate streamed response chunks.
  for await (const chunk of stream) {
    responses.push(chunk);
  }
  // Extract and return the final agent message content.
  const content = responses[responses.length - 1];
  return content.agent.messages[content.agent.messages.length - 1].content;
};

/**
 * Initializes and returns a configured chat agent.
 *
 * The function sets up the chat agent by:
 *  - Retrieving the available functions and tools.
 *  - Loading the specified chat model, here "sandbox-openai".
 *  - Initializing the knowledgebase for retrieving previous conversation context.
 *
 * It then uses the `wrapAgent` helper to combine the HTTP request handler (`req`)
 * and an overridden agent created with `createReactAgent`. The React agent includes
 * a custom prompt function that integrates contextual data using the `handleContext` function.
 *
 * @async
 * @function agent
 * @returns {Promise<any>} The fully configured and wrapped chat agent.
 */
export const agent = async () => {
  // Retrieve available functions for the agent.
  const functions = await getFunctions({ remoteFunctions: ["aws-s3"] });

  // Load the chat model (e.g., "sandbox-openai").
  const model = (await getChatModel("gpt-4o-mini")) as BaseChatModel<any, any>;
  // Initialize the knowledgebase for context retrieval.
  const knowledgebase = await getKnowledgebase();
  // Wrap the agent with a custom HTTP request handler and additional metadata.
  return wrapAgent(req, {
    agent: {
      metadata: {
        name: "demo-sales-kpi-reporter",
      },
      spec: {
        prompt,
      },
    },
    overrideAgent: createReactAgent({
      llm: model,
      tools: functions,
      checkpointSaver: new MemorySaver(),
      // Override the prompt function to inject context from the knowledgebase.
      prompt: async (
        state: typeof MessagesAnnotation.State,
        config: LangGraphRunnableConfig
      ) => {
        return await handleContext(state, config, knowledgebase);
      },
    }),
  });
};

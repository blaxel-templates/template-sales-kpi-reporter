import { CompiledGraph } from "@langchain/langgraph";

/**
 * Input type for handling chat inputs.
 *
 * @typedef {Object} InputType
 * @property {string | null} inputs - Primary input field.
 * @property {string | null} input - Alternative input field.
 */
export type InputType = {
  inputs: string | null;
  input: string | null;
};

/**
 * Type representing the agent instance.
 *
 * @typedef {Object} AgentType
 * @property {CompiledGraph<any, any, any, any, any, any>} agent - The compiled graph for the agent.
 */
export type AgentType = {
  agent: CompiledGraph<any, any, any, any, any, any>;
};

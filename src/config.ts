import { OpenAI } from "https://deno.land/x/openai@1.3.1/mod.ts";
import { load } from "https://deno.land/std@0.178.0/dotenv/mod.ts";

const env = await load();
const openAIKey = env["OPENAI_API_KEY"];

// Create OpenAI instance
if (!openAIKey) {
  throw new Error("Please set OPENAI_API_KEY as an environment variable.");
}
export const openAI = new OpenAI(openAIKey);

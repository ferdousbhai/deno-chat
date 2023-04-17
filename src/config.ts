import { OpenAI } from "https://deno.land/x/openai@1.3.0/mod.ts";
import { load } from "https://deno.land/std@0.178.0/dotenv/mod.ts";

const env = await load();
const OPENAI_API_KEY = env["OPENAI_API_KEY"];

// Create OpenAI instance
if (!OPENAI_API_KEY) {
  throw new Error("Please set OPENAI_API_KEY.");
}
export const openAI = new OpenAI(OPENAI_API_KEY);
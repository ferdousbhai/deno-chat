import { StatelessAI } from "../mod.ts";

// Create an AI with unique system instructions:
const marvin = new StatelessAI({
  instruction:
    "Always respond as if researching an article for the Hitchhiker's Guide to the Galaxy",
});
console.log(
  await marvin.ask(
    "What is the meaning of life, the universe, and everything?",
  ),
);

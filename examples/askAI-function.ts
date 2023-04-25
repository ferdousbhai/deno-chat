import { askAI } from "../mod.ts";

// Ask AI any question:
const botResponse = await askAI(
  "List 5 fruits that start with the letter 'a'.",
);
console.log(botResponse);

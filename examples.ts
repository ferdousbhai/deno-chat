import { AI, askAI } from "./mod.ts";

// Ask AI any question:
const botResponse = await askAI(
  "List 5 fruits that start with the letter 'a'.",
);
console.log(botResponse);

// Create an AI with unique system instructions:
const marvin = new AI({
  instruction:
    "Always respond as if researching an article for the Hitchhiker's Guide to the Galaxy",
});
console.log(
  await marvin.ask(
    "What is the meaning of life, the universe, and everything?",
  ),
);

// Multi-turn chat (with a chat session):
const dan = new AI({
  instruction:
    "You are a tutor. Always ask questions to help the user think for themselves instead of giving away the answer right away.",
});
await dan.ask(
  "What is the meaning of life, the universe, and everything?",
  {
    chatId: "123456789",
  },
);
await dan.ask("Just tell me the answer.", {
  chatId: "123456789",
});
dan.log("123456789");

// Reset a chat session:
dan.reset("123456789");

// Now ask the same question again:
await dan.ask(
  "What is the meaning of life, the universe, and everything?",
  {
    chatId: "123456789",
  },
);
dan.log("123456789");

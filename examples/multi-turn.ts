import { AI } from "../mod.ts";

// Multi-turn chat (with a chat session):
const dan = new AI({
  name: "Dan",
  instruction:
    "You are a tutor. Always ask questions to help the user think for themselves instead of giving away the answer right away."
});
console.log(
  await dan.ask(
    "What is the meaning of life, the universe, and everything?",
    {
      chatId: "123456789",
    },
  ),
);
console.log(dan.conversationSummary("123456789"));
console.log(
  await dan.ask("Just tell me the answer.", {
    chatId: "123456789",
  }),
);
console.log(dan.conversationSummary("123456789"));

// Reset a chat session:
dan.reset("123456789");

// Now ask the same question again:
console.log(
  await dan.ask(
    "What is the meaning of life, the universe, and everything?",
    {
      chatId: "123456789",
    },
  ),
);

import { Bot, askAI } from "./mod.ts";

// Ask AI any question:
const botResponse = await askAI("List 5 fruits that start with the letter 'a' in JSON. Respond only in JSON.");
console.log(botResponse);

// Create an AI with unique system instructions:
const marvin = new Bot({ instruction: "Always respond as if researching an article for the Hitchhiker's Guide to the Galaxy" });
const responseFromMarvin = await marvin.ask(
  "What is the meaning of life, the universe, and everything?",
);
console.log(`Marvin says, "${responseFromMarvin}"`);

// Multi-turn chat (with a chat session):
const dan = new Bot({
instruction: "Always ask questions to help the user think for themselves.",
});

const firstResponseFromDan = await dan.ask(
  "What is the meaning of life, the universe, and everything?",
  {
    chatId: "123456789",
  },
);
console.log(`Dan says, "${firstResponseFromDan}"`);

const secondResponseFromDan = await dan.ask("Just tell me the answer.", {
  chatId: "123456789",
});
console.log(`Dan says, "${secondResponseFromDan}"`);

// Reset a chat session:
dan.reset("123456789");
const responseFromDanAfterReset = await dan.ask(
  "What is the meaning of life, the universe, and everything?",
  {
    chatId: "123456789",
  },
);
console.log(`Dan says, "${responseFromDanAfterReset}"`);

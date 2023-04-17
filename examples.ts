import { Bot } from "./mod.ts";

// Single-turn question without a chat session:
const marvin = new Bot();
const responseFromMarvin = await marvin.ask("What's the meaning of life?");
console.log(`Marvin says, "${responseFromMarvin}"`);

// Multi-turn chat with a bot:
const dan = new Bot({
  name: "Dan",
  instruction: "You can a Socratic tutor. Always ask questions.",
});

const responseFromDan1 = await dan.ask("What's the meaning of life?", {
  chatId: "123456789",
});
console.log(`Dan says, "${responseFromDan1}"`);

const responseFromDan2 = await dan.ask("I'm not so sure.", {
  chatId: "123456789",
});
console.log(`Dan says, "${responseFromDan2}"`);

// Reset a chat session:
dan.reset("123456789");
const responseFromDanAfterReset = await dan.ask("What's the meaning of life?", {
  chatId: "123456789",
});
console.log(`Dan says, "${responseFromDanAfterReset}"`);

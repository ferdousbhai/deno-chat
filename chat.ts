import { AI } from "./mod.ts";

// Prompt user for input:
const botName = prompt("What would you like to name the AI?");
const botInstruction = prompt(
  "What instructions would you like to give the AI? You can create a unique personality this way.",
);
const bot = new AI({
  name: botName ? botName : undefined,
  instruction: botInstruction ? botInstruction : undefined,
});

while (true) {
  // Prompt user for input:
  let input = prompt("You:");
  if (!input) {
    console.log("Sorry, the prompt cannot be empty.");
    input = prompt("You:");
  }
  // Ask the bot for a response:
  const output = await bot.ask(input!, { chatId: "123456789" });
  // Log the output:
  console.log(`${botName || "AI"}: ${output}`);
  // Ask the user if they want to continue:
  const shouldContinue = confirm("Would you like to continue?");
  if (!shouldContinue) {
    break;
  }
}

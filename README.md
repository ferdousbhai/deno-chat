# deno-chat: A Chatbot-Kickstarter
A basic framework for working with Open AI's Chat API and storing context of previous conversation "turns".

## Usage

### Single-turn conversation (without a chat session)

```ts
import { Bot } from "https://deno.land/x/deno_chat@0.1.1/mod.ts"
const marvin = new Bot();
const responseFromMarvin = await marvin.ask("What's the meaning of life?");
console.log(`Marvin says, "${responseFromMarvin}"`);
```

### Multi-turn conversation (with a chat session)

```ts
const dan = new Bot({
  name: "Dan",
  instruction: "You are a Socratic tutor. Ask relevant questions.",
});

const responseFromDan1 = await dan.ask("What's the meaning of life?", {
  chatId: "123456789",
});
console.log(`Dan says, "${responseFromDan1}"`);

const responseFromDan2 = await dan.ask("I'm not so sure.", {
  chatId: "123456789",
});
console.log(`Dan says, "${responseFromDan2}"`);
```

### Reset a chat session
```ts
dan.reset("123456789");
const responseFromDanAfterReset = await dan.ask("What's the meaning of life?", {
  chatId: "123456789",
});
console.log(`Dan says, "${responseFromDanAfterReset}"`);
```



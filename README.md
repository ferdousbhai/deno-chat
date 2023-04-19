# deno-chat: A Chatbot Kickstarter

A basic framework for working with Open AI's Chat API.

## Features

> 🙋 Ask AI anything with a simple **askAI** function. 🤖 Create bots with
> distinct instructions using a simple **bot** class. 💬 Persist memories in
> long chat sessions (coming soon!).

## Usage

The main component in this modules are:

1. An **askAI** function that makes it easy to ask ChatGPT anything and get
   immediate answer.
2. A **Bot** class that allows custom system instruction, and makes it easy to
   interact with a bot in a multi-turn conversation.

### Ask AI anything

```ts
import { askAI } from "https://deno.land/x/deno_chat/mod.ts";
await askAI(
  "List 5 fruits that start with the letter 'a' in JSON. Respond only in JSON.",
);
```

```
{
   "fruits": [
      "Apple",
      "Apricot",
      "Avocado",
      "Acai",
      "Acerola"
   ]
}
```

### Create a bot with unique instructions

```ts
import { Bot } from "https://deno.land/x/deno_chat/mod.ts";
const marvin = new Bot({
  instruction:
    "Always respond as if researching an article for the Hitchhiker's Guide to the Galaxy",
});
await marvin.ask(
  "What is the meaning of life, the universe, and everything?",
);
```

```
According to the fictional novel "The Hitchhiker's Guide to the Galaxy" by Douglas Adams, the answer to the ultimate question of life, the universe, and everything is 42. However, this answer was provided by a highly advanced computer named Deep Thought, and it remains unknown what the actual question was. Therefore, the search for the true meaning of life, the universe, and everything continues.
```

### Multi-turn conversation (with a chat session)

```ts
const dan = new Bot({
  instruction: "Always ask questions to help the user think for themselves.",
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

// Reset the chat session
dan.reset("123456789");

// Now ask again
await dan.ask(
  "What is the meaning of life, the universe, and everything?",
  {
    chatId: "123456789",
  },
);
```

```
That's a philosophical question that has puzzled people for centuries. What do you think the meaning of life, the universe, and everything is?
```

```
According to Douglas Adams' book, The Hitchhiker's Guide to the Galaxy, the answer to the ultimate question of life, the universe, and everything is 42. However, the book also points out that the characters do not know what the question actually was. So, the meaning of life, the universe, and everything remains a mystery.
```

```
That is a philosophical question which has been debated for centuries. What do you think the answer could be?
```

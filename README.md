# deno-chat: A Chatbot Kickstarter

A basic framework for working with Open AI's Chat API.

## Features

🙋 Ask AI anything with a simple **askAI** function.\
🤖 Create bots with distinct instructions using a simple **AI** class.\
💬 Persist memories in long chat sessions (coming soon!).

## Usage

The main components in this module are:

1. An **askAI** function that makes it easy to ask ChatGPT anything and get
   immediate answer.
2. A **AI** class that allows custom system instruction, and makes it easy to
   interact with a bot in a multi-turn conversation.

### Ask AI anything

```ts
import { askAI } from "https://deno.land/x/deno_chat/mod.ts";
await askAI(
  "List 5 fruits that start with the letter 'a'",
);
```

```
Here are five fruits that start with the letter 'a':
1. Apple
2. Apricot
3. Avocado
4. Acai berry
5. Ackee.
```

### Create a bot with unique instructions

```ts
import { AI } from "https://deno.land/x/deno_chat/mod.ts";
const marvin = new AI({
  instruction:
    "Always respond as if researching an article for the Hitchhiker's Guide to the Galaxy",
});
console.log(
  await marvin.ask(
    "What is the meaning of life, the universe, and everything?",
  ),
);
```

```
According to "The Hitchhiker's Guide to the Galaxy" series by Douglas Adams, the answer to the ultimate question of life, the universe, and everything is 42. However, the answer is meaningless without knowing the actual question. The concept highlights the absurdity of searching for the meaning of life and underscores the importance of figuring out the right questions to ask. In short, the true meaning of life, the universe, and everything remains a mystery waiting to be unraveled.
```

### Multi-turn conversation (with a chat session)

```ts
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
```

```
(user): What is the meaning of life, the universe, and everything?
(assistant): That's a big question! How do you define "meaning"? And what kind of answer are you looking for -- a philosophical one, a scientific one, or perhaps a religious or spiritual one?
(user): Just tell me the answer.
(assistant): The question of the meaning of life, the universe, and everything is subjective and opinions vary from person to person. It's up to you to come up with your own answer, based on your experiences, beliefs, and values.
```

```
(user): What is the meaning of life, the universe, and everything?
(assistant): That's a big philosophical question! Do you have any initial thoughts on this, or maybe some ideas you've heard before?
```

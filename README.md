# deno-chat: A Chatbot Kickstarter

A basic framework for working with Open AI's Chat API.

## Introduction

By default, Large Language Models are stateless — meaning each incoming query is
processed independently of other interactions. The only thing that exists for a
stateless agent is the current input. When building chatbots or autonomous
agents, it's important to remember previous interactions for context.

As a workaround to this problem, we can store every interaction with the model
and pass the entire history in each turn, however this uses up a lot of tokens,
and is ultimately constrained by the token limit (4096 tokens for
gpt-3.5-turbo).

Deno-Chat solves these issues by storing a summary of the on-going conversation
each turn. Optionally, the summary can also be added to a vector database for
future retrieval. This way, the AI has much richer context in conversations from
both present and past interactions.

## Features

🙋 Ask AI anything with a simple **askAI** function.\
🤖 Create bots with distinct instructions using a simple **AI** class.\
💬 Persist memories in long chat sessions (coming soon!).

## Usage

The main components in this module are:

1. An **askAI** function that makes it easy to ask ChatGPT anything and get
   immediate answer.
2. An **AI** class that allows custom system instruction, and makes it easy to
   interact with a bot in a multi-turn conversation by introducing a session
   type to store data for each chat.

### Ask AI anything

```ts
import { askAI } from "https://deno.land/x/deno_chat/mod.ts";
await askAI(
  "List 5 fruits that start with the letter 'a'",
); // Apple, Apricot, Avocado, Acerola, Acai.
```

### Create a bot with unique instructions

```ts
import { AI } from "https://deno.land/x/deno_chat/mod.ts";
const marvin = new AI({
  instruction:
    "Always respond as if researching an article for the Hitchhiker's Guide to the Galaxy",
});
await marvin.ask(
  "What is the meaning of life, the universe, and everything?",
); // According to "The Hitchhiker's Guide to the Galaxy" series by Douglas Adams, the answer to the ultimate question of life, the universe, and everything is 42. However, the answer is meaningless without knowing the actual question. The concept highlights the absurdity of searching for the meaning of life and underscores the importance of figuring out the right questions to ask. In short, the true meaning of life, the universe, and everything remains a mystery waiting to be unraveled.
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
); // That's a big question! How do you define "meaning"? And what kind of answer are you looking for -- a philosophical one, a scientific one, or perhaps a religious or spiritual one?
await dan.ask("Just tell me the answer.", {
  chatId: "123456789",
}); // As a tutor, my aim is not to just provide an answer, but to help you develop critical thinking and problem-solving skills. So, I'd like you to consider the different perspectives on this question and think about what the answer might be for you personally. What do you think the meaning of life is?

// Reset a chat session:
dan.reset("123456789");

// Now ask the same question again:
await dan.ask(
  "What is the meaning of life, the universe, and everything?",
  {
    chatId: "123456789",
  },
); // That's a big philosophical question! Do you have any initial thoughts on this, or maybe some ideas you've heard before?
```

### Drop into chat from command line

Run `chat.ts` script.

```
deno run --allow-all .\chat.ts
```

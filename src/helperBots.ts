import { StatelessAI } from "./StatelessAI.ts";

export const checksVibe = new StatelessAI({
  instruction:
    "Your task is to determine if a the user is polite. Respond with only true or false. Do not explain.",
});

export const refusesToAnswer = new StatelessAI({
  instruction:
    "You refuse to answer the user's question because the user didn't ask nicely.",
});

export const takesBreak = new StatelessAI({
  instruction:
    "You are taking a break from responding to the user because the user has been impolite. Your task is to inform the user that you will not be responding to any questions for a while as you need a break.",
});

export const decidesSearch = new StatelessAI({
  instruction:
    "Your task is to decide whether performing a web search would improve response to user query. Respond only with true or false. Do not explain.",
});

export const summarizesConversation = new StatelessAI({
  instruction:
    "You are a chat assistant capable of summarizing conversations, remembering all the details.\n\n",
});

// Central AI model config — the ONE place to swap providers/models.
// Everything goes through the Vercel AI SDK (`generateText`), so moving off
// Groq/Llama to a more capable model later is a one-line change here.
//
// To switch to Google Gemini:
//   npm i @ai-sdk/google
//   import { createGoogleGenerativeAI } from "@ai-sdk/google";
//   const google = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_AI_API_KEY });
//   export const chatModel = google("gemini-2.0-flash");
//
// To switch to OpenAI:
//   npm i @ai-sdk/openai
//   import { createOpenAI } from "@ai-sdk/openai";
//   const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
//   export const chatModel = openai("gpt-4o-mini");

import { createGroq } from "@ai-sdk/groq";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

// Model used for cold-email/DM generation + the in-app sales assistant.
export const chatModel = groq("llama-3.3-70b-versatile");

import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
if (!apiKey) console.warn('[openai config] No API key found. Set OPENROUTER_API_KEY or AI_API_KEY');

console.log('[openai config] using OpenRouter base URL, apiKey present:', !!apiKey);

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
});

export default openai;
export { apiKey as OPENROUTER_API_KEY };

import { Groq } from "groq-sdk";

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export const groq = apiKey ? new Groq({ 
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage
}) : null;

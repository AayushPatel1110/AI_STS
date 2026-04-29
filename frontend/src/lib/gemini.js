import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let aiModel = null;

if (apiKey) {
  try {
    // The @google/genai constructor takes an OBJECT with apiKey
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    
    // In @google/genai, models are accessed via .models.get() or similar
    // Based on your original snippet: ai.models.generateContentStream
    aiModel = ai; 
    console.log("Gemini AI (@google/genai): Initialized successfully.");
  } catch (err) {
    console.error("Gemini AI: Initialization failed:", err);
  }
} else {
  console.error("Gemini AI: VITE_GEMINI_API_KEY is missing in .env");
}

export { aiModel };


import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse, Priority, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseTaskFromSentence = async (sentence: string): Promise<AIResponse | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse this sentence into a task object. 
      Input: "${sentence}"
      Rules:
      1. Extract a clear 'title'.
      2. Extract a 'description' if additional context exists.
      3. Extract 'time' in HH:mm 24-hour format if specified (e.g., 3pm -> 15:00).
      4. Infer 'priority' (LOW, MEDIUM, HIGH).
      5. Infer 'category' (WORK, PERSONAL, FAMILY, HEALTH).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            time: { type: Type.STRING, description: "HH:mm format" },
            priority: { 
              type: Type.STRING, 
              enum: Object.values(Priority) 
            },
            category: { 
              type: Type.STRING, 
              enum: Object.values(Category) 
            },
          },
          required: ["title", "priority", "category"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text.trim()) as AIResponse;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

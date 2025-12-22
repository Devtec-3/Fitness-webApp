
import { GoogleGenAI, Type } from "@google/genai";
import { Task, HealthNews, CalorieData } from "../types";

// Initialize the Gemini API client using the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAuraIntelligence = async (
  currentTasks: Task[],
  userPrompt: string,
  location?: { latitude: number, longitude: number }
): Promise<{ text: string; sources: any[] }> => {
  // Use Gemini 2.5 series model as it's required for Google Maps grounding.
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `You are Aura, the world's most advanced AI Life Architect. 
  You integrate global knowledge and local geography to optimize human routines.
  Current time: ${new Date().toLocaleString()}.
  Use Google Search for real-time news/trends and Google Maps for location-specific advice.`;

  const taskList = currentTasks.map(t => `- ${t.startTime}: ${t.title} (${t.category})`).join('\n');
  const prompt = `Context: User's schedule: ${taskList}\nQuery: ${userPrompt}`;

  const tools: any[] = [{ googleSearch: {} }];
  let toolConfig: any = undefined;

  if (location) {
    tools.push({ googleMaps: {} });
    toolConfig = { retrievalConfig: { latLng: { latitude: location.latitude, longitude: location.longitude } } };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction, tools, toolConfig }
    });
    // Safely extract text output and grounding chunks for citations.
    return {
      text: response.text || "Synchronizing...",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error(error);
    return { text: "Connection error.", sources: [] };
  }
};

export const getBotanicalAdvice = async (query: string): Promise<{ text: string; sources: any[] }> => {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = `You are the Aura Botanical Architect. 
  Your goal is to provide the best advice on nutrition and organic, chemical-free agriculture.
  When a user asks how to plant something:
  1. Provide a step-by-step chemical-free guide.
  2. Explain WHY it is the best food to eat.
  3. Include mentions of video tutorials from reputable sources.
  Use Google Search grounding to find the most up-to-date sources and video links.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: { 
        systemInstruction,
        tools: [{ googleSearch: {} }] 
      }
    });
    return {
      text: response.text || "I couldn't find organic data for that.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error(error);
    return { text: "Error fetching botanical intelligence.", sources: [] };
  }
};

export const calculateCalories = async (foodInput: string): Promise<CalorieData> => {
  const model = 'gemini-3-flash-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze the calories and macros for: "${foodInput}". Provide a breakdown and a single sentence of nutritional advice.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            food: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            advice: { type: Type.STRING }
          },
          required: ["food", "calories", "protein", "carbs", "fat", "advice"]
        }
      }
    });
    // Access response.text property directly as per latest SDK guidelines.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Calorie calculation failed:", error);
    return { food: foodInput, calories: 0, protein: 0, carbs: 0, fat: 0, advice: "Calibration failed." };
  }
};

export const getLatestHealthNews = async (): Promise<HealthNews[]> => {
  const model = 'gemini-3-flash-preview';
  try {
    const response = await ai.models.generateContent({
      model,
      contents: "Find the 4 most important global health updates or medical breakthroughs from the last 24-48 hours. Provide title, summary, and source URL.",
      config: {
        tools: [{ googleSearch: {} }],
        // Note: Grounded search may not always return valid JSON; handle with care as per SDK rules.
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              url: { type: Type.STRING },
              timestamp: { type: Type.STRING }
            },
            required: ["title", "summary", "url", "timestamp"]
          }
        }
      }
    });
    // Wrap in try-catch because grounded search text might contain additional explanations outside JSON.
    const text = response.text || "[]";
    try {
      // Find the first '[' and last ']' to extract JSON array if text contains noise
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(text.substring(jsonStart, jsonEnd));
      }
      return JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse grounded JSON response", e);
      return [];
    }
  } catch (error) {
    console.error("Health news fetch failed:", error);
    return [];
  }
};

export const getGlobalInspiration = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "One unique global productivity ritual trending now. 2 sentences.",
      config: { tools: [{ googleSearch: {} }] }
    });
    return response.text || "Focus on deep work.";
  } catch (error) {
    console.error(error);
    return "Optimize your focus blocks.";
  }
};

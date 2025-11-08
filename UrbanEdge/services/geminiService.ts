
import { GoogleGenAI, Type } from "@google/genai";
import { Recommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getFashionRecommendations = async (prompt: string): Promise<Recommendation[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following request, suggest 3 fashion items from URBANEDGE. Request: "${prompt}"`,
      config: {
        systemInstruction: `You are a fashion stylist for URBANEDGE, a modern men's fashion store for the Indian market.
        Your suggestions should be cool, confident, and align with a style that is affordable and trendy.
        Available categories are: Jackets, Sneakers, T-Shirts, Shirts, Jeans, Accessories, Shoes.
        Return your response as a JSON array of objects.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemName: {
                type: Type.STRING,
                description: 'A creative and specific name for the recommended clothing item.',
              },
              category: {
                type: Type.STRING,
                description: 'The category the item belongs to (e.g., "Jackets", "Sneakers").',
              },
              reasoning: {
                type: Type.STRING,
                description: 'A brief, stylish reason why this item fits the user\'s request.',
              },
            },
            required: ['itemName', 'category', 'reasoning'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received empty response from API");
    }
    
    const recommendations: Recommendation[] = JSON.parse(jsonText);
    return recommendations;
  } catch (error) {
    console.error("Error getting fashion recommendations:", error);
    throw new Error("Failed to generate style recommendations. Please try again.");
  }
};
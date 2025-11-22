

import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Recommendation, Product, Order, AIStockSuggestion } from '../types';

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


const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
};

export const generateTryOnImage = async (
  userImageBase64: string,
  suggestion: string
): Promise<string> => {
    try {
        const userImagePart = fileToGenerativePart(userImageBase64, 'image/jpeg');
        const promptText = `Edit the photo to realistically show the person wearing ${suggestion}. Maintain the original background and the person's pose and face.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    userImagePart,
                    { text: promptText },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data; // This is the base64 string
            }
        }
        throw new Error("No image was generated.");

    } catch (error) {
        console.error("Error generating try-on image:", error);
        throw new Error("Failed to visualize the suggestion. Please try again.");
    }
};

export const getAIStockSuggestions = async (products: Product[], orders: Order[]): Promise<AIStockSuggestion[]> => {
    try {
        // Simple sales analysis from orders
        const salesData = products.map(p => {
            const unitsSold = orders
                .flatMap(o => o.items)
                .filter(item => item.id === p.id)
                .reduce((sum, item) => sum + item.quantity, 0);
            return {
                id: p.id,
                name: p.name,
                stock: p.stock,
                unitsSold,
            };
        });

        const prompt = `
            You are an expert inventory management AI for URBANEDGE, a men's fashion e-commerce store.
            Analyze the following product data, which includes current stock levels and total units sold recently.
            Identify products that should be marked as "out of stock".
            Prioritize products that are already at 0 stock.
            Also, identify products with low stock (5 or fewer units) and high sales velocity (sold more than 10 units) as they are at risk of selling out.
            Provide your analysis in a structured JSON format.

            Product Data:
            ${JSON.stringify(salesData, null, 2)}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            productId: { type: Type.INTEGER },
                            productName: { type: Type.STRING },
                            currentStock: { type: Type.INTEGER },
                            reasoning: { type: Type.STRING, description: "Why this product needs attention." },
                            action: { type: Type.STRING, description: "Recommended action: 'set_out_of_stock' or 'monitor'." },
                        },
                        required: ['productId', 'productName', 'currentStock', 'reasoning', 'action'],
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
            return []; // Return empty array if AI gives no suggestions
        }
        
        const suggestions: AIStockSuggestion[] = JSON.parse(jsonText);
        // Filter only for the action we care about on the UI
        return suggestions.filter(s => s.action === 'set_out_of_stock');

    } catch (error) {
        console.error("Error getting AI stock suggestions:", error);
        throw new Error("Failed to generate AI stock analysis. Please try again.");
    }
};

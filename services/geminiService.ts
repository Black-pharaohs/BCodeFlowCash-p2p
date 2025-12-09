import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ParsedRequest {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  notes: string;
}

export const parseNaturalLanguageRequest = async (prompt: string): Promise<ParsedRequest | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the currency exchange details from this user request: "${prompt}". 
      Assume the user wants to convert FROM a currency TO another. 
      If not specified, assume 'fromCurrency' is USD.
      Return a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            fromCurrency: { type: Type.STRING },
            toCurrency: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: ["amount", "toCurrency"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as ParsedRequest;
    }
    return null;
  } catch (error) {
    console.error("Error parsing request with Gemini:", error);
    return null;
  }
};

export const getSafetyAnalysis = async (requestDetails: any): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the safety of this P2P currency transaction request: ${JSON.stringify(requestDetails)}. 
      Consider the distance (closer is usually better for cash, irrelevant for digital) and amount. 
      Provide a concise 1-sentence safety tip or risk assessment.`,
    });
    return response.text || "Proceed with caution.";
  } catch (error) {
    return "Unable to generate safety analysis.";
  }
};

export const getFinancialInsight = async (transactions: any[], balance: number): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze this user's wallet balance ($${balance}) and recent transactions: ${JSON.stringify(transactions.slice(0, 5))}.
            Provide a helpful, friendly, and brief financial insight or tip suitable for a mobile app notification.`,
        });
        return response.text || "Keep tracking your expenses!";
    } catch (e) {
        return "Insight generation failed.";
    }
}
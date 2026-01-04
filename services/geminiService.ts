
import { GoogleGenAI, Type } from "@google/genai";

export const checkKeySelection = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    try {
      return await (window as any).aistudio.hasSelectedApiKey();
    } catch (e) {
      return false;
    }
  }
  return !!process.env.API_KEY;
};

export const openKeyPicker = async () => {
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    await (window as any).aistudio.openSelectKey();
    return true;
  }
  return false;
};

export const analyzeFrame = async (base64Image: string) => {
  // Vytvorenie novej inštancie priamo pred volaním
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
            { text: "Analyze this old film frame. Detect noise levels (0-100), grain intensity, and color fading. Return JSON format with fields: noiseLevel, sharpness, colorHealth, grainType." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            noiseLevel: { type: Type.NUMBER },
            sharpness: { type: Type.NUMBER },
            colorHealth: { type: Type.NUMBER },
            grainType: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["noiseLevel", "sharpness", "colorHealth"]
        }
      }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.warn("Analysis fallback active", error);
    return { noiseLevel: 75, sharpness: 45, colorHealth: 35 };
  }
};

export const startRemasterOperation = async (prompt: string, startImageBase64: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    return await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Extreme HD Remaster. Crystal clear, no noise, 4K texture, vibrant colors. ${prompt}`,
      image: {
        imageBytes: startImageBase64,
        mimeType: 'image/jpeg'
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });
  } catch (error: any) {
    // Ak zlyhá kvôli chýbajúcemu platenému kľúču, vyhodíme chybu, ktorú App.tsx spracuje ako signál pre Live Mode
    throw error;
  }
};

export const checkOperationStatus = async (operation: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return await ai.operations.getVideosOperation({ operation });
};

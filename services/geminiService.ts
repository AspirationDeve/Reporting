
import { GoogleGenAI } from "@google/genai";
import { DashboardData } from "../types";

export const getDashboardInsights = async (data: DashboardData): Promise<string> => {
  // Initialize GoogleGenAI using named parameter and direct process.env.API_KEY reference
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a senior digital marketing strategist. Analyze the following dashboard data and provide 3-4 bullet points of high-level strategic insights.
    
    SEO Rankings: ${JSON.stringify(data.rankings)}
    KPIs: ${JSON.stringify(data.kpis)}
    Google Ads: ${JSON.stringify(data.googleAds)}
    Meta Ads: ${JSON.stringify(data.metaAds)}
    
    Format the response with bullet points and bold key terms. Keep it professional and actionable. Focus on cross-channel opportunities.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });

    // Directly access .text property as it is a getter (not a method call)
    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "Error analyzing data. Please check your API key and connection.";
  }
};

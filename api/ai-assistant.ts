import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { prompt, language = "fr", context = "" } = req.body || {};

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt manquant",
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY non configurée",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `
Tu es l'assistant IA officiel de IT-LeadHER.

Réponds toujours en ${language}.

Contexte :
${context}

Question :
${prompt}
      `,
    });

    return res.status(200).json({
      reply: interaction.output_text,
    });

  } catch (error: any) {
    console.error("AI ASSISTANT ERROR:", error);

    return res.status(500).json({
      error: error?.message || "Erreur interne du serveur",
    });
  }
}
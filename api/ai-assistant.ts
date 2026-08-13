import { GoogleGenAI } from "@google/genai";

export default async function handler(req: { method: string; body: { prompt?: string; language?: string; context?: string }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; reply?: string | undefined; }): any; new(): any; }; }; }) {
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
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        error: "GEMINI_API_KEY non configurée sur Vercel",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Tu es l'assistant IA officiel de IT-LeadHER.

Réponds en ${language}.

Contexte :
${context}

Question :
${prompt}
              `,
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      reply: response.text,
    });
  } catch (error) {
    console.error("AI ASSISTANT ERROR:", error);

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Erreur interne du serveur",
    });
  }
}
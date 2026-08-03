import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const { prompt, language = "fr", context = "" } = req.body;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Contexte : ${context}\nQuestion : ${prompt}`,
          },
        ],
      },
    ],
  });

  return res.status(200).json({
    reply: response.text,
  });
}
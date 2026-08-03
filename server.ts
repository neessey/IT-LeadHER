import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI Client
let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAI;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'IT-LeadHER Platform',
    timestamp: new Date().toISOString()
  });
});

// 2. AI Assistant Endpoint (Powered by Gemini)
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { prompt, language = 'fr', context = '' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      return res.json({
        reply: language === 'fr'
          ? "Bonjour ! Je suis l'Assistant Virtuel IT-LeadHER. Pour obtenir des recommandations personnalisées basées sur l'IA Gemini, veuillez vous assurer d'avoir configuré votre clé GEMINI_API_KEY. En attendant, je vous invite à explorer nos parcours en Développement Web, Data Science et Leadership !"
          : "Hello! I am the IT-LeadHER Virtual Assistant. To receive personalized AI career advice, please make sure GEMINI_API_KEY is configured. In the meantime, feel free to explore our Web Development, Data Science, and Leadership tracks!"
      });
    }

    const systemInstruction = `Tu es l'Assistant officiel d'IT-LeadHER (https://it-leadher.org), une organisation internationale dédiée à la formation, au mentorat et au leadership des femmes et jeunes filles dans la technologie et le numérique.
Tes objectifs :
1. Conseiller les apprenantes sur le choix de leur parcours de formation (Développement Web, Data Science, IA, Cybersécurité, UI/UX, Leadership).
2. Fournir des explications pédagogiques, claires, bienveillantes et motivantes.
3. Repondre dans la langue demandée : ${language === 'fr' ? 'Français' : 'Anglais'}.
Contexte optionnel de l'utilisateur : ${context}`;

    const model = ai.models;
    const response = await model.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nQuestion de l'utilisatrice : ${prompt}` }] }
      ]
    });

    const reply = response.text || (language === 'fr' ? 'Désolé, je n\'ai pas pu générer de réponse pour le moment.' : 'Sorry, I could not generate a response at this time.');
    return res.json({ reply });

  } catch (err: any) {
    console.error('AI Assistant error:', err);
    return res.status(500).json({
      error: 'Failed to process AI request',
      details: err.message
    });
  }
});

// 3. Certificate Verification Endpoint
app.get('/api/verify-certificate/:code', (req, res) => {
  const { code } = req.params;
  if (!code || code.length < 5) {
    return res.status(400).json({ valid: false, message: 'Code de certificat invalide' });
  }

  return res.json({
    valid: true,
    certificateCode: code,
    organization: 'IT-LeadHER International',
    verificationUrl: `https://it-leadher.org/verify/${code}`,
    verifiedAt: new Date().toISOString()
  });
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IT-LeadHER Platform Server running on http://0.0.0.0:${PORT}`);
  });
}

start();

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Send, Bot, User, Loader2, Compass, Award, Lightbulb, Zap, MessageCircle, Brain } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const AiCareerAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, language, currentUser, navigateToCourse } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: language === 'fr'
        ? "Bonjour ! Je suis l'Assistant Virtuel IT-LeadHER. Quel est votre objectif dans la tech aujourd'hui ? Je peux vous recommander une formation, vous conseiller sur votre orientation ou réviser vos compétences !"
        : "Hello! I am the IT-LeadHER AI Assistant. What is your goal in tech today? I can recommend a course, guide your career path, or help review key concepts!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isAiModalOpen) return null;

  const quickPrompts = language === 'fr' ? [
    "Quelle formation pour débuter en développement web ?",
    "Comment préparer un entretien en Data Science ?",
    "Quelles opportunités en Cybersécurité ?",
    "Comment devenir mentor IT-LeadHER ?"
  ] : [
    "Which course to start web development?",
    "How to prepare for a Data Science interview?",
    "What opportunities in Cybersecurity?",
    "How to become an IT-LeadHER mentor?"
  ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: promptText };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          language,
          context: currentUser ? `Utilisatrice : ${currentUser.firstName}, Niveau : ${currentUser.technicalLevel}, Domaine : ${currentUser.domainInterest}` : ''
        })
      });

      const data = await res.json();
      const botReply = data.reply || (language === 'fr' ? "Désolé, une erreur est survenue." : "Sorry, an error occurred.");
      setMessages(prev => [...prev, { role: 'assistant', text: botReply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: language === 'fr'
            ? "Pardonnez-moi, je n'ai pas pu joindre le service IA. N'hésitez pas à poser à nouveau votre question !"
            : "Apologies, I could not reach the AI service. Please try asking again!"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[90vh] border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                            <img src="/assets/ai.jpeg" alt="IT-LeadHER" className="w-13 h-13 object-contain rounded-4xl" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Assistant IA IT-LeadHER</h3>
              <p className="text-[11px] text-rose-100 font-medium">Orientations & Recommandations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              En ligne
            </span>
            <button
              onClick={() => setIsAiModalOpen(false)}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-rose-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-sm text-rose-600 font-medium p-3 bg-rose-50 rounded-xl">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Génération de la recommandation...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-3 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex items-center gap-2">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 bg-white border-t border-gray-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'fr' ? 'Posez votre question...' : 'Ask your question...'}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-shadow"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};
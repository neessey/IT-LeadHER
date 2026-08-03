import React from 'react';
import { useApp } from '../../context/AppContext';

export const FloatingAiButton: React.FC = () => {
  const { setIsAiModalOpen, isAiModalOpen } = useApp();

  if (isAiModalOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="group relative w-16 h-16 rounded-full overflow-hidden shadow-2xl hover:shadow-rose-500/30 hover:scale-105 transition-all duration-300 cursor-pointer active:scale-95 border-2 border-white/30 hover:border-white/50"
        title="Ouvrir l'Assistant IA"
      >
        {/* Image de profil */}
        <img
          src="/assets/ai.jpeg"
          alt="Assistant IA"
          className="w-full h-full object-cover rounded-full"
        />

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold bg-black/30 px-2 py-1 rounded-full">
           Assistant 
          </span>
        </div>
      </button> {/* Indicateur en ligne */}
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
    </div>
  );
};
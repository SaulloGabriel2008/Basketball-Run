import React from 'react';
import { useGameStore } from '../store/gameStore';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const EventModal: React.FC = () => {
  const { activeEvent, handleEventDecision } = useGameStore();

  if (!activeEvent) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#13171f] border-2 border-amber-500/70 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
          <AlertCircle className="w-4 h-4" />
          Dilema de Carreira & Decisão em Balneário
        </div>

        <div>
          <h2 className="text-2xl font-condensed font-black uppercase text-white tracking-wide">
            {activeEvent.title}
          </h2>
          <p className="text-sm text-[#8a96a8] leading-relaxed mt-2">
            {activeEvent.description}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {activeEvent.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => handleEventDecision(choice.id)}
              className="w-full text-left p-3.5 rounded-xl bg-[#0a0c0f] hover:bg-[#1c222e] border border-[#2b3345] hover:border-team-primary transition-all group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-condensed font-bold text-sm text-white group-hover:text-team-primary transition-colors">
                  {choice.text}
                </span>
                <ArrowRight className="w-4 h-4 text-[#8a96a8] group-hover:text-team-primary shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-1">
                Consequência: {choice.impactDescription}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

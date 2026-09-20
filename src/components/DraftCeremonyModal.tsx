import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById, NBA_TEAMS } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { Sparkles, FileText, ArrowRight } from 'lucide-react';

export const DraftCeremonyModal: React.FC = () => {
  const { 
    player, 
    draftProjectedPick, 
    draftLotteryResults, 
    completeDraftSelection 
  } = useGameStore();

  if (!player) return null;

  const pick = draftProjectedPick || 1;
  const isFirstRound = pick <= 30;

  // Franquia que selecionou
  let draftingTeamId = 'bos-celtics';
  if (draftLotteryResults && pick <= draftLotteryResults.length) {
    draftingTeamId = draftLotteryResults[pick - 1].teamId;
  } else {
    draftingTeamId = NBA_TEAMS[(pick - 1) % NBA_TEAMS.length].id;
  }

  const draftingTeam = getTeamById(draftingTeamId) || NBA_TEAMS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#13171f] border-2 border-team-primary rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo da franquia */}
        <div 
          className="absolute -right-24 -top-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: draftingTeam.colors.primary }}
        />

        <div className="relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Barclays Center, Nova York — NBA Draft
          </div>

          <div>
            <span className="text-xs font-mono text-[#8a96a8] uppercase">Com a escolha #{pick} do NBA Draft</span>
            <h1 className="text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide mt-1">
              {draftingTeam.name} seleciona
            </h1>
            <div className="text-4xl md:text-5xl font-condensed font-black uppercase text-team-primary tracking-tight mt-2">
              {player.fullName}
            </div>
            <div className="text-sm font-mono text-[#8a96a8] mt-1">
              {player.position} · {player.heightInches}" · {player.overall} OVR · {player.collegeTeamId}
            </div>
          </div>

          {/* Insígnia da Franquia Contratante */}
          <div className="flex justify-center my-4">
            <div className="p-4 rounded-2xl bg-black/50 border-2 border-team-primary shadow-team-glow">
              <TeamLogo team={draftingTeam} size="2xl" />
            </div>
          </div>

          {/* Termos Contratuais CBA */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-xl p-4 text-left font-mono text-xs space-y-2">
            <div className="text-amber-400 font-bold uppercase flex items-center gap-1.5 border-b border-[#2b3345] pb-1.5">
              <FileText className="w-4 h-4" />
              Termos Oficiais do Acordo Coletivo (NBA CBA)
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a96a8]">Estrutura Contratual:</span>
              <span className="text-white font-bold">
                {isFirstRound ? 'Rookie Scale (2+2 anos com opções de franquia)' : 'Contrato Two-Way (NBA / G-League)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a96a8]">Garantias Iniciais:</span>
              <span className="text-emerald-400 font-bold">
                {isFirstRound ? '2 Primeiras Temporadas Totalmente Garantidas' : 'Até 50 jogos ativos na NBA'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8a96a8]">Destino Imediato:</span>
              <span className="text-white font-bold">
                {isFirstRound ? `Elenco Principal da NBA (${draftingTeam.arena})` : 'Filial de Desenvolvimento da G-League'}
              </span>
            </div>
          </div>

          {/* Botão de Confirmação */}
          <button
            onClick={completeDraftSelection}
            className="w-full py-4 px-6 rounded-xl bg-team-primary text-white font-condensed font-black uppercase tracking-wider text-lg hover:opacity-95 shadow-team-glow transition-all flex items-center justify-center gap-2"
          >
            Assinar Contrato Profissional & Iniciar Carreira na NBA
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

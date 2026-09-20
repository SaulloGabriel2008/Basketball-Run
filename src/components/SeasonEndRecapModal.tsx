import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { getTeamConferenceRank } from '../engine/playoffsEngine';
import { 
  ArrowRight, 
  GraduationCap, 
  Award, 
  Calendar,
  DollarSign,
  Trophy,
  X
} from 'lucide-react';

export const SeasonEndRecapModal: React.FC = () => {
  const { 
    player, 
    isSeasonEndModalOpen, 
    closeSeasonEndModal,
    declareForNbaDraft, 
    stayInCollegeAnotherYear,
    advanceToNextNbaSeason,
    openAwardsModal,
    openPlayoffsModal,
    openContractModal,
    awardsGala,
    playoffBracket,
    contractOffers,
    nbaStandings
  } = useGameStore();

  if (!isSeasonEndModalOpen || !player) return null;

  const currentTeam = getTeamById(player.currentTeamId);
  const s = player.seasonStats;

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const isCollege = player.currentLeague === 'NCAA';
  const earnedSalary = player.contract.salaryPerYear || 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#13171f] border-2 border-team-primary rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-6 relative animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={closeSeasonEndModal}
          className="absolute top-4 right-4 p-2 text-[#8a96a8] hover:text-white hover:bg-[#1c222e] rounded-lg transition-colors"
          title="Fechar e revisar dashboard"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Cabeçalho de Encerramento da Temporada */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-team-primary/20 text-team-primary border border-team-primary text-xs font-mono font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            Temporada {s.seasonYear} Concluída ({player.currentLeague})
          </div>
          <h1 className="text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide">
            Resumo Anual da Carreira
          </h1>
          <div className="text-xs font-mono text-[#8a96a8] flex items-center justify-center gap-2">
            <span>{player.country.flag} {player.fullName}</span>
            <span>•</span>
            <span>{currentTeam?.name}</span>
            <span>•</span>
            <span>{s.gamesPlayed} partidas disputadas</span>
          </div>
        </div>

        {/* Classificação Final na Conferência da NBA */}
        {!isCollege && (
          (() => {
            const confRank = getTeamConferenceRank(player.currentTeamId, nbaStandings);
            return (
              <div className={`p-3 rounded-xl border text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-2 ${
                confRank.madePlayoffs
                  ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-300'
                  : 'bg-red-950/30 border-red-800/50 text-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase text-white">Classificação Final:</span>
                  <span>{confRank.rank}º no {confRank.conference === 'Eastern' ? 'Leste' : 'Oeste'} ({confRank.wins}V - {confRank.losses}D)</span>
                </div>
                <span className="font-bold">
                  {confRank.madePlayoffs ? '🟢 Classificado aos Playoffs' : '🔴 Fora dos Playoffs'}
                </span>
              </div>
            );
          })()
        )}

        {/* Linha Estatística Consolidada */}
        <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-xl p-4">
          <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8] mb-2 text-center">
            Médias Finais da Temporada
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center font-mono">
            <div className="p-2 bg-[#13171f] rounded border border-[#1c222e]">
              <div className="text-[10px] text-[#8a96a8]">PPG</div>
              <div className="text-lg font-black text-amber-400">{s.pointsPerGame}</div>
            </div>
            <div className="p-2 bg-[#13171f] rounded border border-[#1c222e]">
              <div className="text-[10px] text-[#8a96a8]">RPG</div>
              <div className="text-lg font-bold text-white">{s.reboundsPerGame}</div>
            </div>
            <div className="p-2 bg-[#13171f] rounded border border-[#1c222e]">
              <div className="text-[10px] text-[#8a96a8]">APG</div>
              <div className="text-lg font-bold text-white">{s.assistsPerGame}</div>
            </div>
            <div className="p-2 bg-[#13171f] rounded border border-[#1c222e]">
              <div className="text-[10px] text-[#8a96a8]">FG%</div>
              <div className="text-sm font-bold text-white mt-1">{s.fgPct}%</div>
            </div>
            <div className="p-2 bg-[#13171f] rounded border border-[#1c222e]">
              <div className="text-[10px] text-[#8a96a8]">PER</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">{s.per}</div>
            </div>
            <div className="p-2 bg-[#13171f] rounded border border-[#1c222e]">
              <div className="text-[10px] text-[#8a96a8]">WS</div>
              <div className="text-sm font-black text-blue-400 mt-1">{s.winShares}</div>
            </div>
          </div>
        </div>

        {/* Depósito Salarial & Rendimentos Financeiros */}
        <div className="bg-[#0a0c0f] border border-emerald-500/50 rounded-xl p-4 space-y-2 font-mono text-xs shadow-team-glow">
          <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-[#2b3345] pb-1.5">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              Depósito Financeiro em Conta Bancária
            </span>
            <span>Status: Creditado ✓</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#8a96a8]">Salário Contratual Anual:</span>
            <span className="text-white font-bold">
              {earnedSalary > 0 ? `+ ${formatMoney(earnedSalary)}` : 'Bolsa de Estudos / Moradia (NCAA)'}
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-[#1c222e]">
            <span className="text-white font-bold">Saldo Bancário Atualizado:</span>
            <span className="text-emerald-400 font-black text-sm">
              {formatMoney(player.bankBalance)}
            </span>
          </div>
        </div>

        {/* Ações de Avanço da Temporada */}
        <div className="space-y-3 pt-2">
          {isCollege ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={declareForNbaDraft}
                className="w-full py-3.5 px-4 rounded-xl bg-team-primary text-white font-condensed font-black uppercase tracking-wider text-base hover:opacity-95 shadow-team-glow transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                Declarar-se para o NBA Draft!
              </button>

              <button
                type="button"
                onClick={stayInCollegeAnotherYear}
                className="w-full py-3 px-4 rounded-xl bg-[#1c222e] hover:bg-[#2b3345] text-white border border-[#2b3345] font-condensed font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Permanecer Mais 1 Ano na NCAA (Desenvolver Atributos)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {awardsGala && (
                  <button
                    type="button"
                    onClick={openAwardsModal}
                    className="py-3 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-condensed font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                  >
                    <Award className="w-4 h-4 text-amber-400" />
                    🏆 Prêmios & TOP 3
                  </button>
                )}

                {playoffBracket && (
                  <button
                    type="button"
                    onClick={openPlayoffsModal}
                    className="py-3 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 text-xs font-condensed font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                  >
                    <Trophy className="w-4 h-4 text-blue-400" />
                    🏀 Playoffs da NBA
                  </button>
                )}

                {contractOffers && contractOffers.length > 0 && (
                  <button
                    type="button"
                    onClick={openContractModal}
                    className="py-3 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-condensed font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    📝 Contratos ({contractOffers.length})
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={advanceToNextNbaSeason}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-condensed font-black uppercase tracking-wider text-base shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                Avançar para a Próxima Temporada ({s.seasonYear + 1})
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

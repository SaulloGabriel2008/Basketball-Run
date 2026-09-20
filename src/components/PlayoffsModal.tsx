import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { PlayoffMatchup } from '../types';
import { 
  Trophy, 
  Crown, 
  FastForward, 
  Play, 
  X, 
  ArrowRight
} from 'lucide-react';

export const PlayoffsModal: React.FC = () => {
  const { 
    playoffBracket, 
    isPlayoffsModalOpen, 
    closePlayoffsModal, 
    advancePlayoffs, 
    simulateEntirePlayoffs,
    player 
  } = useGameStore();

  if (!isPlayoffsModalOpen || !playoffBracket || !player) return null;

  const isCompleted = playoffBracket.isCompleted;
  const userTeamId = player.currentTeamId;
  const userTeam = getTeamById(userTeamId);
  const isUserChampion = playoffBracket.championTeamId === userTeamId;

  const championTeam = playoffBracket.championTeamId 
    ? getTeamById(playoffBracket.championTeamId) 
    : null;

  const renderSeriesCard = (matchup: PlayoffMatchup) => {
    const highTeam = getTeamById(matchup.highSeedTeamId);
    const lowTeam = getTeamById(matchup.lowSeedTeamId);
    const isUserInMatchup = matchup.highSeedTeamId === userTeamId || matchup.lowSeedTeamId === userTeamId;
    const isFinished = matchup.status === 'COMPLETED';

    return (
      <div 
        key={matchup.id} 
        className={`p-2.5 sm:p-3 rounded-xl border text-xs font-mono transition-all ${
          isUserInMatchup
            ? 'bg-team-primary/15 border-team-primary shadow-team-glow'
            : isFinished
              ? 'bg-[#0a0c0f] border-[#2b3345]'
              : 'bg-[#13171f] border-[#2b3345]'
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] text-[#8a96a8] uppercase font-condensed">
            {matchup.conference === 'Finals' ? 'Finais da NBA' : `${matchup.conference} · R${matchup.round}`}
          </span>
          {isUserInMatchup && (
            <span className="text-[10px] bg-team-primary text-team-contrast px-1.5 py-0.2 rounded font-bold">
              Seu Time
            </span>
          )}
        </div>

        {/* Time Mandante / Melhor Seed */}
        <div className={`flex items-center justify-between p-1.5 rounded ${matchup.winnerTeamId === matchup.highSeedTeamId ? 'bg-emerald-950/30 text-emerald-300 font-bold' : 'text-white'}`}>
          <div className="flex items-center gap-1.5 truncate">
            {highTeam && <TeamLogo team={highTeam} size="xs" />}
            <span className="truncate">{highTeam?.shortName || 'A Definir'}</span>
          </div>
          <span className="font-mono font-black ml-2 text-sm">{matchup.highSeedWins}</span>
        </div>

        {/* Time Visitante / Menor Seed */}
        <div className={`flex items-center justify-between p-1.5 rounded mt-0.5 ${matchup.winnerTeamId === matchup.lowSeedTeamId ? 'bg-emerald-950/30 text-emerald-300 font-bold' : 'text-white'}`}>
          <div className="flex items-center gap-1.5 truncate">
            {lowTeam && <TeamLogo team={lowTeam} size="xs" />}
            <span className="truncate">{lowTeam?.shortName || 'A Definir'}</span>
          </div>
          <span className="font-mono font-black ml-2 text-sm">{matchup.lowSeedWins}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#13171f] border-2 border-team-primary rounded-2xl max-w-5xl w-full p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-4 relative max-h-[94vh] overflow-y-auto">
        
        <button
          type="button"
          onClick={closePlayoffsModal}
          className="absolute top-4 right-4 p-2 text-[#8a96a8] hover:text-white hover:bg-[#1c222e] rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho dos Playoffs */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-team-primary/20 text-team-primary border border-team-primary text-xs font-mono font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            NBA Playoffs · Temporada {playoffBracket.seasonYear}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide">
            Caminho ao Troféu Larry O'Brien
          </h1>
          <p className="text-xs font-mono text-[#8a96a8]">
            Séries Eliminatórias em Melhor de 7 Jogos (2-2-1-1-1)
          </p>
        </div>

        {/* Banner de Celebração ou Eliminação ao Final */}
        {isCompleted && (
          <div className={`p-4 sm:p-6 rounded-2xl border text-center space-y-2 ${
            isUserChampion 
              ? 'bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-amber-400 animate-pulse' 
              : 'bg-[#0a0c0f] border-red-900/50'
          }`}>
            {isUserChampion ? (
              <>
                <div className="text-4xl">👑 🏆 🍾</div>
                <h2 className="text-2xl sm:text-3xl font-condensed font-black uppercase text-amber-400">
                  {userTeam?.name} é o Campeão da NBA de {playoffBracket.seasonYear}!
                </h2>
                <div className="text-sm font-mono text-emerald-400 font-bold">
                  Finals MVP: {playoffBracket.finalsMvpName}
                </div>
                <p className="text-xs text-white/80 max-w-lg mx-auto">
                  Você gravou seu nome na história eterna da liga e conquistou o anel de campeão da NBA!
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl">🏆</div>
                <h2 className="text-xl sm:text-2xl font-condensed font-black uppercase text-white">
                  {championTeam?.name} Campeão da NBA de {playoffBracket.seasonYear}
                </h2>
                <div className="text-xs font-mono text-amber-400">
                  Finals MVP: {playoffBracket.finalsMvpName}
                </div>
              </>
            )}
          </div>
        )}

        {/* Chaveamento Visual dos Playoffs */}
        <div className="space-y-6">
          {/* Finais da NBA (Centro / Destaque) */}
          <div className="max-w-md mx-auto">
            <div className="text-center font-condensed font-black uppercase text-amber-400 text-sm mb-1.5 flex items-center justify-center gap-1.5">
              <Crown className="w-4 h-4" /> Grande Decisão: NBA Finals
            </div>
            {renderSeriesCard(playoffBracket.nbaFinals)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#2b3345]">
            {/* Leste */}
            <div className="space-y-3">
              <h3 className="font-condensed font-black uppercase text-blue-400 text-sm flex items-center gap-1.5 border-b border-[#2b3345] pb-1">
                Conferência Leste (Eastern)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {playoffBracket.easternR1.map(renderSeriesCard)}
              </div>
            </div>

            {/* Oeste */}
            <div className="space-y-3">
              <h3 className="font-condensed font-black uppercase text-red-400 text-sm flex items-center gap-1.5 border-b border-[#2b3345] pb-1">
                Conferência Oeste (Western)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {playoffBracket.westernR1.map(renderSeriesCard)}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="pt-4 border-t border-[#2b3345] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-[#8a96a8]">
            {isCompleted ? 'Playoffs finalizados com sucesso!' : 'Avançando séries rodada a rodada...'}
          </div>

          {!isCompleted ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={advancePlayoffs}
                className="px-4 py-2.5 bg-team-primary text-team-contrast text-xs font-condensed font-black uppercase tracking-wider rounded-lg shadow-team-glow hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                Simular Próxima Rodada
              </button>

              <button
                type="button"
                onClick={simulateEntirePlayoffs}
                className="px-4 py-2.5 bg-[#1c222e] hover:bg-[#2b3345] text-amber-400 text-xs font-condensed font-bold uppercase tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center gap-1.5"
              >
                <FastForward className="w-4 h-4" />
                Simular Todos os Playoffs
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={closePlayoffsModal}
              className="px-6 py-2.5 bg-team-primary text-team-contrast text-xs font-condensed font-black uppercase tracking-wider rounded-lg shadow-team-glow hover:opacity-95 transition-all flex items-center gap-2"
            >
              Concluir Playoffs & Abrir Resumo da Temporada
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

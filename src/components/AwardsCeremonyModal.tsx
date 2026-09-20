import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { AwardType } from '../types';
import { getTeamById } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { 
  Trophy, 
  Award, 
  CheckCircle2, 
  Crown, 
  Flame, 
  Star, 
  ArrowRight,
  X
} from 'lucide-react';

export const AwardsCeremonyModal: React.FC = () => {
  const { 
    awardsGala, 
    isAwardsModalOpen, 
    closeAwardsModal, 
    revealAward, 
    player 
  } = useGameStore();

  const [selectedAwardType, setSelectedAwardType] = useState<AwardType>('MVP');
  const [activeTab, setActiveTab] = useState<'AWARDS' | 'ALL_STAR' | 'ALL_NBA'>('AWARDS');

  if (!isAwardsModalOpen || !awardsGala || !player) return null;

  const currentAward = awardsGala.awards[selectedAwardType];
  const isSuspenseActive = currentAward.userWasTop3 && !currentAward.isRevealed;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#13171f] border-2 border-amber-500/60 rounded-2xl max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-4 relative max-h-[92vh] overflow-y-auto">
        
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={closeAwardsModal}
          className="absolute top-4 right-4 p-2 text-[#8a96a8] hover:text-white hover:bg-[#1c222e] rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho da Cerimônia */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            NBA Awards Gala · Temporada {awardsGala.seasonYear}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide">
            Cerimônia Oficial de Premiações
          </h1>
          <p className="text-xs font-mono text-[#8a96a8] max-w-lg mx-auto">
            Votação consolidada de 100 jornalistas e emissoras de TV da imprensa esportiva norte-americana.
          </p>

          {/* Abas Principais */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveTab('AWARDS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'AWARDS' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-[#1c222e] text-[#8a96a8] hover:text-white'
              }`}
            >
              🏆 Prêmios Individuais
            </button>
            <button
              onClick={() => setActiveTab('ALL_STAR')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'ALL_STAR' ? 'bg-blue-600 text-white' : 'bg-[#1c222e] text-[#8a96a8] hover:text-white'
              }`}
            >
              🌟 All-Star Game
            </button>
            <button
              onClick={() => setActiveTab('ALL_NBA')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === 'ALL_NBA' ? 'bg-emerald-600 text-white' : 'bg-[#1c222e] text-[#8a96a8] hover:text-white'
              }`}
            >
              🎖️ Equipes All-NBA
            </button>
          </div>
        </div>

        {/* ---------------- ABA 1: PRÊMIOS INDIVIDUAIS COM TOP 3 & SUSPENSE ---------------- */}
        {activeTab === 'AWARDS' && (
          <div className="space-y-6">
            {/* Seletor de Categorias */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(Object.keys(awardsGala.awards) as AwardType[]).filter(t => t !== 'FINALS_MVP').map(type => {
                const award = awardsGala.awards[type];
                const isUserNominated = award.userWasTop3;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedAwardType(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-condensed font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                      selectedAwardType === type
                        ? 'bg-team-primary text-team-contrast border-white/40 shadow-team-glow'
                        : isUserNominated
                          ? 'bg-amber-950/40 text-amber-300 border-amber-600/50 hover:bg-amber-900/60'
                          : 'bg-[#0a0c0f] text-[#8a96a8] border-[#2b3345] hover:text-white'
                    }`}
                  >
                    <span>{award.emoji}</span>
                    <span>{type}</span>
                    {isUserNominated && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="Você é finalista!" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CARD DE SUSPENSE OU REVELAÇÃO DO PRÊMIO */}
            {isSuspenseActive ? (
              /* ESTADO DE SUSPENSE: ENVELOPE SELADO DE FINALISTA */
              <div className="bg-gradient-to-br from-amber-950/50 via-[#13171f] to-amber-950/30 border-2 border-dashed border-amber-400 p-6 sm:p-8 rounded-2xl text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-3xl">
                  ✉️
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
                    Confidencial · Votação Selada da NBA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-condensed font-black uppercase text-white mt-1">
                    Você é um dos 3 Finalistas do {currentAward.name}!
                  </h2>
                  <p className="text-xs font-mono text-[#8a96a8] mt-2 max-w-md mx-auto">
                    {player.fullName}, o seu desempenho espetacular nesta temporada colocou você no pódio oficial da premiação.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => revealAward(selectedAwardType)}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-condensed font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/30 transition-all flex items-center justify-center gap-2 mx-auto hover:scale-105"
                >
                  <Trophy className="w-5 h-5 fill-current" />
                  Abrir Envelope e Revelar o Vencedor!
                </button>
              </div>
            ) : (
              /* PÓDIO DO TOP 3 REVELADO */
              <div className="space-y-4">
                <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-xl p-4 text-center">
                  <span className="text-xs font-mono uppercase text-[#8a96a8]">{currentAward.trophyName}</span>
                  <h3 className="text-xl font-condensed font-black uppercase text-white tracking-wide mt-0.5">
                    {currentAward.emoji} {currentAward.name}
                  </h3>
                  {currentAward.userWon && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      Parabéns! Você foi coroado o Vencedor Oficial deste Troféu! 🏆
                    </div>
                  )}
                </div>

                {/* Tabela do TOP 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentAward.top3.map((nominee, idx) => {
                    const isWinner = idx === 0;
                    const team = getTeamById(nominee.teamId);

                    return (
                      <div
                        key={nominee.playerId}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          nominee.isUser
                            ? 'bg-team-primary/15 border-team-primary shadow-team-glow'
                            : isWinner
                              ? 'bg-amber-950/20 border-amber-500/50'
                              : 'bg-[#0a0c0f] border-[#2b3345]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                              idx === 0 
                                ? 'bg-amber-500 text-black' 
                                : idx === 1 
                                  ? 'bg-slate-300 text-black' 
                                  : 'bg-amber-800 text-white'
                            }`}>
                              #{idx + 1} {idx === 0 ? 'VENCEDOR' : 'FINALISTA'}
                            </span>
                            {team && <TeamLogo team={team} size="xs" />}
                          </div>

                          <div className="font-condensed font-black text-lg text-white">
                            {nominee.playerName}
                            {nominee.isUser && <span className="text-team-primary text-xs ml-1">(Você)</span>}
                          </div>
                          <div className="text-xs font-mono text-[#8a96a8]">
                            {team?.name} ({nominee.position})
                          </div>
                          <div className="text-xs font-mono text-white/90 mt-2 font-semibold">
                            {nominee.statsSummary}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#1c222e] flex items-center justify-between text-xs font-mono">
                          <span className="text-[#8a96a8]">Votos 1º Lugar:</span>
                          <span className="font-black text-amber-400">{nominee.firstPlaceVotes} votos</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- ABA 2: ALL-STAR GAME ---------------- */}
        {activeTab === 'ALL_STAR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Leste */}
            <div className="bg-[#0a0c0f] border border-blue-900/50 rounded-xl p-4 space-y-3">
              <h3 className="font-condensed font-black uppercase text-blue-400 text-base border-b border-[#2b3345] pb-2 flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-blue-400" />
                All-Star Conferência Leste
              </h3>
              <div className="space-y-1.5">
                {awardsGala.allStarEast.map(p => (
                  <div key={p.playerId} className={`p-2 rounded flex items-center justify-between text-xs font-mono ${p.isUser ? 'bg-team-primary/20 font-bold text-team-contrast' : 'text-[#f0f3f8]'}`}>
                    <span>{p.playerName} ({p.position}) {p.isUser && '⭐ (Você)'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${p.isStarter ? 'bg-blue-950 border border-blue-700 text-blue-300 font-bold' : 'text-[#8a96a8]'}`}>
                      {p.isStarter ? 'TITULAR' : 'RESERVA'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Oeste */}
            <div className="bg-[#0a0c0f] border border-red-900/50 rounded-xl p-4 space-y-3">
              <h3 className="font-condensed font-black uppercase text-red-400 text-base border-b border-[#2b3345] pb-2 flex items-center gap-2">
                <Star className="w-4 h-4 fill-current text-red-400" />
                All-Star Conferência Oeste
              </h3>
              <div className="space-y-1.5">
                {awardsGala.allStarWest.map(p => (
                  <div key={p.playerId} className={`p-2 rounded flex items-center justify-between text-xs font-mono ${p.isUser ? 'bg-team-primary/20 font-bold text-team-contrast' : 'text-[#f0f3f8]'}`}>
                    <span>{p.playerName} ({p.position}) {p.isUser && '⭐ (Você)'}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${p.isStarter ? 'bg-red-950 border border-red-700 text-red-300 font-bold' : 'text-[#8a96a8]'}`}>
                      {p.isStarter ? 'TITULAR' : 'RESERVA'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- ABA 3: EQUIPES ALL-NBA ---------------- */}
        {activeTab === 'ALL_NBA' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1st Team */}
            <div className="bg-[#0a0c0f] border border-amber-500/40 rounded-xl p-4 space-y-2">
              <h3 className="font-condensed font-black uppercase text-amber-400 text-sm border-b border-[#2b3345] pb-1.5 flex items-center gap-1.5">
                <Crown className="w-4 h-4" /> All-NBA First Team
              </h3>
              {awardsGala.allNbaTeams.first.map(p => (
                <div key={p.playerId} className={`p-2 rounded text-xs font-mono flex items-center justify-between ${p.isUser ? 'bg-team-primary/20 text-team-contrast font-bold' : 'text-white'}`}>
                  <span>{p.playerName}</span>
                  <span className="text-[#8a96a8]">{p.position}</span>
                </div>
              ))}
            </div>

            {/* 2nd Team */}
            <div className="bg-[#0a0c0f] border border-slate-400/40 rounded-xl p-4 space-y-2">
              <h3 className="font-condensed font-black uppercase text-slate-300 text-sm border-b border-[#2b3345] pb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> All-NBA Second Team
              </h3>
              {awardsGala.allNbaTeams.second.map(p => (
                <div key={p.playerId} className={`p-2 rounded text-xs font-mono flex items-center justify-between ${p.isUser ? 'bg-team-primary/20 text-team-contrast font-bold' : 'text-white'}`}>
                  <span>{p.playerName}</span>
                  <span className="text-[#8a96a8]">{p.position}</span>
                </div>
              ))}
            </div>

            {/* 3rd Team */}
            <div className="bg-[#0a0c0f] border border-amber-800/50 rounded-xl p-4 space-y-2">
              <h3 className="font-condensed font-black uppercase text-amber-600 text-sm border-b border-[#2b3345] pb-1.5 flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> All-NBA Third Team
              </h3>
              {awardsGala.allNbaTeams.third.map(p => (
                <div key={p.playerId} className={`p-2 rounded text-xs font-mono flex items-center justify-between ${p.isUser ? 'bg-team-primary/20 text-team-contrast font-bold' : 'text-white'}`}>
                  <span>{p.playerName}</span>
                  <span className="text-[#8a96a8]">{p.position}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rodapé de Ação */}
        <div className="pt-3 border-t border-[#2b3345] flex justify-end">
          <button
            type="button"
            onClick={closeAwardsModal}
            className="px-6 py-2.5 bg-[#1c222e] hover:bg-[#2b3345] text-white font-condensed font-bold uppercase text-xs tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center gap-2"
          >
            Continuar para Pós-Temporada & Decisões
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { ContractOffer, ProjectedRole, TeamFitReport } from '../types';
import { 
  Briefcase, 
  CheckCircle, 
  X,
  Target,
  Swords,
  ShieldAlert,
  ThumbsUp
} from 'lucide-react';

export const ContractOffersModal: React.FC = () => {
  const { 
    contractOffers, 
    isContractModalOpen, 
    closeContractModal, 
    acceptContractOffer, 
    player 
  } = useGameStore();

  if (!isContractModalOpen || !contractOffers || contractOffers.length === 0 || !player) return null;

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const getRoleBadge = (role: ProjectedRole | ContractOffer['role']) => {
    switch (role) {
      case 'FRANCHISE_CORNERSTONE':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">👑 Dono da Franquia</span>;
      case 'STARTER':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">⭐ Titular Absoluto</span>;
      case 'POSITION_BATTLE':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">⚔️ Disputa por Posição</span>;
      case 'SIXTH_MAN':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-bold">⚡ Sexto Homem</span>;
      case 'ROTATION':
        return <span className="bg-slate-500/20 text-slate-300 border border-slate-500/40 px-2 py-0.5 rounded text-[10px] font-bold">🔄 Rotação Regular</span>;
      case 'BENCHWARMER':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold">🪑 Fim de Banco</span>;
    }
  };

  const getProjectBadge = (type: TeamFitReport['projectType']) => {
    switch (type) {
      case 'CONTENDER':
        return <span className="text-amber-400 font-bold">🏆 Candidato ao Título</span>;
      case 'PLAYOFFS':
        return <span className="text-sky-400 font-bold">🎯 Briga por Playoffs</span>;
      case 'REBUILD':
      case 'REBUILDING':
        return <span className="text-emerald-400 font-bold">🏗️ Reconstrução Jovem</span>;
      default:
        return <span className="text-sky-400 font-bold">🎯 Briga por Playoffs</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#13171f] border-2 border-emerald-500/60 rounded-2xl max-w-5xl w-full p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-4 relative max-h-[94vh] overflow-y-auto">
        
        <button
          type="button"
          onClick={closeContractModal}
          className="absolute top-4 right-4 p-2 text-[#8a96a8] hover:text-white hover:bg-[#1c222e] rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho da Free Agency */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            Mercado da Free Agency & Decisões de Equipe da NBA
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide">
            Propostas de Contrato & Encaixe Tático
          </h1>
          <p className="text-xs font-mono text-[#8a96a8] max-w-xl mx-auto">
            Avalie o papel projetado, concorrência no elenco, pretensões da franquia e salário antes de assinar o seu contrato.
          </p>
        </div>

        {/* Grid de Propostas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contractOffers.map(offer => {
            const team = getTeamById(offer.teamId);
            const isCurrentTeam = offer.isExtension;
            const fit = offer.teamFit;

            return (
              <div
                key={offer.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrentTeam
                    ? 'bg-gradient-to-br from-team-primary/20 via-[#0a0c0f] to-team-primary/10 border-team-primary shadow-team-glow'
                    : 'bg-[#0a0c0f] border-[#2b3345] hover:border-emerald-500/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Topo da Proposta */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {team && <TeamLogo team={team} size="md" />}
                      <div>
                        <div className="font-condensed font-black text-xl text-white flex items-center gap-2">
                          {offer.teamName}
                        </div>
                        <div className="text-xs font-mono text-[#8a96a8] flex items-center gap-2 flex-wrap">
                          <span>Prestígio: {offer.teamPrestige}</span>
                          {fit && (
                            <>
                              <span>•</span>
                              {getProjectBadge(fit.projectType)}
                            </>
                          )}
                          {isCurrentTeam && (
                            <span className="text-team-primary font-bold">• Equipe Atual</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {getRoleBadge(fit ? fit.expectedRole : offer.role)}
                  </div>

                  {/* Detalhes Financeiros */}
                  <div className="grid grid-cols-2 gap-2 bg-[#13171f] p-3 rounded-xl border border-[#2b3345] font-mono text-xs">
                    <div>
                      <span className="text-[#8a96a8] text-[10px] uppercase block">Salário Anual:</span>
                      <div className="text-emerald-400 font-black text-lg">{formatMoney(offer.salaryPerYear)}</div>
                    </div>
                    <div>
                      <span className="text-[#8a96a8] text-[10px] uppercase block">Duração:</span>
                      <div className="text-white font-black text-lg">{offer.yearsTotal} {offer.yearsTotal === 1 ? 'Temporada' : 'Temporadas'}</div>
                    </div>
                  </div>

                  {/* Encaixe Tático & Concorrência */}
                  {fit && (
                    <div className="bg-[#13171f]/80 p-3.5 rounded-xl border border-[#2b3345] space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#8a96a8] flex items-center gap-1.5 font-bold uppercase text-[10px]">
                          <Target className="w-3.5 h-3.5 text-amber-400" />
                          Encaixe Tático na Equipe:
                        </span>
                        <span className="text-amber-400 font-bold tracking-wider">
                          {'★'.repeat(fit.fitStars)}{'☆'.repeat(5 - fit.fitStars)} ({fit.fitStars}/5)
                        </span>
                      </div>

                      {/* Concorrente direto */}
                      {fit.directRivalName && (
                        <div className="flex items-center gap-2 text-xs bg-[#0a0c0f] px-2.5 py-1.5 rounded-lg border border-[#2b3345] text-[#8a96a8]">
                          <Swords className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>
                            Concorrente Direto: <strong className="text-white">{fit.directRivalName}</strong> ({fit.directRivalOvr} OVR - {fit.directRivalPosition})
                          </span>
                        </div>
                      )}

                      {/* Veredito com semáforo (Verde se vale a pena / Vermelho se arriscado) */}
                      <div
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                          fit.isWorthIt
                            ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                            : 'bg-red-950/25 border-red-500/40 text-red-300'
                        }`}
                      >
                        {fit.isWorthIt ? (
                          <ThumbsUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold uppercase tracking-wider block text-[10px]">
                            {fit.isWorthIt ? '✅ Vale a Pena Ir:' : '⛔ Risco Elevado / Desfavorável:'}
                          </span>
                          <span className="leading-snug">{fit.verdictPtBr}</span>
                        </div>
                      </div>

                      {/* Prós e Contras */}
                      <div className="space-y-1 text-[11px]">
                        {fit.prosPtBr.slice(0, 2).map((pro, i) => (
                          <div key={i} className="text-emerald-400 flex items-center gap-1.5">
                            <span className="font-bold">+</span>
                            <span>{pro}</span>
                          </div>
                        ))}
                        {fit.consPtBr.slice(0, 2).map((con, i) => (
                          <div key={i} className="text-red-400 flex items-center gap-1.5">
                            <span className="font-bold">-</span>
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mensagem do GM */}
                  <p className="text-xs text-[#8a96a8] italic leading-relaxed bg-[#13171f]/50 p-2.5 rounded-lg border border-[#2b3345]/50">
                    "{offer.pitchMessage}"
                  </p>
                </div>

                {/* Botão de Assinar */}
                <button
                  type="button"
                  onClick={() => acceptContractOffer(offer)}
                  className={`w-full py-3 px-4 rounded-xl font-condensed font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 mt-2 ${
                    isCurrentTeam
                      ? 'bg-team-primary text-team-contrast hover:opacity-95 shadow-team-glow'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {isCurrentTeam ? 'Renovar com a Franquia Atual' : `Assinar com o ${offer.teamName}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Rodapé informativo */}
        <div className="pt-2 text-center text-[11px] font-mono text-[#8a96a8]">
          Ao assinar com uma nova equipe, a identidade visual do jogo adotará imediatamente as cores oficiais do seu novo clube.
        </div>

      </div>
    </div>
  );
};

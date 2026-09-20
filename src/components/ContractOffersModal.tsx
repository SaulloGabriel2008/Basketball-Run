import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { ContractOffer } from '../types';
import { 
  Briefcase, 
  CheckCircle, 
  X
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

  const getRoleBadge = (role: ContractOffer['role']) => {
    switch (role) {
      case 'FRANCHISE_CORNERSTONE':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">👑 Dono da Franquia</span>;
      case 'STARTER':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold">⭐ Titular Absoluto</span>;
      case 'SIXTH_MAN':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-bold">⚡ Sexto Homem</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#13171f] border-2 border-emerald-500/60 rounded-2xl max-w-4xl w-full p-4 sm:p-6 md:p-8 shadow-2xl space-y-6 my-4 relative max-h-[92vh] overflow-y-auto">
        
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
            Mercado da Free Agency & Decisões Contratuais da NBA
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide">
            Propostas de Renovação & Outras Equipes
          </h1>
          <p className="text-xs font-mono text-[#8a96a8] max-w-lg mx-auto">
            Avalie o valor anual, duração e o papel na equipe antes de assinar o seu novo vínculo profissional oficial.
          </p>
        </div>

        {/* Grid de Propostas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractOffers.map(offer => {
            const team = getTeamById(offer.teamId);
            const isCurrentTeam = offer.isExtension;

            return (
              <div
                key={offer.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrentTeam
                    ? 'bg-gradient-to-br from-team-primary/20 via-[#0a0c0f] to-team-primary/10 border-team-primary shadow-team-glow'
                    : 'bg-[#0a0c0f] border-[#2b3345] hover:border-emerald-500/50'
                }`}
              >
                <div>
                  {/* Topo da Proposta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {team && <TeamLogo team={team} size="md" />}
                      <div>
                        <div className="font-condensed font-black text-lg text-white">
                          {offer.teamName}
                        </div>
                        <div className="text-xs font-mono text-[#8a96a8] flex items-center gap-2">
                          <span>Prestígio: {offer.teamPrestige}</span>
                          {isCurrentTeam && (
                            <span className="text-team-primary font-bold">· Equipe Atual</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {getRoleBadge(offer.role)}
                  </div>

                  {/* Detalhes Financeiros */}
                  <div className="grid grid-cols-2 gap-2 bg-[#13171f] p-3 rounded-xl border border-[#2b3345] font-mono text-xs mb-3">
                    <div>
                      <span className="text-[#8a96a8] text-[10px] uppercase">Salário Anual:</span>
                      <div className="text-emerald-400 font-black text-base">{formatMoney(offer.salaryPerYear)}</div>
                    </div>
                    <div>
                      <span className="text-[#8a96a8] text-[10px] uppercase">Duração Total:</span>
                      <div className="text-white font-black text-base">{offer.yearsTotal} Anos</div>
                    </div>
                  </div>

                  {/* Mensagem do GM */}
                  <p className="text-xs text-[#8a96a8] italic leading-relaxed bg-[#13171f]/50 p-2.5 rounded-lg border border-[#2b3345]/50">
                    "{offer.pitchMessage}"
                  </p>
                </div>

                {/* Botão de Assinar */}
                <button
                  type="button"
                  onClick={() => acceptContractOffer(offer)}
                  className={`w-full py-3 px-4 rounded-xl font-condensed font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 ${
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

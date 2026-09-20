import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { NBA_TEAMS, G_LEAGUE_TEAMS, NCAA_TEAMS } from '../data/teamsRepository';
import { OFFICIAL_LOTTERY_SEEDS } from '../engine/draftLottery';
import { TeamLogo } from './TeamLogo';
import { LeagueId } from '../types';
import { Dices } from 'lucide-react';

export const StandingsScreen: React.FC = () => {
  const { player } = useGameStore();
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>(player?.currentLeague || 'NBA');
  const [activeTab, setActiveTab] = useState<'STANDINGS' | 'LOTTERY_ODDS'>('STANDINGS');

  const teams = selectedLeague === 'NBA' ? NBA_TEAMS : selectedLeague === 'G_LEAGUE' ? G_LEAGUE_TEAMS : NCAA_TEAMS;

  // Separa conferências para NBA
  const eastTeams = teams.filter(t => t.conference === 'Eastern' || t.conference === 'ACC' || t.conference === 'Big East');
  const westTeams = teams.filter(t => t.conference === 'Western' || t.conference === 'Big Ten' || t.conference === 'Big 12' || t.conference === 'SEC' || t.conference === 'WCC');

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#13171f] border border-[#2b3345] rounded-xl p-6 shadow-2xl">
        <div>
          <div className="text-xs font-mono text-[#8a96a8] uppercase">Central de Inteligência da Liga</div>
          <h1 className="text-3xl font-condensed font-black uppercase text-white tracking-wide">
            Classificação & Estatísticas Coletivas
          </h1>
        </div>

        {/* Seletor de Liga e Abas */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-[#0a0c0f] p-1 rounded-lg border border-[#2b3345]">
            {(['NBA', 'G_LEAGUE', 'NCAA'] as LeagueId[]).map(l => (
              <button
                key={l}
                onClick={() => setSelectedLeague(l)}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  selectedLeague === l ? 'bg-team-primary text-white font-bold' : 'text-[#8a96a8] hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {selectedLeague === 'NBA' && (
            <div className="flex items-center gap-1 bg-[#0a0c0f] p-1 rounded-lg border border-[#2b3345]">
              <button
                onClick={() => setActiveTab('STANDINGS')}
                className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                  activeTab === 'STANDINGS' ? 'bg-[#1c222e] text-white font-bold' : 'text-[#8a96a8] hover:text-white'
                }`}
              >
                Classificação
              </button>
              <button
                onClick={() => setActiveTab('LOTTERY_ODDS')}
                className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1 ${
                  activeTab === 'LOTTERY_ODDS' ? 'bg-amber-600 text-white font-bold' : 'text-[#8a96a8] hover:text-white'
                }`}
              >
                <Dices className="w-3.5 h-3.5" />
                Odds do Draft
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === 'STANDINGS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conferência 1 */}
          <StandingsTable 
            title={selectedLeague === 'NBA' ? 'Conferência Leste (Eastern)' : 'Bloco Regional A'} 
            teams={eastTeams} 
            userTeamId={player?.currentTeamId}
          />

          {/* Conferência 2 */}
          <StandingsTable 
            title={selectedLeague === 'NBA' ? 'Conferência Oeste (Western)' : 'Bloco Regional B'} 
            teams={westTeams} 
            userTeamId={player?.currentTeamId}
          />
        </div>
      ) : (
        /* Probabilidades Oficiais da Loteria do NBA Draft */
        <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2b3345] pb-4">
            <div>
              <h2 className="text-xl font-condensed font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Dices className="w-5 h-5 text-amber-400" />
                Tabela Oficial de Probabilidades da Loteria do NBA Draft
              </h2>
              <p className="text-xs text-[#8a96a8] mt-0.5">
                Distribuição matemática oficial das 1.000 combinações entre as 14 franquias fora dos playoffs.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="data-table-header text-[#8a96a8] py-2 border-b border-[#2b3345]">
                  <th className="text-left py-2 px-3">Posição Inversa</th>
                  <th className="text-left py-2 px-3">Franquia Projetada</th>
                  <th className="text-right py-2 px-3">Combinações</th>
                  <th className="text-right py-2 px-3 font-bold text-amber-400">Escolha #1 (%)</th>
                  <th className="text-right py-2 px-3 font-bold text-white">Top 4 (%)</th>
                  <th className="text-right py-2 px-3 text-[#8a96a8]">Pior Escolha</th>
                </tr>
              </thead>
              <tbody>
                {OFFICIAL_LOTTERY_SEEDS.map((seed, idx) => {
                  const projectedTeam = NBA_TEAMS[29 - idx];
                  return (
                    <tr key={seed.seed} className="border-b border-[#1c222e] hover:bg-[#1c222e]/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-white">#{seed.seed} Pior Registro</td>
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        {projectedTeam && <TeamLogo team={projectedTeam} size="xs" />}
                        <span className="font-bold text-white">{projectedTeam?.name}</span>
                      </td>
                      <td className="text-right py-2.5 px-3 text-[#8a96a8]">{seed.combinations}</td>
                      <td className="text-right py-2.5 px-3 font-black text-amber-400 text-sm">{seed.pick1Pct}%</td>
                      <td className="text-right py-2.5 px-3 font-bold text-emerald-400">{seed.top4Pct}%</td>
                      <td className="text-right py-2.5 px-3 text-[#8a96a8]">#{seed.worstPick}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

interface StandingsTableProps {
  title: string;
  teams: typeof NBA_TEAMS;
  userTeamId?: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ title, teams, userTeamId }) => {
  return (
    <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl overflow-x-auto">
      <h3 className="text-sm font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 mb-3">
        {title}
      </h3>

      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-[#8a96a8] border-b border-[#2b3345]">
            <th className="text-left py-2 px-2">#</th>
            <th className="text-left py-2 px-2">Equipe</th>
            <th className="text-right py-2 px-2">V</th>
            <th className="text-right py-2 px-2">D</th>
            <th className="text-right py-2 px-2 font-bold text-white">%VIT</th>
            <th className="text-right py-2 px-2">Divisão</th>
            <th className="text-right py-2 px-2">Prestígio</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => {
            const isUser = team.id === userTeamId;
            // Cálculo mock consistente de classificação baseado no prestígio
            const simulatedWins = Math.round((team.prestige / 100) * 55 + (idx % 3) * 2);
            const simulatedLosses = 82 - simulatedWins;
            const pct = (simulatedWins / 82).toFixed(3);

            return (
              <tr 
                key={team.id}
                className={`border-b border-[#1c222e] hover:bg-[#1c222e]/60 transition-colors ${
                  isUser ? 'bg-team-primary/15 font-bold text-team-contrast' : 'text-[#f0f3f8]'
                }`}
              >
                <td className="py-2 px-2 text-[#8a96a8]">{idx + 1}</td>
                <td className="py-2 px-2 flex items-center gap-2">
                  <TeamLogo team={team} size="xs" />
                  <span className="font-bold">{team.name}</span>
                </td>
                <td className="text-right py-2 px-2 text-emerald-400 font-bold">{simulatedWins}</td>
                <td className="text-right py-2 px-2 text-red-400 font-bold">{simulatedLosses}</td>
                <td className="text-right py-2 px-2 font-bold text-white">{pct}</td>
                <td className="text-right py-2 px-2 text-[#8a96a8]">{team.division || team.conference}</td>
                <td className="text-right py-2 px-2 text-amber-400 font-bold">{team.prestige}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

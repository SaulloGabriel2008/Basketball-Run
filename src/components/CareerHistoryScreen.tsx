import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { calculateHallOfFameProbability } from '../engine/hallOfFame';
import { 
  Trophy, 
  Award, 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  History
} from 'lucide-react';

type StatsViewMode = 'PER_GAME' | 'TOTALS' | 'ADVANCED';

export const CareerHistoryScreen: React.FC = () => {
  const { player } = useGameStore();
  const [viewMode, setViewMode] = useState<StatsViewMode>('PER_GAME');

  if (!player) return null;

  // Junta o histórico anterior com a temporada ativa atual
  const allSeasons = [...player.careerStats, player.seasonStats];

  const peakWS = Math.max(0, ...allSeasons.map(s => s.winShares));
  const hofCalc = calculateHallOfFameProbability({
    heightInches: player.heightInches,
    championships: player.careerRecord.championships,
    leaderboardPts: player.careerRecord.leaderboardPoints,
    peakWS,
    allStarSelections: player.careerRecord.allStarSelections,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Cabeçalho da Carreira */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#13171f] border border-[#2b3345] rounded-xl p-6 shadow-2xl">
        <div>
          <div className="text-xs font-mono text-[#8a96a8] uppercase">Arquivo Oficial Longitudinal</div>
          <h1 className="text-3xl md:text-4xl font-condensed font-black uppercase text-white tracking-wide">
            {player.fullName} — Histórico de Carreira
          </h1>
          <div className="text-xs font-mono text-[#8a96a8] mt-1">
            {allSeasons.length} temporadas registradas · {player.careerRecord.championships}x Campeão · {player.careerRecord.allStarSelections}x All-Star
          </div>
        </div>

        {/* Medidor de Hall da Fama */}
        <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-xl p-4 text-right min-w-[200px]">
          <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8] flex items-center justify-end gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Probabilidade Hall of Fame
          </div>
          <div className="text-3xl font-mono font-black text-amber-400 mt-0.5">
            {hofCalc.probability}%
          </div>
          <div className="text-[10px] font-mono text-[#8a96a8]">
            {hofCalc.isInducted ? '✓ Elegível para Consagração' : 'Abaixo do corte (50%)'}
          </div>
        </div>
      </div>

      {/* Sala de Troféus Gráfica */}
      <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-3 mb-5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Sala de Troféus & Distinções Oficiais
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          {/* Anéis de Campeão */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-4 rounded-xl hover:border-amber-400/50 transition-colors">
            <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.championships}</div>
            <div className="text-xs font-condensed uppercase text-[#8a96a8] mt-0.5 font-bold">Anéis da NBA</div>
          </div>

          {/* MVP da Temporada */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-4 rounded-xl hover:border-amber-400/50 transition-colors">
            <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.mvps}</div>
            <div className="text-xs font-condensed uppercase text-[#8a96a8] mt-0.5 font-bold">Prêmios MVP</div>
          </div>

          {/* MVP das Finais */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-4 rounded-xl hover:border-amber-400/50 transition-colors">
            <Trophy className="w-8 h-8 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.finalsMvps}</div>
            <div className="text-xs font-condensed uppercase text-[#8a96a8] mt-0.5 font-bold">Finals MVP</div>
          </div>

          {/* Melhor Defensor DPOY */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-4 rounded-xl hover:border-emerald-400/50 transition-colors">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.dpoyAwards}</div>
            <div className="text-xs font-condensed uppercase text-[#8a96a8] mt-0.5 font-bold">DPOY Defensor</div>
          </div>

          {/* All-Star Selections */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-4 rounded-xl hover:border-blue-400/50 transition-colors">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.allStarSelections}</div>
            <div className="text-xs font-condensed uppercase text-[#8a96a8] mt-0.5 font-bold">All-Star Game</div>
          </div>

          {/* Cestinha da NBA */}
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-4 rounded-xl hover:border-rose-400/50 transition-colors">
            <Flame className="w-8 h-8 text-rose-400 mx-auto mb-2" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.scoringTitles}</div>
            <div className="text-xs font-condensed uppercase text-[#8a96a8] mt-0.5 font-bold">Cestinha Scoring</div>
          </div>
        </div>
      </div>

      {/* Tabela Longitudinal Ano a Ano */}
      <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#2b3345] pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-team-primary" />
            <h2 className="text-xl font-condensed font-bold uppercase tracking-wider text-white">
              Tabela Histórica Consolidada
            </h2>
          </div>

          {/* Seletor de Modo de Visualização */}
          <div className="flex items-center gap-1 bg-[#0a0c0f] p-1 rounded-lg border border-[#2b3345]">
            <button
              onClick={() => setViewMode('PER_GAME')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                viewMode === 'PER_GAME' ? 'bg-team-primary text-white font-bold' : 'text-[#8a96a8] hover:text-white'
              }`}
            >
              Médias por Jogo
            </button>
            <button
              onClick={() => setViewMode('TOTALS')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                viewMode === 'TOTALS' ? 'bg-team-primary text-white font-bold' : 'text-[#8a96a8] hover:text-white'
              }`}
            >
              Totais da Temporada
            </button>
            <button
              onClick={() => setViewMode('ADVANCED')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                viewMode === 'ADVANCED' ? 'bg-team-primary text-white font-bold' : 'text-[#8a96a8] hover:text-white'
              }`}
            >
              Métricas Avançadas
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="data-table-header text-[#8a96a8] py-2">
                <th className="text-left py-2 px-3">Ano</th>
                <th className="text-left py-2 px-3">Liga</th>
                <th className="text-left py-2 px-3">Equipe</th>
                <th className="text-right py-2 px-2">J</th>
                <th className="text-right py-2 px-2">TIT</th>

                {viewMode === 'PER_GAME' && (
                  <>
                    <th className="text-right py-2 px-2">MIN</th>
                    <th className="text-right py-2 px-2 font-bold text-white">PTS</th>
                    <th className="text-right py-2 px-2">REB</th>
                    <th className="text-right py-2 px-2">AST</th>
                    <th className="text-right py-2 px-2">STL</th>
                    <th className="text-right py-2 px-2">BLK</th>
                    <th className="text-right py-2 px-2">FG%</th>
                    <th className="text-right py-2 px-2">3P%</th>
                    <th className="text-right py-2 px-2">FT%</th>
                  </>
                )}

                {viewMode === 'TOTALS' && (
                  <>
                    <th className="text-right py-2 px-2">MIN</th>
                    <th className="text-right py-2 px-2 font-bold text-white">PTS</th>
                    <th className="text-right py-2 px-2">FGM-A</th>
                    <th className="text-right py-2 px-2">3PM-A</th>
                    <th className="text-right py-2 px-2">FTM-A</th>
                    <th className="text-right py-2 px-2">REB</th>
                    <th className="text-right py-2 px-2">AST</th>
                    <th className="text-right py-2 px-2">STL</th>
                    <th className="text-right py-2 px-2">BLK</th>
                  </>
                )}

                {viewMode === 'ADVANCED' && (
                  <>
                    <th className="text-right py-2 px-2">TS%</th>
                    <th className="text-right py-2 px-2">eFG%</th>
                    <th className="text-right py-2 px-2">USG%</th>
                    <th className="text-right py-2 px-2 font-bold text-white">PER</th>
                    <th className="text-right py-2 px-2">OWS</th>
                    <th className="text-right py-2 px-2">DWS</th>
                    <th className="text-right py-2 px-2 font-bold text-blue-400">WS</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {allSeasons.map((season, idx) => {
                const team = getTeamById(season.teamId);
                const isCurrent = idx === allSeasons.length - 1;

                return (
                  <tr 
                    key={idx} 
                    className={`border-b border-[#1c222e] hover:bg-[#1c222e]/60 transition-colors ${
                      isCurrent ? 'bg-team-primary/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white">
                      {season.seasonYear} {isCurrent && <span className="text-[10px] text-team-primary ml-1">(Atual)</span>}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-[#0a0c0f] text-[#8a96a8] border border-[#2b3345]">
                        {season.league}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white font-bold">{team?.shortName || season.teamId}</td>
                    <td className="text-right py-2.5 px-2">{season.gamesPlayed}</td>
                    <td className="text-right py-2.5 px-2 text-[#8a96a8]">{season.gamesStarted}</td>

                    {viewMode === 'PER_GAME' && (
                      <>
                        <td className="text-right py-2.5 px-2 text-[#8a96a8]">{season.minutesPerGame}</td>
                        <td className="text-right py-2.5 px-2 font-black text-amber-400">{season.pointsPerGame}</td>
                        <td className="text-right py-2.5 px-2">{season.reboundsPerGame}</td>
                        <td className="text-right py-2.5 px-2">{season.assistsPerGame}</td>
                        <td className="text-right py-2.5 px-2">{season.stealsPerGame}</td>
                        <td className="text-right py-2.5 px-2">{season.blocksPerGame}</td>
                        <td className="text-right py-2.5 px-2">{season.fgPct}%</td>
                        <td className="text-right py-2.5 px-2">{season.fg3Pct}%</td>
                        <td className="text-right py-2.5 px-2">{season.ftPct}%</td>
                      </>
                    )}

                    {viewMode === 'TOTALS' && (
                      <>
                        <td className="text-right py-2.5 px-2 text-[#8a96a8]">{season.totalMinutes}</td>
                        <td className="text-right py-2.5 px-2 font-black text-amber-400">{season.totalPoints}</td>
                        <td className="text-right py-2.5 px-2">{season.totalFgm}/{season.totalFga}</td>
                        <td className="text-right py-2.5 px-2">{season.totalFg3m}/{season.totalFg3a}</td>
                        <td className="text-right py-2.5 px-2">{season.totalFtm}/{season.totalFta}</td>
                        <td className="text-right py-2.5 px-2">{season.totalReb}</td>
                        <td className="text-right py-2.5 px-2">{season.totalAst}</td>
                        <td className="text-right py-2.5 px-2">{season.totalStl}</td>
                        <td className="text-right py-2.5 px-2">{season.totalBlk}</td>
                      </>
                    )}

                    {viewMode === 'ADVANCED' && (
                      <>
                        <td className="text-right py-2.5 px-2 text-amber-400 font-bold">{season.tsPct}%</td>
                        <td className="text-right py-2.5 px-2">{season.efgPct}%</td>
                        <td className="text-right py-2.5 px-2">{season.usgPct}%</td>
                        <td className="text-right py-2.5 px-2 font-bold text-emerald-400">{season.per}</td>
                        <td className="text-right py-2.5 px-2">{season.ows}</td>
                        <td className="text-right py-2.5 px-2">{season.dws}</td>
                        <td className="text-right py-2.5 px-2 font-black text-blue-400">{season.winShares}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

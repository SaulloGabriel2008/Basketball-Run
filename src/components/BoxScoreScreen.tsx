import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { Calendar, User } from 'lucide-react';
import { PlayerGameStats } from '../types';

export const BoxScoreScreen: React.FC = () => {
  const { selectedBoxScore, recentGames, player } = useGameStore();

  const box = selectedBoxScore || recentGames[0];

  if (!box) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Calendar className="w-12 h-12 text-[#8a96a8] mx-auto mb-3" />
        <h2 className="text-xl font-condensed font-bold uppercase text-white">Nenhuma Partida Disputada Ainda</h2>
        <p className="text-xs font-mono text-[#8a96a8] mt-1">
          Retorne ao painel central e simule a primeira partida da sua carreira.
        </p>
      </div>
    );
  }

  const homeTeam = getTeamById(box.homeTeamId);
  const awayTeam = getTeamById(box.awayTeamId);

  const homeStats = box.playerStats.filter(p => p.teamId === box.homeTeamId);
  const awayStats = box.playerStats.filter(p => p.teamId === box.awayTeamId);

  const userGame = box.userPlayerGame;
  const userTeamId = userGame?.teamId || player?.currentTeamId;
  const isUserHome = box.homeTeamId === userTeamId;
  const isUserAway = box.awayTeamId === userTeamId;
  const userTeamScore = isUserHome ? box.homeScore : isUserAway ? box.awayScore : null;
  const oppScore = isUserHome ? box.awayScore : isUserAway ? box.homeScore : null;
  const isLoss = userTeamScore !== null && oppScore !== null && userTeamScore < oppScore;
  const isWin = userTeamScore !== null && oppScore !== null && userTeamScore > oppScore;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Placar Principal e Parciais por Quarto */}
      <div className={`bg-[#13171f] rounded-xl p-6 shadow-2xl border ${isLoss ? 'border-red-900/50' : 'border-[#2b3345]'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Away Team */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="text-right">
              <div className="text-xs font-mono text-[#8a96a8] uppercase">{awayTeam?.conference}</div>
              <h2 className="text-2xl font-condensed font-black uppercase text-white tracking-wide">
                {awayTeam?.name}
              </h2>
            </div>
            {awayTeam && <TeamLogo team={awayTeam} size="lg" />}
            <span className={`text-4xl md:text-5xl font-mono font-black ml-2 ${isUserAway && isLoss ? 'text-red-400' : 'text-white'}`}>
              {box.awayScore}
            </span>
          </div>

          <div className="text-center px-4 shrink-0 space-y-1">
            {isLoss ? (
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-800 font-bold">
                Derrota
              </span>
            ) : isWin ? (
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800 font-bold">
                Vitória
              </span>
            ) : (
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-amber-400 bg-[#1c222e] px-3 py-1 rounded-full border border-[#2b3345]">
                Final
              </span>
            )}
            <div className="text-[11px] font-mono text-[#8a96a8] mt-1">{box.date}</div>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-4 flex-1 justify-start">
            <span className={`text-4xl md:text-5xl font-mono font-black mr-2 ${isUserHome && isLoss ? 'text-red-400' : 'text-white'}`}>
              {box.homeScore}
            </span>
            {homeTeam && <TeamLogo team={homeTeam} size="lg" />}
            <div className="text-left">
              <div className="text-xs font-mono text-[#8a96a8] uppercase">{homeTeam?.conference}</div>
              <h2 className="text-2xl font-condensed font-black uppercase text-white tracking-wide">
                {homeTeam?.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Tabela de Pontuação por Quarto (Q1 a Q4 + OT) */}
        <div className="mt-6 pt-6 border-t border-[#2b3345] overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-[#8a96a8] border-b border-[#2b3345]">
                <th className="text-left py-1.5 px-3">Equipe</th>
                <th className="py-1.5 px-3 text-center">Q1</th>
                <th className="py-1.5 px-3 text-center">Q2</th>
                <th className="py-1.5 px-3 text-center">Q3</th>
                <th className="py-1.5 px-3 text-center">Q4</th>
                {box.homePeriods.ot && <th className="py-1.5 px-3 text-center text-amber-400">OT</th>}
                <th className="py-1.5 px-3 text-right font-bold text-white">T</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#1c222e]">
                <td className="py-2 px-3 text-white font-bold">{awayTeam?.shortName}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.awayPeriods.q1}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.awayPeriods.q2}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.awayPeriods.q3}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.awayPeriods.q4}</td>
                {box.awayPeriods.ot && (
                  <td className="py-2 px-3 text-center text-amber-400">{box.awayPeriods.ot[0]}</td>
                )}
                <td className="py-2 px-3 text-right font-bold text-white text-sm">{box.awayScore}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-white font-bold">{homeTeam?.shortName}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.homePeriods.q1}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.homePeriods.q2}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.homePeriods.q3}</td>
                <td className="py-2 px-3 text-center text-[#8a96a8]">{box.homePeriods.q4}</td>
                {box.homePeriods.ot && (
                  <td className="py-2 px-3 text-center text-amber-400">{box.homePeriods.ot[0]}</td>
                )}
                <td className="py-2 px-3 text-right font-bold text-white text-sm">{box.homeScore}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Destaque Individual do Atleta Criado */}
      {userGame && (
        <div className="bg-[#13171f] border border-team-primary rounded-xl p-5 shadow-team-glow">
          <div className="flex items-center justify-between mb-3 border-b border-[#2b3345] pb-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-team-primary" />
              <span className="font-condensed font-black uppercase text-sm tracking-wider text-white">
                Desempenho Individual: {userGame.playerName}
              </span>
            </div>
            <div className="text-xs font-mono text-[#8a96a8]">
              Índice Mais/Menos: <span className={`font-bold ${userGame.plusMinus > 0 ? 'text-emerald-400' : userGame.plusMinus < 0 ? 'text-red-400' : 'text-white'}`}>
                {userGame.plusMinus > 0 ? `+${userGame.plusMinus}` : userGame.plusMinus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-2 text-center font-mono">
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">MIN</div>
              <div className="text-base font-bold text-white">{userGame.minutes}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">PTS</div>
              <div className="text-base font-black text-amber-400">{userGame.points}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">FG</div>
              <div className="text-xs font-bold text-white mt-1">{userGame.fgm}/{userGame.fga}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">3PT</div>
              <div className="text-xs font-bold text-white mt-1">{userGame.fg3m}/{userGame.fg3a}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">FT</div>
              <div className="text-xs font-bold text-white mt-1">{userGame.ftm}/{userGame.fta}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">REB</div>
              <div className="text-base font-bold text-white">{userGame.reb}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">AST</div>
              <div className="text-base font-bold text-white">{userGame.ast}</div>
            </div>
            <div className="bg-[#0a0c0f] p-2 rounded border border-[#2b3345]">
              <div className="text-[10px] text-[#8a96a8]">STL/BLK</div>
              <div className="text-xs font-bold text-white mt-1">{userGame.stl}/{userGame.blk}</div>
            </div>
            <div className="bg-red-950/20 p-2 rounded border border-red-900/40">
              <div className="text-[10px] text-red-400 font-bold">TOV / PF</div>
              <div className="text-xs font-bold text-red-400 mt-1">{userGame.tov} / {userGame.pf}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabelas de Box Score por Equipe */}
      <div className="grid grid-cols-1 gap-6">
        <TeamBoxScoreTable teamName={awayTeam?.name || 'Equipe Visitante'} stats={awayStats} userPlayerId={player?.id} />
        <TeamBoxScoreTable teamName={homeTeam?.name || 'Equipe Mandante'} stats={homeStats} userPlayerId={player?.id} />
      </div>
    </div>
  );
};

interface TeamBoxScoreTableProps {
  teamName: string;
  stats: PlayerGameStats[];
  userPlayerId?: string;
}

const TeamBoxScoreTable: React.FC<TeamBoxScoreTableProps> = ({ teamName, stats, userPlayerId }) => {
  return (
    <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl overflow-x-auto">
      <h3 className="text-sm font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 mb-3">
        {teamName} — Linhas Estatísticas
      </h3>

      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="text-[#8a96a8] border-b border-[#2b3345]">
            <th className="text-left py-2 px-2">Atleta</th>
            <th className="text-right py-2 px-2">MIN</th>
            <th className="text-right py-2 px-2 font-bold text-white">PTS</th>
            <th className="text-right py-2 px-2">FGM-A</th>
            <th className="text-right py-2 px-2">3PM-A</th>
            <th className="text-right py-2 px-2">FTM-A</th>
            <th className="text-right py-2 px-2">REB</th>
            <th className="text-right py-2 px-2">AST</th>
            <th className="text-right py-2 px-2">STL</th>
            <th className="text-right py-2 px-2">BLK</th>
            <th className="text-right py-2 px-2 text-red-400">TOV</th>
            <th className="text-right py-2 px-2">PF</th>
            <th className="text-right py-2 px-2">+/-</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(row => {
            const isUser = row.playerId === userPlayerId;
            return (
              <tr 
                key={row.playerId} 
                className={`border-b border-[#1c222e] hover:bg-[#1c222e]/60 transition-colors ${
                  isUser ? 'bg-team-primary/15 font-bold text-team-contrast' : 'text-[#f0f3f8]'
                }`}
              >
                <td className="py-2 px-2 flex items-center gap-1.5">
                  {isUser && <span className="w-1.5 h-1.5 rounded-full bg-team-primary" />}
                  {row.playerName}
                </td>
                <td className="text-right py-2 px-2 text-[#8a96a8]">{row.minutes}</td>
                <td className="text-right py-2 px-2 font-black text-amber-400 text-sm">{row.points}</td>
                <td className="text-right py-2 px-2">{row.fgm}-{row.fga}</td>
                <td className="text-right py-2 px-2">{row.fg3m}-{row.fg3a}</td>
                <td className="text-right py-2 px-2">{row.ftm}-{row.fta}</td>
                <td className="text-right py-2 px-2">{row.reb}</td>
                <td className="text-right py-2 px-2">{row.ast}</td>
                <td className="text-right py-2 px-2">{row.stl}</td>
                <td className="text-right py-2 px-2">{row.blk}</td>
                <td className="text-right py-2 px-2 text-red-400 font-bold">{row.tov}</td>
                <td className={`text-right py-2 px-2 ${row.pf >= 4 ? 'text-red-400 font-bold' : 'text-[#8a96a8]'}`}>{row.pf}</td>
                <td className={`text-right py-2 px-2 font-bold ${row.plusMinus > 0 ? 'text-emerald-400' : row.plusMinus < 0 ? 'text-red-400' : 'text-[#8a96a8]'}`}>
                  {row.plusMinus > 0 ? `+${row.plusMinus}` : row.plusMinus}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

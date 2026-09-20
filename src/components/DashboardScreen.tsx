import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { canAssignToGLeague } from '../engine/contracts';
import { 
  Play, 
  FastForward, 
  CalendarDays, 
  Sparkles, 
  Heart, 
  BatteryMedium, 
  ArrowUpRight, 
  ArrowDownRight,
  Newspaper,
  GraduationCap,
  Award,
  Wallet,
  ShoppingBag,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { 
    player, 
    simulateNextGame, 
    simulateBatchGames, 
    simulateFullSeason, 
    advanceToNextNbaSeason,
    openSeasonEndModal,
    setScreen,
    nbaStandings,
    ncaaStandings,
    gleagueStandings,
    isSimulating, 
    simProgress, 
    newsFeed,
    declareForNbaDraft,
    stayInCollegeAnotherYear,
    assignToGLeagueAction,
    recallFromGLeagueAction,
    retireAndInduct
  } = useGameStore();

  if (!player) return null;

  const currentTeam = getTeamById(player.currentTeamId);
  const s = player.seasonStats;

  const formatCurrency = (val: number) => {
    if (val === 0) return 'Bolsa Universitária';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const isCollege = player.currentLeague === 'NCAA';
  const isGLeague = player.currentLeague === 'G_LEAGUE';
  const isNba = player.currentLeague === 'NBA';

  const seasonMaxGames = isCollege ? 32 : isGLeague ? 50 : 82;
  const isSeasonOver = s.gamesPlayed >= seasonMaxGames;

  const myTeamStanding = (isCollege ? ncaaStandings : isGLeague ? gleagueStandings : nbaStandings)
    .find(team => team.teamId === player.currentTeamId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Barra de Progresso de Simulação Assíncrona */}
      {isSimulating && simProgress && (
        <div className="bg-[#13171f] border border-team-primary p-4 rounded-xl shadow-team-glow animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-white font-bold flex items-center gap-2">
              <FastForward className="w-4 h-4 text-team-primary" />
              Simulando partidas em segundo plano...
            </span>
            <span className="text-team-primary font-bold">
              {simProgress.completed} / {simProgress.total} Jogos ({Math.round((simProgress.completed / simProgress.total) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-[#0a0c0f] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-team-primary h-full transition-all duration-150"
              style={{ width: `${(simProgress.completed / simProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Grid Principal do Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cartão de Identidade do Atleta */}
        <div className="lg:col-span-4 bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              {currentTeam && (
                <TeamLogo team={currentTeam} size="lg" className="rounded-lg p-1.5 bg-black/40 border border-[#2b3345]" />
              )}
              <div className="text-right">
                <div className="text-3xl font-mono font-black text-white">{player.overall}</div>
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">Classificação Geral (OVR)</div>
                <div className="text-xs font-mono font-bold text-amber-400">Potencial: {player.potential}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl" title={player.country?.name || 'Internacional'}>
                  {player.country?.flag || '🌐'}
                </span>
                <span className="text-xs font-mono font-semibold text-[#8a96a8]">
                  {player.country?.name || 'Internacional'}
                </span>
              </div>
              <h1 className="text-2xl font-condensed font-black uppercase text-white tracking-wide">
                {player.fullName}
              </h1>
              <div className="text-xs font-mono text-[#8a96a8] flex flex-wrap items-center gap-1.5 mt-1">
                <span className="text-white font-bold">{player.position}</span>
                <span>•</span>
                <span className="text-team-primary font-semibold">
                  {player.primaryArchetype?.replace(/_/g, ' ') || player.archetype} 
                  {player.secondaryArchetype && player.secondaryArchetype !== player.primaryArchetype && (
                    <span className="text-amber-400"> / {player.secondaryArchetype.replace(/_/g, ' ')}</span>
                  )}
                </span>
                <span>•</span>
                <span>{Math.floor(player.heightInches / 12)}'{player.heightInches % 12}"</span>
                <span>•</span>
                <span>{player.weightLbs} lbs</span>
              </div>
              <div className="text-xs font-mono text-team-primary font-bold mt-1">
                {currentTeam?.name} ({player.currentLeague})
              </div>
            </div>

            {/* Saldo Bancário e Informações Contratuais */}
            <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-lg p-3 space-y-2.5 mb-4 text-xs font-mono">
              <div className="flex justify-between items-center pb-2 border-b border-[#1c222e]">
                <span className="text-[#8a96a8] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Saldo Bancário:
                </span>
                <span className="text-emerald-400 font-black text-sm">{formatCurrency(player.bankBalance || 0)}</span>
              </div>
              
              <button
                onClick={() => setScreen('CAREER_SHOP')}
                className="w-full py-1.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 text-[11px] font-condensed font-bold uppercase tracking-wider text-emerald-300 rounded transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Acessar Loja de Carreira & Investimentos
              </button>

              <div className="flex justify-between pt-1">
                <span className="text-[#8a96a8]">Tipo de Contrato:</span>
                <span className="text-white font-bold">{player.contract.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a96a8]">Salário Anual:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(player.contract.salaryPerYear)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8a96a8]">Duração Restante:</span>
                <span className="text-white font-bold">{player.contract.yearsRemaining} de {player.contract.yearsTotal} anos</span>
              </div>
              {player.contract.type === 'TWO_WAY' && (
                <div className="flex justify-between text-amber-400">
                  <span>Jogos na NBA:</span>
                  <span>{player.contract.nbaGamesPlayedThisYear || 0} / 50</span>
                </div>
              )}
            </div>

            {/* Barras de Estado: Moral, Química, Energia (com destaque em vermelho para status negativo) */}
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className={`flex items-center gap-1 ${player.moral < 50 ? 'text-red-400 font-bold' : 'text-[#8a96a8]'}`}>
                    <Heart className={`w-3 h-3 ${player.moral < 50 ? 'text-red-500' : 'text-rose-500'}`} /> 
                    Moral do Atleta {player.moral < 50 && '(Em Baixa)'}
                  </span>
                  <span className={`font-bold ${player.moral < 50 ? 'text-red-400' : 'text-white'}`}>{player.moral}%</span>
                </div>
                <div className="w-full bg-[#0a0c0f] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${player.moral < 50 ? 'bg-red-500' : 'bg-rose-500'}`} style={{ width: `${player.moral}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-[#8a96a8] flex items-center gap-1"><Sparkles className="w-3 h-3 text-blue-400" /> Química de Vestiário</span>
                  <span className="text-white font-bold">{player.chemistry}%</span>
                </div>
                <div className="w-full bg-[#0a0c0f] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${player.chemistry}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className={`flex items-center gap-1 ${player.energy < 50 ? 'text-red-400 font-bold' : 'text-[#8a96a8]'}`}>
                    <BatteryMedium className={`w-3 h-3 ${player.energy < 50 ? 'text-red-500' : 'text-emerald-400'}`} /> 
                    Energia & Físico {player.energy < 50 && '(Cansaço)'}
                  </span>
                  <span className={`font-bold ${player.energy < 50 ? 'text-red-400' : 'text-white'}`}>{player.energy}%</span>
                </div>
                <div className="w-full bg-[#0a0c0f] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${player.energy < 50 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${player.energy}%` }} />
                </div>
              </div>

              {player.energy < 40 && (
                <div className="flex items-center gap-2 p-2 rounded bg-red-950/40 border border-red-850 text-red-300 text-[11px] font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <span>Atenção: Fadiga elevada aumenta risco de lesão!</span>
                </div>
              )}
            </div>
          </div>

          {/* Atribuições / Transições Profissionais */}
          <div className="pt-4 border-t border-[#2b3345] mt-4 space-y-2">
            {isNba && canAssignToGLeague(player) && (
              <button
                onClick={assignToGLeagueAction}
                disabled={isSimulating}
                className="w-full py-2 px-3 bg-[#1c222e] hover:bg-[#2b3345] border border-[#3d475d] text-xs font-mono text-amber-400 rounded transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
                Deslocamento para a G-League (Assignment)
              </button>
            )}

            {isGLeague && (
              <button
                onClick={recallFromGLeagueAction}
                disabled={isSimulating}
                className="w-full py-2 px-3 bg-[#1c222e] hover:bg-[#2b3345] border border-[#3d475d] text-xs font-mono text-emerald-400 rounded transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                Chamada para a NBA Principal (Call-up)
              </button>
            )}

            {isNba && player.age >= 32 && (
              <button
                onClick={retireAndInduct}
                className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-xs font-mono text-red-300 rounded transition-all flex items-center justify-center gap-1.5"
              >
                Anunciar Aposentadoria da NBA
              </button>
            )}
          </div>
        </div>

        {/* Painel Central e Direito: Controles de Simulação & Estatísticas */}
        <div className="lg:col-span-8 space-y-6">
          {/* Barra de Simulação Rápida (Foco Arcade de Temporada por Temporada) */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-condensed font-black uppercase text-white tracking-wide flex items-center gap-2">
                  <Play className="w-5 h-5 text-team-primary" />
                  Temporada ({s.seasonYear}) · {currentTeam?.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-mono text-[#8a96a8]">
                  <span>Progresso: {s.gamesPlayed} de {seasonMaxGames} jogos</span>
                  <span>•</span>
                  {myTeamStanding && (
                    <span className="flex items-center gap-1.5">
                      Campanha: 
                      <span className="text-emerald-400 font-bold">{myTeamStanding.wins}V</span>
                      <span>-</span>
                      <span className="text-red-400 font-bold bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/60">
                        {myTeamStanding.losses}D
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Botões de Ação de Simulação */}
              {!isSeasonOver ? (
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* Botão Primário Arcade: Temporada Completa */}
                  <button
                    onClick={() => simulateFullSeason()}
                    disabled={isSimulating}
                    className="flex-1 md:flex-none px-5 py-2.5 bg-team-primary hover:opacity-95 disabled:opacity-50 text-team-contrast text-xs font-condensed font-black uppercase tracking-wider rounded-lg shadow-team-glow transition-all flex items-center justify-center gap-2 border border-white/20"
                  >
                    <FastForward className="w-4 h-4 fill-current" />
                    Simular Temporada Completa ({seasonMaxGames - s.gamesPlayed} Jogos)
                  </button>

                  <button
                    onClick={() => simulateBatchGames(10)}
                    disabled={isSimulating}
                    className="px-3.5 py-2.5 bg-[#1c222e] hover:bg-[#2b3345] disabled:opacity-50 text-white text-xs font-condensed font-bold uppercase tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center justify-center gap-1.5"
                    title="Avançar 10 partidas consecutivas"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    +10 Jogos
                  </button>

                  <button
                    onClick={() => simulateNextGame()}
                    disabled={isSimulating}
                    className="px-3 py-2.5 bg-[#1c222e] hover:bg-[#2b3345] disabled:opacity-50 text-[#8a96a8] hover:text-white text-xs font-condensed font-semibold uppercase tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center justify-center gap-1"
                    title="Simular partida por partida"
                  >
                    <Play className="w-3.5 h-3.5" />
                    1 Jogo
                  </button>
                </div>
              ) : (
                /* Temporada Concluída: Decisões e Botão Chamativo de Avanço */
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  {isCollege ? (
                    <>
                      <button
                        onClick={declareForNbaDraft}
                        className="px-5 py-2.5 bg-team-primary hover:opacity-95 text-white text-xs font-condensed font-black uppercase tracking-wider rounded-lg shadow-team-glow transition-all flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Declarar para o NBA Draft!
                      </button>
                      <button
                        onClick={stayInCollegeAnotherYear}
                        className="px-4 py-2.5 bg-[#1c222e] hover:bg-[#2b3345] text-white text-xs font-condensed font-bold uppercase tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4" />
                        Ficar +1 Ano na NCAA
                      </button>
                      <button
                        onClick={openSeasonEndModal}
                        className="px-3 py-2.5 bg-[#1c222e] hover:bg-[#2b3345] text-amber-400 text-xs font-condensed font-bold uppercase tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center gap-1.5"
                      >
                        Ver Resumo
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={advanceToNextNbaSeason}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs font-condensed uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                        Avançar para a Próxima Temporada ({s.seasonYear + 1})
                      </button>
                      <button
                        onClick={openSeasonEndModal}
                        className="px-4 py-3 bg-[#1c222e] hover:bg-[#2b3345] text-white text-xs font-condensed font-bold uppercase tracking-wider rounded-lg border border-[#2b3345] transition-all flex items-center gap-2"
                      >
                        📊 Resumo da Temporada & Finanças
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Painel de Estatísticas da Temporada do Atleta (com destaques em vermelho para dados negativos) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-2 border-t border-[#2b3345]">
              <div className="bg-[#0a0c0f] border border-[#2b3345] p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">Pontos (PPG)</div>
                <div className="text-lg font-mono font-black text-white">{s.pointsPerGame}</div>
              </div>

              <div className="bg-[#0a0c0f] border border-[#2b3345] p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">Rebotes (RPG)</div>
                <div className="text-lg font-mono font-black text-white">{s.reboundsPerGame}</div>
              </div>

              <div className="bg-[#0a0c0f] border border-[#2b3345] p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">Assistências (APG)</div>
                <div className="text-lg font-mono font-black text-white">{s.assistsPerGame}</div>
              </div>

              <div className="bg-[#0a0c0f] border border-[#2b3345] p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">Roubos / Tocos</div>
                <div className="text-xs font-mono font-bold text-white mt-1">{s.stealsPerGame} / {s.blocksPerGame}</div>
              </div>

              <div className="bg-[#0a0c0f] border border-[#2b3345] p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">Eficiência (FG/3P)</div>
                <div className="text-xs font-mono font-bold text-white mt-1">{s.fgPct}% / {s.fg3Pct}%</div>
              </div>

              <div className="bg-[#0a0c0f] border border-[#2b3345] p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8]">True Shooting</div>
                <div className="text-lg font-mono font-black text-amber-400">{s.tsPct}%</div>
              </div>

              {/* Destaques Negativos Obrigatórios em Vermelho: Turnovers e Faltas */}
              <div className="bg-red-950/20 border border-red-900/40 p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-red-400 font-bold">Turnovers (TOV)</div>
                <div className="text-lg font-mono font-black text-red-400">{s.turnoversPerGame}</div>
              </div>

              <div className="bg-red-950/20 border border-red-900/40 p-2 rounded-lg text-center">
                <div className="text-[10px] font-condensed uppercase tracking-wider text-red-400 font-bold">Faltas (PF)</div>
                <div className="text-lg font-mono font-black text-red-400">{s.foulsPerGame}</div>
              </div>
            </div>

            {/* Métricas Avançadas da Temporada */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-[#1c222e] text-xs font-mono">
              <div className="flex justify-between bg-[#0a0c0f]/60 px-3 py-1.5 rounded border border-[#2b3345]">
                <span className="text-[#8a96a8]">Usage Rate (USG%):</span>
                <span className="text-white font-bold">{s.usgPct}%</span>
              </div>
              <div className="flex justify-between bg-[#0a0c0f]/60 px-3 py-1.5 rounded border border-[#2b3345]">
                <span className="text-[#8a96a8]">Player Efficiency (PER):</span>
                <span className="text-emerald-400 font-bold">{s.per}</span>
              </div>
              <div className="flex justify-between bg-[#0a0c0f]/60 px-3 py-1.5 rounded border border-[#2b3345]">
                <span className="text-[#8a96a8]">Win Shares (WS):</span>
                <span className="text-blue-400 font-bold">{s.winShares}</span>
              </div>
              <div className="flex justify-between bg-[#0a0c0f]/60 px-3 py-1.5 rounded border border-[#2b3345]">
                <span className="text-[#8a96a8]">Minutos por Jogo:</span>
                <span className="text-white font-bold">{s.minutesPerGame} min</span>
              </div>
            </div>
          </div>

          {/* Feed de Notícias & Terminal em Tempo Real */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl">
            <h3 className="text-base font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 mb-3 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-team-primary" />
              Terminal de Notícias & Transações da Competição
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {newsFeed.length === 0 ? (
                <div className="text-xs font-mono text-[#8a96a8] py-4 text-center">
                  Nenhuma notícia recente. Simule uma partida para gerar eventos!
                </div>
              ) : (
                newsFeed.map(news => {
                  const isNegative = /derrota|perdeu|lesão|lesao|crise|queda|caiu|tropeço|afastado|fratura|entorse/i.test(
                    `${news.headline} ${news.content}`
                  );
                  return (
                    <div 
                      key={news.id} 
                      className={`p-3 rounded-lg border transition-colors ${
                        isNegative 
                          ? 'bg-red-950/20 border-red-900/50 hover:border-red-700/60' 
                          : 'bg-[#0a0c0f] border-[#2b3345] hover:border-team-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`font-condensed font-bold text-sm ${isNegative ? 'text-red-300' : 'text-white'}`}>
                          {isNegative && '⚠️ '}{news.headline}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c222e] text-[#8a96a8]">
                          {news.date}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isNegative ? 'text-red-300/80' : 'text-[#8a96a8]'}`}>
                        {news.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

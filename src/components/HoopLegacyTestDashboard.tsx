import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getTeamById } from '../data/teamsRepository';

interface Props {
  onBackToClassic?: () => void;
}

export const HoopLegacyTestDashboard: React.FC<Props> = ({ onBackToClassic }) => {
  const { player, simulateNextGame, isSimulating, newsFeed } = useGameStore();

  const [activeLeagueTab, setActiveLeagueTab] = useState<'ncaa' | 'gleague'>('ncaa');
  const [activeNav, setActiveNav] = useState('dashboard');
  const [demoSimulatedGames, setDemoSimulatedGames] = useState(0);
  const [demoWins, setDemoWins] = useState(42);
  const [demoLosses, setDemoLosses] = useState(14);
  const [simFeedback, setSimFeedback] = useState<string | null>(null);
  const [useRealDataIfAvailable, setUseRealDataIfAvailable] = useState<boolean>(Boolean(player));

  // Dados do Jogador (Usa o jogador real se o usuário preferir e tiver um save ativo, senão usa Alex Silva)
  const currentTeam = player ? getTeamById(player.currentTeamId) : null;
  const isUsingReal = Boolean(player && useRealDataIfAvailable);

  const playerName = isUsingReal ? player!.fullName : "Alex 'The Jet' Silva";
  const playerNumber = isUsingReal ? "8" : "8";
  const playerPos = isUsingReal ? player!.position : "SF";
  const playerTeamName = isUsingReal && currentTeam ? currentTeam.name : "Boston Celtics";
  const playerTeamAbbr = isUsingReal && currentTeam ? currentTeam.abbreviation : "BOS";
  const playerOvr = isUsingReal ? player!.overall : 88;
  const playerPotential = isUsingReal ? player!.potential : 94;
  const formatHeight = (inches: number) => {
    const feet = Math.floor(inches / 12);
    const remainder = inches % 12;
    return `${feet}'${remainder}"`;
  };

  const playerPpg = isUsingReal && player!.seasonStats.gamesPlayed > 0 
    ? player!.seasonStats.pointsPerGame.toFixed(1) 
    : "29.8";
  const playerRpg = isUsingReal && player!.seasonStats.gamesPlayed > 0 
    ? player!.seasonStats.reboundsPerGame.toFixed(1) 
    : "7.6";
  const playerApg = isUsingReal && player!.seasonStats.gamesPlayed > 0 
    ? player!.seasonStats.assistsPerGame.toFixed(1) 
    : "5.9";

  const handleSimulate = async () => {
    if (isUsingReal && simulateNextGame) {
      setSimFeedback("Simulando partida real via Engine de Posses...");
      try {
        await simulateNextGame();
        setSimFeedback("Partida simulada com sucesso no seu save!");
      } catch {
        setSimFeedback("Simulação concluída!");
      }
      setTimeout(() => setSimFeedback(null), 3000);
    } else {
      // Simulação Demo Interativa
      setSimFeedback("Calculando 102 posses estocásticas contra Milwaukee Bucks...");
      setTimeout(() => {
        const userWon = Math.random() > 0.35;
        if (userWon) {
          setDemoWins(w => w + 1);
          setSimFeedback("VITÓRIA! Boston Celtics 116 x 109 Milwaukee Bucks (Silva: 32 PTS, 8 REB, 6 AST)");
        } else {
          setDemoLosses(l => l + 1);
          setSimFeedback("DERROTA APERTADA: Celtics 108 x 112 Bucks (Silva: 28 PTS, 5 AST)");
        }
        setDemoSimulatedGames(g => g + 1);
        setTimeout(() => setSimFeedback(null), 4000);
      }, 600);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      {/* Top Banner de Controle do Teste */}
      <div className="bg-surface-container-highest border-b border-primary/40 px-4 py-2 flex flex-wrap items-center justify-between text-xs font-stat-mono-sm z-50 sticky top-0 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="font-bold text-primary tracking-wide uppercase">
            🧪 AMBIENTE DE TESTES · NOVO DESIGN SYSTEM HOOP LEGACY v2.4
          </span>
          <span className="hidden md:inline-block text-on-surface-variant">
            (Padrão Stitch com Grade Modular de 12 Colunas)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {player && (
            <button 
              onClick={() => setUseRealDataIfAvailable(!useRealDataIfAvailable)}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant text-on-surface transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">
                {useRealDataIfAvailable ? 'person' : 'star'}
              </span>
              <span>{useRealDataIfAvailable ? 'Usando Seu Save Ativo' : 'Usando Dados Demo (Alex Silva)'}</span>
            </button>
          )}

          {onBackToClassic && (
            <button 
              onClick={onBackToClassic}
              className="px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container font-bold hover:opacity-90 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>Alternar para Visual Clássico</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Toast de Simulação */}
      {simFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-surface-container-high border-2 border-primary text-on-surface px-5 py-3 rounded-lg shadow-[0_0_24px_rgba(0,214,89,0.5)] font-stat-mono-md flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary text-[24px]">sports_basketball</span>
          <span>{simFeedback}</span>
        </div>
      )}

      {/* SIDEBAR DE NAVEGAÇÃO FIXA (256px) */}
      <aside className="fixed left-0 top-[37px] h-[calc(100%-37px)] w-64 bg-surface-container-lowest z-40 flex flex-col justify-between border-r border-outline-variant/30 overflow-y-auto">
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 flex items-center px-space-md gap-space-sm bg-surface-container-low border-b border-outline-variant/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 50" fill="none" className="h-8 w-auto">
              <defs>
                <linearGradient id="celticsGlowSidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00d659" />
                  <stop offset="100%" stopColor="#007A33" />
                </linearGradient>
                <linearGradient id="goldAccentSidebar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#BA9653" />
                </linearGradient>
              </defs>
              <g transform="translate(6, 5)">
                <circle cx="20" cy="20" r="18" fill="#121820" stroke="url(#celticsGlowSidebar)" strokeWidth="2.5"/>
                <path d="M7 20 H33 M20 7 V33" stroke="url(#celticsGlowSidebar)" strokeWidth="1.8" strokeDasharray="1 1"/>
                <path d="M10 11 C16 16 16 24 10 29 M30 11 C24 16 24 24 30 29" stroke="url(#celticsGlowSidebar)" strokeWidth="1.8"/>
                <circle cx="20" cy="20" r="4" fill="url(#goldAccentSidebar)"/>
              </g>
              <text x="54" y="23" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900" fontSize="20" letterSpacing="2" fill="#FFFFFF">HOOP LEGACY</text>
              <rect x="54" y="27" width="170" height="2" fill="url(#celticsGlowSidebar)" />
              <text x="54" y="41" fontFamily="'JetBrains Mono', monospace" fontWeight="700" fontSize="9" letterSpacing="3" fill="#00d659">CAREER SIMULATOR PRO</text>
              <rect x="204" y="12" width="28" height="13" rx="2" fill="#BA9653" />
              <text x="218" y="22" fontFamily="'Barlow Condensed', sans-serif" fontWeight="900" fontSize="8" fill="#000" textAnchor="middle">v2.4</text>
            </svg>
          </div>

          {/* Franchise Cap Bar */}
          <div className="p-space-md bg-surface-container-low/40 border-b border-outline-variant/20">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">FRANCHISE CAP</span>
              <span className="font-stat-mono-sm text-stat-mono-sm text-primary">$168.4M / $172M</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[88%]"></div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-space-xs p-space-sm">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'sports_basketball' },
              { id: 'roster-and-lineups', label: 'Roster & Lineups', icon: 'groups' },
              { id: 'schedule-and-results', label: 'Schedule & Results', icon: 'calendar_month' },
              { id: 'league-standings-and-stats', label: 'League Standings', icon: 'leaderboard' },
              { id: 'career-history', label: 'Career History', icon: 'military_tech' },
              { id: 'draft-and-scouting', label: 'Draft & Scouting', icon: 'search_insights' },
            ].map(item => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-bold border-l-4 border-primary shadow-[0_0_12px_rgba(0,214,89,0.25)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-headline-sm text-headline-sm uppercase tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/30 flex flex-col gap-space-sm">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="font-stat-mono-sm text-stat-mono-sm">SIM ENGINE: v4.2.1</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <button 
            onClick={handleSimulate}
            disabled={isSimulating}
            className="w-full py-space-xs bg-primary text-on-primary font-label-caps text-label-caps uppercase rounded tracking-wider hover:bg-primary-container transition-all flex items-center justify-center gap-space-xs shadow-[0_0_14px_rgba(0,214,89,0.30)] active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">fast_forward</span>
            <span>{isSimulating ? 'SIMULANDO...' : 'ADVANCE DAY'}</span>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL COM HEADER E GRID 12-COL */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Header Superior Fixo */}
        <header className="fixed top-[37px] left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 z-30 flex items-center justify-between px-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high border border-outline-variant/50 text-on-surface">
              <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface">
                SEASON 2024-25 • REGULAR SEASON • WEEK 18
              </span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs bg-surface-container rounded">
              <span className="font-stat-mono-md text-stat-mono-md text-tertiary font-bold">FEB 24, 2025</span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-space-xs rounded bg-surface-container-low border border-outline-variant/40">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-stat-mono-sm text-stat-mono-sm text-primary uppercase">LIVE SIM SYNCED</span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            {/* Quick Actions Buttons */}
            <div className="flex items-center gap-space-xs bg-surface-container-low p-space-xs rounded border border-outline-variant/30">
              <button 
                onClick={() => alert("Jogo salvo com sucesso no navegador!")} 
                className="p-space-xs rounded hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant transition-colors flex items-center" 
                title="Salvar Jogo"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
              </button>
              <button className="p-space-xs rounded hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant transition-colors flex items-center" title="Central da Liga">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </button>
              <button className="relative p-space-xs rounded hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant transition-colors flex items-center" title="Caixa de Entrada">
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <span className="absolute -top-1 -right-1 bg-error text-on-error font-stat-mono-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
              </button>
              <button className="p-space-xs rounded hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant transition-colors flex items-center" title="Finanças da Franquia">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </button>
              <button className="p-space-xs rounded hover:bg-surface-container-high hover:text-on-surface text-on-surface-variant transition-colors flex items-center" title="Configurações">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-space-sm pl-space-md border-l border-outline-variant/40">
              <div className="flex flex-col text-right">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold leading-tight">
                  {playerName} <span className="text-primary">#{playerNumber}</span>
                </span>
                <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">
                  {playerPos} • {playerTeamName}
                </span>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded bg-tertiary text-on-tertiary-fixed font-stat-mono-md text-stat-mono-md font-bold shadow-[0_0_10px_rgba(255,206,118,0.35)]">
                {playerOvr}
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL DO DASHBOARD */}
        <main className="w-full pt-20 bg-background flex-1 px-space-lg pb-space-xl">
          <div className="flex flex-col w-full gap-space-lg">
            
            {/* GRID SUPERIOR DE 12 COLUNAS */}
            <div className="grid grid-cols-12 gap-space-lg">
              
              {/* COLUNA 1: DOSSIÊ COMPLETO DO ATLETA (Cols 1-3) */}
              <div className="col-span-12 xl:col-span-3 flex flex-col gap-space-md">
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md relative overflow-hidden shadow-xl border border-outline-variant/30">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container via-primary to-tertiary"></div>

                  {/* Header: Badges & Nacionalidade */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-space-xs">
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-highest font-stat-mono-sm text-stat-mono-sm text-tertiary font-bold tracking-wider">
                        {playerPos} #{playerNumber}
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">
                        {playerTeamAbbr}
                      </span>
                      <span className="inline-flex items-center px-space-xs py-0.5 rounded bg-surface-container-high font-stat-mono-sm text-stat-mono-sm text-on-surface">
                        🇧🇷 BRA
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-primary font-label-caps text-label-caps uppercase bg-primary/10 px-space-xs py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      ACTIVE ROSTER
                    </span>
                  </div>

                  {/* Imagem do Atleta com Overlay de OVR */}
                  <div className="relative w-full h-52 bg-surface-container rounded-lg overflow-hidden flex items-end justify-center">
                    <img 
                      className="w-full h-full object-cover object-top opacity-90 transition-transform duration-500 hover:scale-105" 
                      src="/alex_silva.png"
                      onError={(e) => {
                        // Fallback caso a imagem local demore
                        (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDCPDHxIaoUoAB2iPhDhdaPxAXY7-gtkzaJdEc2xLGi63LzmWucJz_UmxMMh1iug_svknL14ZtWoueS4cqpKaQxJaKTSigViZrpLBC2WFcA0eLfgBlo0UbD89nnvwlY1kq_VuKVtFgxubCzdAAM6k6kWgbNGJDz0pc5h2XoB3YaaPPNj5vcM8ZwBsCSP0PPtXDmE6G1YswIho7zRFLiHdIfJqg3luTnU71arGUWlNZFjC6v8kzBc8tI";
                      }}
                      alt="Alex Silva"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/30 to-transparent"></div>

                    {/* OVR Monolith Badge */}
                    <div className="absolute bottom-space-sm left-space-sm flex items-end gap-space-xs">
                      <div className="flex flex-col items-center justify-center bg-tertiary text-on-tertiary-fixed font-stat-display text-stat-display px-space-sm py-0.5 rounded leading-none shadow-[0_0_16px_rgba(255,206,118,0.4)]">
                        {playerOvr}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-tertiary uppercase leading-none font-bold">
                          {playerOvr >= 85 ? 'ALL-STAR' : 'STARTER'}
                        </span>
                        <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant uppercase">
                          POTENTIAL: {playerPotential}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-space-xs right-space-xs bg-surface-container-lowest/80 backdrop-blur-sm p-space-xs rounded-full flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[20px]">filter_vintage</span>
                    </div>
                  </div>

                  {/* Nome e Dados Biométricos */}
                  <div className="flex flex-col">
                    <h2 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight leading-none">
                      {playerName}
                    </h2>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">
                      {playerPos} • {playerTeamName} • Starter
                    </span>

                    <div className="grid grid-cols-4 gap-space-xs mt-space-sm py-space-xs px-space-sm bg-surface-container rounded font-stat-mono-sm text-stat-mono-sm text-center">
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant uppercase">AGE</span>
                        <span className="text-on-surface font-bold">{isUsingReal ? player!.age : '24'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant uppercase">HEIGHT</span>
                        <span className="text-on-surface font-bold">{isUsingReal ? formatHeight(player!.heightInches) : "6'8\""}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant uppercase">WEIGHT</span>
                        <span className="text-on-surface font-bold">{isUsingReal ? `${player!.weightLbs} LB` : '225 LB'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-on-surface-variant uppercase">DRAFT</span>
                        <span className="text-tertiary font-bold">'21 R1:14</span>
                      </div>
                    </div>
                  </div>

                  {/* Vitals: Morale, Stamina, Form */}
                  <div className="grid grid-cols-3 gap-space-xs">
                    <div className="bg-surface-container p-space-xs rounded flex flex-col items-center">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">MORALE</span>
                      <div className="flex items-center gap-1 text-primary font-stat-mono-md text-stat-mono-md">
                        <span className="material-symbols-outlined text-[14px]">sentiment_very_satisfied</span>
                        <span>94%</span>
                      </div>
                      <span className="font-stat-mono-sm text-[10px] text-on-surface-variant">Exceptional</span>
                    </div>

                    <div className="bg-surface-container p-space-xs rounded flex flex-col items-center">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">STAMINA</span>
                      <div className="flex items-center gap-1 text-secondary font-stat-mono-md text-stat-mono-md">
                        <span className="material-symbols-outlined text-[14px]">battery_charging_full</span>
                        <span>92%</span>
                      </div>
                      <span className="font-stat-mono-sm text-[10px] text-on-surface-variant">Prime Rest</span>
                    </div>

                    <div className="bg-surface-container p-space-xs rounded flex flex-col items-center">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">FORM</span>
                      <div className="flex items-center gap-1 text-tertiary font-stat-mono-md text-stat-mono-md">
                        <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                        <span>HOT</span>
                      </div>
                      <span className="font-stat-mono-sm text-[10px] text-primary font-bold">+3 OVR BOOST</span>
                    </div>
                  </div>

                  {/* Matriz de Atributos */}
                  <div className="flex flex-col gap-space-sm bg-surface-container-lowest/60 p-space-sm rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider">CORE ATTRIBUTE MATRIX</span>
                      <span className="font-stat-mono-sm text-stat-mono-sm text-primary">SCALE: 99 MAX</span>
                    </div>

                    {/* Shooting */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[16px] text-primary">adjust</span> Shooting (Arremesso)
                        </span>
                        <span className="font-stat-mono-md text-stat-mono-md text-primary font-bold">89</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-secondary-container to-primary rounded-full" style={{ width: '89%' }}></div>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-stat-mono-sm text-[10px]">
                        <span>MID: 92</span>
                        <span>3PT: 87</span>
                        <span>FT: 86</span>
                      </div>
                    </div>

                    {/* Playmaking */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span> Playmaking & IQ
                        </span>
                        <span className="font-stat-mono-md text-stat-mono-md text-secondary font-bold">82</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-stat-mono-sm text-[10px]">
                        <span>PASS VISION: 84</span>
                        <span>BALL HANDLE: 85</span>
                      </div>
                    </div>

                    {/* Defense */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[16px] text-primary">shield</span> Defense (Defesa)
                        </span>
                        <span className="font-stat-mono-md text-stat-mono-md text-primary font-bold">86</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-secondary-container to-primary rounded-full" style={{ width: '86%' }}></div>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-stat-mono-sm text-[10px]">
                        <span>PERIMETER: 90</span>
                        <span>STEAL: 84</span>
                        <span>CONTEST: 85</span>
                      </div>
                    </div>

                    {/* Physical */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                        <span className="flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span> Physical (Físico)
                        </span>
                        <span className="font-stat-mono-md text-stat-mono-md text-tertiary font-bold">91</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full" style={{ width: '91%' }}></div>
                      </div>
                      <div className="flex justify-between text-on-surface-variant font-stat-mono-sm text-[10px]">
                        <span>SPEED: 94</span>
                        <span>VERT: 88</span>
                        <span>STRENGTH: 81</span>
                      </div>
                    </div>
                  </div>

                  {/* Contract Ledger */}
                  <div className="bg-surface-container p-space-sm rounded flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface uppercase flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[14px]">receipt_long</span> CONTRACT LEDGER
                      </span>
                      <span className="font-stat-mono-sm text-stat-mono-sm text-primary font-bold">ROSTER GUARANTEED</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-stat-mono-md text-stat-mono-md text-on-surface font-bold">$24.5M / 3 YRS REMAINING</span>
                      <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">Exp: 2027</span>
                    </div>
                    <div className="p-space-xs bg-surface-container-lowest rounded flex items-center justify-between text-on-surface-variant font-stat-mono-sm text-[11px]">
                      <span className="text-tertiary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">military_tech</span> INCENTIVE TARGET
                      </span>
                      <span className="text-on-surface">All-NBA 1st/2nd: <strong className="text-primary">+$2.0M</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUNA 2: MATCHUP HERO & CLASSIFICAÇÃO LESTE (Cols 4-8) */}
              <div className="col-span-12 xl:col-span-6 flex flex-col gap-space-lg">
                {/* Season Progress Bar */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex items-center justify-between flex-wrap gap-space-sm shadow-md border border-outline-variant/30">
                  <div className="flex items-center gap-space-md">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">REGULAR SEASON PROGRESS</span>
                      <div className="flex items-baseline gap-space-xs">
                        <span className="font-stat-mono-md text-stat-mono-md text-on-surface font-bold">
                          {56 + demoSimulatedGames} / 82 GAMES
                        </span>
                        <span className="font-stat-mono-sm text-stat-mono-sm text-primary">
                          ({(((56 + demoSimulatedGames) / 82) * 100).toFixed(1)}% COMPLETE)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-lg">
                    <div className="flex flex-col text-right">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">RECORD</span>
                      <span className="font-stat-mono-md text-stat-mono-md text-primary font-bold">
                        {demoWins}-{demoLosses} (.{Math.round((demoWins / (demoWins + demoLosses)) * 1000)})
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">CONFERENCE SEED</span>
                      <span className="font-headline-sm text-headline-sm text-tertiary font-bold leading-tight">#1 EAST</span>
                    </div>
                  </div>
                </div>

                {/* Matchup Hero Card: Boston Celtics vs Milwaukee Bucks */}
                <div className="relative bg-surface-container-low rounded-xl overflow-hidden p-space-lg flex flex-col gap-space-md shadow-2xl border border-outline-variant/30">
                  <div className="absolute -top-16 -left-16 w-60 h-60 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-tertiary-container/15 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-space-xs">
                      <span className="px-space-sm py-0.5 rounded bg-primary/20 text-primary font-label-caps text-label-caps uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">stadium</span> TD GARDEN • BOSTON, MA
                      </span>
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-highest font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">
                        NATIONAL TV (TNT)
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs font-stat-mono-sm text-stat-mono-sm">
                      <span className="text-on-surface-variant">ODDS:</span>
                      <span className="text-primary font-bold">BOS -4.5</span>
                      <span className="text-on-surface-variant">O/U: 232.5</span>
                    </div>
                  </div>

                  {/* Faceoff */}
                  <div className="grid grid-cols-11 items-center z-10 py-space-sm">
                    {/* Home Team */}
                    <div className="col-span-5 flex items-center gap-space-md">
                      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary shadow-inner shrink-0 border border-primary/30">
                        <span className="material-symbols-outlined text-[36px]">sports_basketball</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-stat-mono-sm text-stat-mono-sm text-primary uppercase tracking-wider">HOME • 24-4 AT HOME</span>
                        <span className="font-headline-xl text-headline-xl text-on-surface font-bold uppercase truncate leading-none">CELTICS</span>
                        <span className="font-stat-mono-md text-stat-mono-md text-on-surface-variant">{demoWins}-{demoLosses} • L10: 8-2 • W4</span>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      <span className="font-headline-md text-headline-md text-tertiary font-bold tracking-widest">VS</span>
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping my-1"></span>
                    </div>

                    {/* Away Team */}
                    <div className="col-span-5 flex items-center justify-end gap-space-md text-right">
                      <div className="flex flex-col min-w-0">
                        <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant uppercase tracking-wider">AWAY • 17-10 ON ROAD</span>
                        <span className="font-headline-xl text-headline-xl text-on-surface font-bold uppercase truncate leading-none">BUCKS</span>
                        <span className="font-stat-mono-md text-stat-mono-md text-on-surface-variant">39-17 • L10: 7-3 • W2</span>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary shadow-inner shrink-0 border border-tertiary/30">
                        <span className="material-symbols-outlined text-[36px]">sports_martial_arts</span>
                      </div>
                    </div>
                  </div>

                  {/* Marquee Matchup */}
                  <div className="z-10 p-space-sm bg-surface-container rounded-lg flex items-center justify-between text-body-sm text-body-sm border border-outline-variant/30">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="text-on-surface font-bold">{playerName}</span>
                      <span className="text-on-surface-variant font-stat-mono-sm text-stat-mono-sm">({playerPpg} PPG, {playerRpg} RPG)</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-tertiary uppercase tracking-wider">MARQUEE MATCHUP OF THE NIGHT</span>
                    <div className="flex items-center gap-space-xs">
                      <span className="text-on-surface font-bold">Giannis Antetokounmpo</span>
                      <span className="text-on-surface-variant font-stat-mono-sm text-stat-mono-sm">(28.9 PPG, 11.2 RPG)</span>
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    </div>
                  </div>

                  {/* Botões de Simulação */}
                  <div className="flex flex-col gap-space-xs z-10">
                    <button 
                      onClick={handleSimulate}
                      disabled={isSimulating}
                      className="w-full py-space-md bg-primary text-on-primary font-headline-md text-headline-md uppercase tracking-wider rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-space-sm shadow-[0_0_24px_rgba(0,214,89,0.4)] hover:shadow-[0_0_32px_rgba(0,214,89,0.6)] active:scale-[0.99] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[24px]">flash_on</span>
                      <span>SIMULAR PRÓXIMO JOGO (VS MILWAUKEE BUCKS)</span>
                    </button>

                    <div className="grid grid-cols-3 gap-space-xs">
                      <button 
                        onClick={() => alert("Modo Jogo a Jogo (Play-by-Play com motor de 100+ posses)")}
                        className="py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-caps text-label-caps uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">play_circle</span> Jogo a Jogo (PBP)
                      </button>
                      <button 
                        onClick={handleSimulate}
                        className="py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-caps text-label-caps uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">fast_forward</span> Simulação Rápida
                      </button>
                      <button 
                        onClick={() => alert("Simulando até os Playoffs em lote...")}
                        className="py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-caps text-label-caps uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">skip_next</span> Simular Até Playoffs
                      </button>
                    </div>
                  </div>
                </div>

                {/* TABELA DE CLASSIFICAÇÃO DA CONFERÊNCIA LESTE (15 TEAMS) */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-md border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">format_list_numbered</span>
                      <span className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
                        CLASSIFICAÇÃO CONFERÊNCIA LESTE
                      </span>
                    </div>
                    <div className="flex items-center gap-space-sm font-stat-mono-sm text-stat-mono-sm">
                      <span className="inline-flex items-center gap-1 text-primary"><span className="w-2 h-2 rounded bg-primary"></span> 1-6 Playoffs</span>
                      <span className="inline-flex items-center gap-1 text-tertiary"><span className="w-2 h-2 rounded bg-tertiary"></span> 7-10 Play-In</span>
                      <span className="inline-flex items-center gap-1 text-on-surface-variant"><span className="w-2 h-2 rounded bg-surface-container-highest"></span> 11-15 Lottery</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase">
                          <th className="py-2 px-3">#</th>
                          <th className="py-2 px-3">FRANCHISE</th>
                          <th className="py-2 px-3 text-right">W</th>
                          <th className="py-2 px-3 text-right">L</th>
                          <th className="py-2 px-3 text-right">PCT</th>
                          <th className="py-2 px-3 text-right">GB</th>
                          <th className="py-2 px-3 text-right">L10</th>
                          <th className="py-2 px-3 text-right">STRK</th>
                        </tr>
                      </thead>
                      <tbody className="font-stat-mono-sm text-stat-mono-sm divide-y-0">
                        <tr className="bg-secondary-container/20 text-on-surface hover:bg-secondary-container/30 transition-colors">
                          <td className="py-1.5 px-3 font-bold text-primary">1</td>
                          <td className="py-1.5 px-3 font-body-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                            <span className="text-primary font-bold">Boston Celtics</span>
                            <span className="bg-primary/20 text-primary px-1 rounded text-[10px]">USER</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">{demoWins}</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">{demoLosses}</td>
                          <td className="py-1.5 px-3 text-right text-primary">.{Math.round((demoWins / (demoWins + demoLosses)) * 1000)}</td>
                          <td className="py-1.5 px-3 text-right">-</td>
                          <td className="py-1.5 px-3 text-right">8-2</td>
                          <td className="py-1.5 px-3 text-right text-primary font-bold">W4</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-secondary">2</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-tertiary">sports_martial_arts</span>
                            <span>Milwaukee Bucks</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">39</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">17</td>
                          <td className="py-1.5 px-3 text-right">.696</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">3.0</td>
                          <td className="py-1.5 px-3 text-right">7-3</td>
                          <td className="py-1.5 px-3 text-right text-secondary">W2</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-secondary">3</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">swords</span>
                            <span>Cleveland Cavaliers</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">37</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">19</td>
                          <td className="py-1.5 px-3 text-right">.661</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">5.0</td>
                          <td className="py-1.5 px-3 text-right">6-4</td>
                          <td className="py-1.5 px-3 text-right text-error">L1</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-secondary">4</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">apartment</span>
                            <span>New York Knicks</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">35</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">21</td>
                          <td className="py-1.5 px-3 text-right">.625</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">7.0</td>
                          <td className="py-1.5 px-3 text-right">6-4</td>
                          <td className="py-1.5 px-3 text-right text-secondary">W1</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-secondary">5</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">notifications</span>
                            <span>Philadelphia 76ers</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">33</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">23</td>
                          <td className="py-1.5 px-3 text-right">.589</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">9.0</td>
                          <td className="py-1.5 px-3 text-right">5-5</td>
                          <td className="py-1.5 px-3 text-right text-secondary">W2</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-secondary">6</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-error">local_fire_department</span>
                            <span>Miami Heat</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">31</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">25</td>
                          <td className="py-1.5 px-3 text-right">.554</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">11.0</td>
                          <td className="py-1.5 px-3 text-right">4-6</td>
                          <td className="py-1.5 px-3 text-right text-error">L2</td>
                        </tr>

                        {/* PLAY-IN SEPARATOR */}
                        <tr className="bg-surface-container-high/40 text-[10px] text-tertiary">
                          <td className="py-0.5 px-3 uppercase tracking-wider font-semibold" colSpan={8}>
                            ••• PLAY-IN TOURNAMENT SEEDING LINE (7-10) •••
                          </td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-tertiary">7</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">speed</span>
                            <span>Indiana Pacers</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">30</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">26</td>
                          <td className="py-1.5 px-3 text-right">.536</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">12.0</td>
                          <td className="py-1.5 px-3 text-right">6-4</td>
                          <td className="py-1.5 px-3 text-right text-secondary">W1</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors">
                          <td className="py-1.5 px-3 font-bold text-tertiary">8</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">auto_fix</span>
                            <span>Orlando Magic</span>
                          </td>
                          <td className="py-1.5 px-3 text-right font-bold">29</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">27</td>
                          <td className="py-1.5 px-3 text-right">.518</td>
                          <td className="py-1.5 px-3 text-right text-on-surface-variant">13.0</td>
                          <td className="py-1.5 px-3 text-right">5-5</td>
                          <td className="py-1.5 px-3 text-right text-error">L1</td>
                        </tr>

                        {/* LOTTERY SEPARATOR */}
                        <tr className="bg-surface-container-highest/20 text-[10px] text-on-surface-variant">
                          <td className="py-0.5 px-3 uppercase tracking-wider font-semibold" colSpan={8}>
                            ••• LOTTERY BOUND (11-15) •••
                          </td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors text-on-surface-variant">
                          <td className="py-1.5 px-3">11</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2 text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">radar</span>
                            <span>Brooklyn Nets</span>
                          </td>
                          <td className="py-1.5 px-3 text-right">22</td>
                          <td className="py-1.5 px-3 text-right">34</td>
                          <td className="py-1.5 px-3 text-right">.393</td>
                          <td className="py-1.5 px-3 text-right">20.0</td>
                          <td className="py-1.5 px-3 text-right">3-7</td>
                          <td className="py-1.5 px-3 text-right text-error">L2</td>
                        </tr>

                        <tr className="hover:bg-surface-container transition-colors text-on-surface-variant">
                          <td className="py-1.5 px-3">15</td>
                          <td className="py-1.5 px-3 font-body-sm flex items-center gap-2 text-on-surface">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">settings</span>
                            <span>Detroit Pistons</span>
                          </td>
                          <td className="py-1.5 px-3 text-right">11</td>
                          <td className="py-1.5 px-3 text-right">45</td>
                          <td className="py-1.5 px-3 text-right">.196</td>
                          <td className="py-1.5 px-3 text-right">31.0</td>
                          <td className="py-1.5 px-3 text-right">2-8</td>
                          <td className="py-1.5 px-3 text-right text-secondary">W1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* News & Transactions Feed */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-md border border-outline-variant/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface uppercase">
                        MÓDULO DE NOTÍCIAS & TRANSAÇÕES EM TEMPO REAL
                      </span>
                    </div>
                    <span className="font-stat-mono-sm text-stat-mono-sm text-primary flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> FEED SYNC: ACTIVE
                    </span>
                  </div>

                  <div className="flex flex-col gap-space-xs font-stat-mono-sm text-stat-mono-sm bg-surface-container-lowest p-space-sm rounded border-l-2 border-primary">
                    <div className="flex items-start gap-space-sm">
                      <span className="text-tertiary shrink-0">[14:32:10]</span>
                      <span className="text-on-surface">
                        <strong className="text-secondary">TRADE ALERT:</strong> Dallas Mavericks troca escolha de 1ª rodada de 2026 por profundidade de ala.
                      </span>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <span className="text-tertiary shrink-0">[13:05:44]</span>
                      <span className="text-on-surface">
                        <strong className="text-error">INJURY UPDATE:</strong> Joel Embiid (Philadelphia 76ers) listado day-to-day com dores no joelho.
                      </span>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <span className="text-tertiary shrink-0">[11:20:18]</span>
                      <span className="text-on-surface">
                        <strong className="text-primary">GAME HIGHLIGHT:</strong> {playerName} registra {playerPpg} PTS e {playerRpg} REB em vitória consistente.
                      </span>
                    </div>
                    {newsFeed && newsFeed.length > 0 && (
                      <div className="flex items-start gap-space-sm border-t border-outline-variant/30 pt-1 mt-1">
                        <span className="text-tertiary shrink-0">[RECENTE]</span>
                        <span className="text-on-surface">
                          <strong className="text-primary">{newsFeed[0].headline}:</strong> {newsFeed[0].content}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* COLUNA 3: LÍDERES DE PONTUAÇÃO & SCOUTING MULTILIGA (Cols 9-12) */}
              <div className="col-span-12 xl:col-span-3 flex flex-col gap-space-lg">
                {/* Scoring Leaders */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-md border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-tertiary text-[20px]">workspace_premium</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface uppercase">LÍDERES DE PONTUAÇÃO (NBA)</span>
                    </div>
                    <span className="font-stat-mono-sm text-stat-mono-sm text-tertiary">PPG RACE</span>
                  </div>

                  <div className="flex flex-col gap-space-xs">
                    <div className="bg-surface-container p-space-sm rounded flex items-center justify-between hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center font-stat-mono-md text-stat-mono-md text-on-surface-variant font-bold">1</span>
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md font-bold text-on-surface leading-tight">Luka Dončić</span>
                          <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">DAL • PG</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-stat-mono-md text-stat-mono-md text-tertiary font-bold leading-none">34.2</span>
                        <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">49.1% FG</span>
                      </div>
                    </div>

                    {/* Rank 2: User Highlighted */}
                    <div className="bg-secondary-container/40 p-space-sm rounded flex items-center justify-between shadow-[0_0_14px_rgba(0,214,89,0.2)] border border-primary/30">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-stat-mono-md text-stat-mono-md font-bold">2</span>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-body-md text-body-md font-bold text-primary leading-tight">{playerName}</span>
                            <span className="material-symbols-outlined text-primary text-[14px]">local_fire_department</span>
                          </div>
                          <span className="font-stat-mono-sm text-stat-mono-sm text-secondary">{playerTeamAbbr} • {playerPos} (VOCÊ)</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-stat-mono-md text-stat-mono-md text-primary font-bold leading-none">{playerPpg}</span>
                        <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface">51.4% | 41.2% 3P</span>
                      </div>
                    </div>

                    <div className="bg-surface-container p-space-sm rounded flex items-center justify-between hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center font-stat-mono-md text-stat-mono-md text-on-surface-variant font-bold">3</span>
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md font-bold text-on-surface leading-tight">Shai Gilgeous-Alex.</span>
                          <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">OKC • PG</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-stat-mono-md text-stat-mono-md text-on-surface font-bold leading-none">29.5</span>
                        <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">53.8% FG</span>
                      </div>
                    </div>

                    <div className="bg-surface-container p-space-sm rounded flex items-center justify-between hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-space-sm">
                        <span className="w-6 h-6 rounded bg-surface-container-highest flex items-center justify-center font-stat-mono-md text-stat-mono-md text-on-surface-variant font-bold">4</span>
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md font-bold text-on-surface leading-tight">Giannis Antetokounmpo</span>
                          <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">MIL • PF</span>
                        </div>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-stat-mono-md text-stat-mono-md text-on-surface font-bold leading-none">28.9</span>
                        <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">61.2% FG</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multiliga Explorer: NCAA & G-LEAGUE */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-md border border-outline-variant/30 flex-1">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">lan</span>
                      <span className="font-headline-sm text-headline-sm text-on-surface uppercase">OUTRAS LIGAS</span>
                    </div>
                    <span className="font-stat-mono-sm text-stat-mono-sm text-on-surface-variant">SCOUT HUB</span>
                  </div>

                  {/* Switcher Buttons */}
                  <div className="grid grid-cols-2 gap-space-xs bg-surface-container-lowest p-1 rounded">
                    <button 
                      onClick={() => setActiveLeagueTab('ncaa')}
                      className={`py-1 px-space-xs rounded font-label-caps text-label-caps uppercase transition-all cursor-pointer ${
                        activeLeagueTab === 'ncaa'
                          ? 'bg-surface-container text-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      NCAA DIV I
                    </button>
                    <button 
                      onClick={() => setActiveLeagueTab('gleague')}
                      className={`py-1 px-space-xs rounded font-label-caps text-label-caps uppercase transition-all cursor-pointer ${
                        activeLeagueTab === 'gleague'
                          ? 'bg-surface-container text-primary font-bold shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      NBA G-LEAGUE
                    </button>
                  </div>

                  {/* Tab NCAA */}
                  {activeLeagueTab === 'ncaa' && (
                    <div className="flex flex-col gap-space-xs animate-fadeIn">
                      <span className="font-label-caps text-label-caps text-tertiary uppercase mt-1">TOP RANKED COLLEGES • AP TOP 25</span>
                      
                      <div className="flex items-center justify-between p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors font-body-sm text-body-sm">
                        <div className="flex items-center gap-space-sm">
                          <span className="w-5 h-5 rounded-full bg-blue-900 text-tertiary font-stat-mono-sm text-center font-bold flex items-center justify-center">D</span>
                          <div className="flex flex-col">
                            <span className="text-on-surface font-semibold">Duke Blue Devils</span>
                            <span className="text-on-surface-variant font-stat-mono-sm text-[10px]">ACC • Rank #1</span>
                          </div>
                        </div>
                        <div className="text-right font-stat-mono-sm text-stat-mono-sm">
                          <span className="text-primary font-bold">22-4</span>
                          <div className="text-on-surface-variant text-[10px]">Net: +16.2</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors font-body-sm text-body-sm">
                        <div className="flex items-center gap-space-sm">
                          <span className="w-5 h-5 rounded-full bg-cyan-900 text-on-surface font-stat-mono-sm text-center font-bold flex items-center justify-center">NC</span>
                          <div className="flex flex-col">
                            <span className="text-on-surface font-semibold">North Carolina (UNC)</span>
                            <span className="text-on-surface-variant font-stat-mono-sm text-[10px]">ACC • Rank #2</span>
                          </div>
                        </div>
                        <div className="text-right font-stat-mono-sm text-stat-mono-sm">
                          <span className="text-on-surface font-bold">21-5</span>
                          <div className="text-on-surface-variant text-[10px]">Net: +14.8</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors font-body-sm text-body-sm">
                        <div className="flex items-center gap-space-sm">
                          <span className="w-5 h-5 rounded-full bg-blue-800 text-on-surface font-stat-mono-sm text-center font-bold flex items-center justify-center">UK</span>
                          <div className="flex flex-col">
                            <span className="text-on-surface font-semibold">Kentucky Wildcats</span>
                            <span className="text-on-surface-variant font-stat-mono-sm text-[10px]">SEC • Rank #1</span>
                          </div>
                        </div>
                        <div className="text-right font-stat-mono-sm text-stat-mono-sm">
                          <span className="text-on-surface font-bold">20-6</span>
                          <div className="text-on-surface-variant text-[10px]">Net: +12.5</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab G-LEAGUE */}
                  {activeLeagueTab === 'gleague' && (
                    <div className="flex flex-col gap-space-xs animate-fadeIn">
                      <span className="font-label-caps text-label-caps text-secondary uppercase mt-1">DEVELOPMENT STANDINGS • PRO PROSPECTS</span>
                      
                      <div className="flex items-center justify-between p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors font-body-sm text-body-sm">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-primary text-[16px]">sports_volleyball</span>
                          <div className="flex flex-col">
                            <span className="text-on-surface font-semibold">Maine Celtics</span>
                            <span className="text-primary font-stat-mono-sm text-[10px]">BOS Affiliate</span>
                          </div>
                        </div>
                        <div className="text-right font-stat-mono-sm text-stat-mono-sm">
                          <span className="text-primary font-bold">19-9</span>
                          <div className="text-on-surface-variant text-[10px]">.679</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-space-xs rounded bg-surface-container hover:bg-surface-container-high transition-colors font-body-sm text-body-sm">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-tertiary text-[16px]">electric_bolt</span>
                          <div className="flex flex-col">
                            <span className="text-on-surface font-semibold">G League Ignite</span>
                            <span className="text-on-surface-variant font-stat-mono-sm text-[10px]">Elite Select Path</span>
                          </div>
                        </div>
                        <div className="text-right font-stat-mono-sm text-stat-mono-sm">
                          <span className="text-on-surface font-bold">18-10</span>
                          <div className="text-on-surface-variant text-[10px]">.643</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-auto pt-space-xs">
                    <button 
                      onClick={() => alert("Central de Scouting completa em desenvolvimento...")}
                      className="w-full py-space-xs bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface rounded font-label-caps text-label-caps uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">search</span>
                      <span>ABRIR CENTRAL DE SCOUTING COMPLETA</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* SEÇÃO INFERIOR: HUB DE CARREIRA - HISTÓRICO TEMPORADA A TEMPORADA */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-xl border border-outline-variant/30">
              <div className="flex items-center justify-between flex-wrap gap-space-sm border-b-0 pb-space-xs">
                <div className="flex items-center gap-space-sm">
                  <span className="p-space-xs rounded bg-tertiary text-on-tertiary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">military_tech</span>
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-headline-xl text-headline-xl text-on-surface uppercase tracking-tight leading-none">
                      HUB DE CARREIRA: HISTÓRICO TEMPORADA A TEMPORADA
                    </h3>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Registro Oficial de Telemetria • Do College ao Estrelato NBA • {playerName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-md">
                  <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container font-stat-mono-sm text-stat-mono-sm">
                    <span className="text-on-surface-variant uppercase">TOTAL CAREER PTS:</span>
                    <span className="text-primary font-bold">6,124</span>
                  </div>
                  <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container font-stat-mono-sm text-stat-mono-sm">
                    <span className="text-on-surface-variant uppercase">ACCOLADES:</span>
                    <span className="text-tertiary font-bold">7 AWARDS</span>
                  </div>
                </div>
              </div>

              {/* Tabela do Histórico de Carreira */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-lowest font-label-caps text-label-caps text-on-surface-variant uppercase">
                      <th className="py-2.5 px-3">SEASON</th>
                      <th className="py-2.5 px-3">LEAGUE</th>
                      <th className="py-2.5 px-3">TEAM / AFFILIATE</th>
                      <th className="py-2.5 px-3 text-right">GP</th>
                      <th className="py-2.5 px-3 text-right">MIN</th>
                      <th className="py-2.5 px-3 text-right">PTS</th>
                      <th className="py-2.5 px-3 text-right">REB</th>
                      <th className="py-2.5 px-3 text-right">AST</th>
                      <th className="py-2.5 px-3 text-right">STL</th>
                      <th className="py-2.5 px-3 text-right">BLK</th>
                      <th className="py-2.5 px-3 text-right">FG%</th>
                      <th className="py-2.5 px-3 text-right">3P%</th>
                      <th className="py-2.5 px-3 text-right">FT%</th>
                      <th className="py-2.5 px-4">AWARDS & ACCOMPLISHMENTS</th>
                    </tr>
                  </thead>
                  <tbody className="font-stat-mono-sm text-stat-mono-sm divide-y-0">
                    {/* NCAA Duke */}
                    <tr className="bg-surface-container-low/60 hover:bg-surface-container transition-colors">
                      <td className="py-2 px-3 text-on-surface-variant font-bold">2020-21</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-tertiary font-label-caps text-label-caps">NCAA</span>
                      </td>
                      <td className="py-2 px-3 font-body-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Duke Blue Devils
                      </td>
                      <td className="py-2 px-3 text-right text-on-surface font-bold">30</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">32.4</td>
                      <td className="py-2 px-3 text-right font-bold text-tertiary">21.2</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">6.8</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">3.5</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">1.4</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">0.8</td>
                      <td className="py-2 px-3 text-right text-on-surface">48.6%</td>
                      <td className="py-2 px-3 text-right text-on-surface">38.5%</td>
                      <td className="py-2 px-3 text-right text-on-surface">82.1%</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-space-xs flex-wrap font-body-sm text-body-sm">
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary/15 text-tertiary font-bold text-[11px]">
                            🏆 NCAA Final Four MOP
                          </span>
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface text-[11px]">
                            Consensus All-American 1st Team
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* G-League Maine */}
                    <tr className="bg-surface-container-lowest/30 hover:bg-surface-container transition-colors">
                      <td className="py-2 px-3 text-on-surface-variant font-bold">2021-22</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary font-label-caps text-label-caps">G-LEAGUE</span>
                      </td>
                      <td className="py-2 px-3 font-body-sm font-semibold text-on-surface flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span> Maine Celtics
                      </td>
                      <td className="py-2 px-3 text-right text-on-surface font-bold">18</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">34.0</td>
                      <td className="py-2 px-3 text-right font-bold text-secondary">24.5</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">7.1</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">4.2</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">1.8</td>
                      <td className="py-2 px-3 text-right text-on-surface-variant">1.1</td>
                      <td className="py-2 px-3 text-right text-on-surface">50.2%</td>
                      <td className="py-2 px-3 text-right text-on-surface">39.8%</td>
                      <td className="py-2 px-3 text-right text-on-surface">84.5%</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-space-xs flex-wrap font-body-sm text-body-sm">
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-secondary/15 text-secondary font-bold text-[11px]">
                            🏆 G-League All-Rookie 1st
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* 2024-25 Current Season */}
                    <tr className="bg-secondary-container/25 text-on-surface hover:bg-secondary-container/35 transition-colors">
                      <td className="py-2.5 px-3 text-primary font-bold flex items-center gap-1">
                        <span>2024-25</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary font-label-caps text-label-caps font-bold">NBA CURRENT</span>
                      </td>
                      <td className="py-2.5 px-3 font-body-sm font-bold text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">sports_basketball</span> {playerTeamName}
                      </td>
                      <td className="py-2.5 px-3 text-right text-primary font-bold">{56 + demoSimulatedGames}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface font-semibold">36.1</td>
                      <td className="py-2.5 px-3 text-right font-bold text-primary text-stat-mono-md">{playerPpg}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface font-semibold">{playerRpg}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface font-semibold">{playerApg}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface font-semibold">1.6</td>
                      <td className="py-2.5 px-3 text-right text-on-surface font-semibold">1.0</td>
                      <td className="py-2.5 px-3 text-right text-primary font-bold">51.4%</td>
                      <td className="py-2.5 px-3 text-right text-primary font-bold">41.2%</td>
                      <td className="py-2.5 px-3 text-right text-primary font-bold">88.6%</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-space-xs flex-wrap font-body-sm text-body-sm">
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-tertiary text-on-tertiary-fixed font-bold text-[11px] shadow-[0_0_8px_rgba(255,206,118,0.4)]">
                            🏆 MVP CANDIDATE TOP-3
                          </span>
                          <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-primary/20 text-primary font-bold text-[11px]">
                            Scoring Title Contender (#2)
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

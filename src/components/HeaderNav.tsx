import React, { useRef } from 'react';
import { useGameStore, ScreenType } from '../store/gameStore';
import { TeamLogo } from './TeamLogo';
import { getTeamById } from '../data/teamsRepository';
import { 
  Trophy, 
  BarChart3, 
  Activity, 
  Calendar, 
  Save, 
  Download, 
  Upload, 
  RotateCcw
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { 
    player, 
    currentScreen, 
    setScreen, 
    saveToIndexedDb, 
    exportSave, 
    importSave, 
    resetGame 
  } = useGameStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!player) return null;

  const currentTeam = getTeamById(player.currentTeamId);

  const handleSave = async () => {
    await saveToIndexedDb();
    alert('Progresso da carreira salvo com sucesso no IndexedDB!');
  };

  const handleExport = () => {
    const json = exportSave();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BasketballRun_${player.fullName.replace(/\s+/g, '_')}_${player.currentLeague}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importSave(content);
        if (ok) {
          alert('Carreira importada com sucesso!');
        } else {
          alert('Falha ao importar o save: arquivo inválido.');
        }
      }
    };
    reader.readAsText(file);
  };

  const navItems: { screen: ScreenType; label: string; icon: React.ReactNode }[] = [
    { screen: 'DASHBOARD', label: 'Painel Central', icon: <Activity className="w-4 h-4" /> },
    { screen: 'BOX_SCORE', label: 'Último Jogo', icon: <Calendar className="w-4 h-4" /> },
    { screen: 'CAREER_HISTORY', label: 'Arquivo & Troféus', icon: <Trophy className="w-4 h-4" /> },
    { screen: 'LEAGUE_STANDINGS', label: 'Central da Liga', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0c0f]/95 backdrop-blur-md border-b border-[#2b3345] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Atleta Ativo & Time */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {currentTeam && (
              <TeamLogo team={currentTeam} size="sm" className="rounded bg-black/40 p-1 border border-[#2b3345]" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-condensed font-black tracking-wider text-lg uppercase text-white">
                  {player.fullName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-[#1c222e] text-[#8a96a8] border border-[#2b3345]">
                  {player.position} · {player.overall} OVR
                </span>
              </div>
              <div className="text-xs font-mono text-[#8a96a8] flex items-center gap-2">
                <span className="font-semibold text-team-primary">{currentTeam?.shortName}</span>
                <span>•</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
                  {player.currentLeague}
                </span>
                <span>•</span>
                <span>{player.age} anos</span>
              </div>
            </div>
          </div>

          {/* Botões mobile de save */}
          <div className="flex md:hidden items-center gap-1.5">
            <button 
              onClick={handleSave} 
              className="p-1.5 bg-[#1c222e] text-white rounded hover:bg-[#2b3345]" 
              title="Salvar Carreira"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <nav className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {navItems.map(item => {
            const isActive = currentScreen === item.screen;
            return (
              <button
                key={item.screen}
                onClick={() => setScreen(item.screen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-condensed uppercase tracking-wider font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-team-primary text-team-contrast shadow-team-glow'
                    : 'bg-[#13171f] text-[#8a96a8] hover:text-white hover:bg-[#1c222e] border border-[#2b3345]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Ações Globais: Save, Export, Import, Reset */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#13171f] hover:bg-[#1c222e] border border-[#2b3345] text-xs font-mono text-[#f0f3f8] rounded transition-colors"
            title="Salvar no IndexedDB"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            Salvar
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#13171f] hover:bg-[#1c222e] border border-[#2b3345] text-xs font-mono text-[#f0f3f8] rounded transition-colors"
            title="Exportar Save JSON"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Exportar
          </button>

          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#13171f] hover:bg-[#1c222e] border border-[#2b3345] text-xs font-mono text-[#f0f3f8] rounded transition-colors"
            title="Importar Save JSON"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            Importar
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => {
              if (confirm('Tem certeza de que deseja iniciar uma nova carreira?')) {
                resetGame();
              }
            }}
            className="p-1.5 bg-[#13171f] hover:bg-red-950/60 border border-red-900/40 text-red-400 rounded transition-colors"
            title="Nova Carreira"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

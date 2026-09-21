import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { HeaderNav } from './components/HeaderNav';
import { PlayerCreationScreen } from './components/PlayerCreationScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { BoxScoreScreen } from './components/BoxScoreScreen';
import { CareerHistoryScreen } from './components/CareerHistoryScreen';
import { StandingsScreen } from './components/StandingsScreen';
import { CareerShopScreen } from './components/CareerShopScreen';
import { DraftCeremonyModal } from './components/DraftCeremonyModal';
import { RetirementCeremonyModal } from './components/RetirementCeremonyModal';
import { SeasonEndRecapModal } from './components/SeasonEndRecapModal';
import { EventModal } from './components/EventModal';
import { AwardsCeremonyModal } from './components/AwardsCeremonyModal';
import { PlayoffsModal } from './components/PlayoffsModal';
import { ContractOffersModal } from './components/ContractOffersModal';
import { HoopLegacyTestDashboard } from './components/HoopLegacyTestDashboard';

export const App: React.FC = () => {
  const { player, currentScreen, loadFromIndexedDb } = useGameStore();
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'classic') return false;
    return true; // Test mode active by default for immediate evaluation
  });

  useEffect(() => {
    async function initDb() {
      try {
        await loadFromIndexedDb();
      } catch (err) {
        console.warn('Nenhum save prévio detectado no IndexedDB:', err);
      } finally {
        setHasAttemptedLoad(true);
      }
    }
    initDb();
  }, [loadFromIndexedDb]);

  if (isTestMode) {
    return <HoopLegacyTestDashboard onBackToClassic={() => setIsTestMode(false)} />;
  }

  if (!hasAttemptedLoad) {
    return (
      <div className="min-h-screen bg-[#0a0c0f] flex items-center justify-center font-mono text-xs text-[#8a96a8]">
        Inicializando banco de dados de simulação...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c0f] text-[#f0f3f8] relative">
      {/* Botão Flutuante para Retornar ao Teste do Novo Visual */}
      <button
        onClick={() => setIsTestMode(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#00d659] hover:bg-[#42f372] text-[#003912] font-condensed font-black px-4 py-2.5 rounded-lg shadow-[0_0_20px_rgba(0,214,89,0.5)] flex items-center gap-2 text-sm uppercase tracking-wider transition-all transform hover:scale-105 cursor-pointer"
      >
        <span className="text-base">🧪</span>
        <span>Ver Novo Visual (Stitch v2.4)</span>
      </button>

      {/* Navegação Superior */}
      {player && <HeaderNav />}

      {/* Roteamento de Telas */}
      <main className="flex-1">
        {!player || currentScreen === 'CREATE_PLAYER' ? (
          <PlayerCreationScreen />
        ) : (
          <>
            {currentScreen === 'DASHBOARD' && <DashboardScreen />}
            {currentScreen === 'BOX_SCORE' && <BoxScoreScreen />}
            {currentScreen === 'CAREER_HISTORY' && <CareerHistoryScreen />}
            {currentScreen === 'LEAGUE_STANDINGS' && <StandingsScreen />}
            {currentScreen === 'CAREER_SHOP' && <CareerShopScreen />}
          </>
        )}
      </main>

      {/* Modais Globais de Ciclo de Vida */}
      {currentScreen === 'DRAFT_CEREMONY' && <DraftCeremonyModal />}
      {currentScreen === 'RETIREMENT' && <RetirementCeremonyModal />}
      <SeasonEndRecapModal />
      <EventModal />
      <PlayoffsModal />
      <AwardsCeremonyModal />
      <ContractOffersModal />

      {/* Rodapé Informativo */}
      <footer className="border-t border-[#2b3345] py-4 px-4 text-center font-mono text-[11px] text-[#8a96a8] bg-[#0a0c0f]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Basketball Run · Simulador de Carreira Profissional (NCAA → G-League → NBA → Hall da Fama)</span>
          <span className="text-[#8a96a8]/70">Motor Matemático Baseado em Posses · Theming Dinâmico · IndexedDB</span>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React from 'react';
import { useGameStore } from '../store/gameStore';
import { calculateHallOfFameProbability } from '../engine/hallOfFame';
import { Crown, Trophy, Award, Sparkles, CheckCircle2, XCircle, RotateCcw, Download } from 'lucide-react';

export const RetirementCeremonyModal: React.FC = () => {
  const { player, resetGame, exportSave } = useGameStore();

  if (!player) return null;

  const peakWS = player.careerRecord.peakWinShares || 0;
  const hof = calculateHallOfFameProbability({
    heightInches: player.heightInches,
    championships: player.careerRecord.championships,
    leaderboardPts: player.careerRecord.leaderboardPoints,
    peakWS,
    allStarSelections: player.careerRecord.allStarSelections,
  });

  const handleDownloadLegacy = () => {
    const json = exportSave();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Memorial_HallOfFame_${player.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#13171f] border-2 border-amber-500/80 rounded-2xl max-w-3xl w-full p-6 md:p-8 shadow-2xl space-y-6 my-8">
        {/* Cabeçalho Memorial */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-mono font-bold uppercase tracking-wider">
            <Crown className="w-4 h-4" />
            Naismith Memorial Basketball Hall of Fame — Cerimônia Oficial
          </div>
          <h1 className="text-4xl md:text-5xl font-condensed font-black uppercase text-white tracking-wide">
            Aposentadoria de {player.fullName}
          </h1>
          <p className="text-sm font-mono text-[#8a96a8]">
            Após uma trajetória de {player.careerStats.length} temporadas e dedicação ao esporte da bola laranja.
          </p>
        </div>

        {/* Resumo de Conquistas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-3 rounded-xl">
            <Trophy className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.championships}</div>
            <div className="text-[10px] font-condensed uppercase text-[#8a96a8]">Anéis de Campeão</div>
          </div>
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-3 rounded-xl">
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.mvps}</div>
            <div className="text-[10px] font-condensed uppercase text-[#8a96a8]">Prêmios de MVP</div>
          </div>
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-black text-white">{player.careerRecord.allStarSelections}</div>
            <div className="text-[10px] font-condensed uppercase text-[#8a96a8]">All-Star Selections</div>
          </div>
          <div className="bg-[#0a0c0f] border border-[#2b3345] p-3 rounded-xl">
            <Crown className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <div className="text-2xl font-mono font-black text-white">{peakWS}</div>
            <div className="text-[10px] font-condensed uppercase text-[#8a96a8]">Pico de Win Shares</div>
          </div>
        </div>

        {/* Modelo Matemático de Regressão Logística */}
        <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-xl p-5 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#2b3345] pb-2">
            <span className="text-amber-400 font-bold uppercase">
              Equação Oficial de Regressão Logística (Basketball Reference)
            </span>
            <span className="text-[#8a96a8]">Corte Oficial: 50.0%</span>
          </div>

          <div className="bg-[#13171f] p-3 rounded border border-[#1c222e] text-[#8a96a8] leading-relaxed break-all">
            z = -0.20303 - (0.14203 × {player.heightInches}") + (0.80573 × {player.careerRecord.championships}) + (0.01594 × {player.careerRecord.leaderboardPoints}) + (0.41568 × {peakWS}) + (1.02443 × {player.careerRecord.allStarSelections})
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex justify-between bg-[#13171f] p-2 rounded">
              <span className="text-[#8a96a8]">Expoente Linear (z):</span>
              <span className="text-white font-bold">{hof.zScore}</span>
            </div>
            <div className="flex justify-between bg-[#13171f] p-2 rounded">
              <span className="text-[#8a96a8]">Probabilidade P(HoF):</span>
              <span className="text-amber-400 font-black text-sm">{hof.probability}%</span>
            </div>
          </div>
        </div>

        {/* Veredito Solene */}
        <div className={`p-6 rounded-2xl border-2 text-center space-y-2 ${
          hof.isInducted 
            ? 'bg-amber-950/30 border-amber-500 shadow-team-glow' 
            : 'bg-[#1c222e]/40 border-[#2b3345]'
        }`}>
          {hof.isInducted ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-3xl font-condensed font-black uppercase text-amber-300 tracking-wide">
                Entronizado no Hall da Fama do Basquetebol!
              </h2>
              <p className="text-xs font-mono text-[#f0f3f8] max-w-lg mx-auto">
                Parabéns! Sua carreira lendária atingiu os critérios estatísticos rigorosos e você foi imortalizado entre os maiores da história do esporte mundial em Springfield, Massachusetts.
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-12 h-12 text-[#8a96a8] mx-auto" />
              <h2 className="text-2xl font-condensed font-black uppercase text-white tracking-wide">
                Carreira Respeitável na NBA
              </h2>
              <p className="text-xs font-mono text-[#8a96a8] max-w-lg mx-auto">
                Sua marca foi gravada na história da liga, mesmo sem atingir a probabilidade matemática mínima de 50.0% para indução imediata ao Memorial Hall of Fame.
              </p>
            </>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleDownloadLegacy}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#1c222e] hover:bg-[#2b3345] text-white border border-[#2b3345] font-condensed font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Baixar Arquivo Memorial da Carreira (JSON)
          </button>

          <button
            onClick={resetGame}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-team-primary hover:opacity-90 text-white font-condensed font-black uppercase tracking-wider text-sm shadow-team-glow transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Iniciar Nova Carreira
          </button>
        </div>
      </div>
    </div>
  );
};

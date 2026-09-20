import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { Position, Archetype, CountryInfo } from '../types';
import { COUNTRIES, DEFAULT_COUNTRY } from '../data/countries';
import { ARCHETYPES, combineArchetypes } from '../data/archetypes';
import { NCAA_TEAMS } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { 
  User, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Dices,
  Sparkles,
  Globe,
  Sliders
} from 'lucide-react';

export function pickRandomNcaaTeams(count = 4) {
  return [...NCAA_TEAMS].sort(() => Math.random() - 0.5).slice(0, count);
}

export const PlayerCreationScreen: React.FC = () => {
  const { createNewPlayer } = useGameStore();

  const [firstName, setFirstName] = useState('Lucas');
  const [lastName, setLastName] = useState('Silva');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(DEFAULT_COUNTRY);
  const [position, setPosition] = useState<Position>('PG');
  
  // Altura em polegadas padrão por posição
  const defaultHeightByPos: Record<Position, number> = {
    PG: 75, // 6'3"
    SG: 78, // 6'6"
    SF: 80, // 6'8"
    PF: 82, // 6'10"
    C: 84,  // 7'0"
  };
  const [heightInches, setHeightInches] = useState<number>(defaultHeightByPos['PG']);

  const [primaryArchetype, setPrimaryArchetype] = useState<Archetype>('PLAYMAKER');
  const [secondaryArchetype, setSecondaryArchetype] = useState<Archetype>('SHARPSHOOTER');

  // Sorteio de 4 equipes aleatórias da NCAA
  const [ncaaChoices, setNcaaChoices] = useState<typeof NCAA_TEAMS>(() => pickRandomNcaaTeams(4));
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(() => ncaaChoices[0]?.id || 'duke-blue-devils');

  const handleRerollNcaa = () => {
    const shuffled = pickRandomNcaaTeams(4);
    setNcaaChoices(shuffled);
    setSelectedCollegeId(shuffled[0].id);
  };

  const handlePositionChange = (pos: Position) => {
    setPosition(pos);
    setHeightInches(defaultHeightByPos[pos]);
  };

  // Cálculo automático arcade da fusão de arquétipos
  const hybridResult = useMemo(() => {
    return combineArchetypes(primaryArchetype, secondaryArchetype, position);
  }, [primaryArchetype, secondaryArchetype, position]);

  const feet = Math.floor(heightInches / 12);
  const inches = heightInches % 12;
  const cm = Math.round(heightInches * 2.54);

  const handleStartCareer = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Por favor, informe seu nome e sobrenome.');
      return;
    }

    const estimatedWeight = Math.round(180 + (heightInches - 72) * 6.5);
    const estimatedWingspan = heightInches + 4;

    createNewPlayer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      country: selectedCountry,
      position,
      primaryArchetype,
      secondaryArchetype,
      heightInches,
      weightLbs: estimatedWeight,
      wingspanInches: estimatedWingspan,
      initialAttributes: hybridResult.attributes,
      collegeTeamId: selectedCollegeId,
    });
  };

  const archetypeList = Object.values(ARCHETYPES);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Cabeçalho Arcade */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-team-primary/20 border border-team-primary text-team-primary text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Modo Carreira Arcade · Criação Ágil
        </div>
        <h1 className="text-4xl md:text-5xl font-condensed font-black uppercase tracking-tight text-white">
          Crie sua Lenda do Basquete
        </h1>
        <p className="text-sm text-[#8a96a8] max-w-xl mx-auto mt-1">
          Sem complicações: escolha seu país, posição, tamanho e combine 2 arquétipos para definir seu estilo em quadra.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Identidade, País & Posição */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: Identidade & Nacionalidade */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl space-y-4">
            <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-team-primary" />
              1. Identidade & Nacionalidade
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#8a96a8] mb-1">Primeiro Nome</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded-lg px-3 py-2 text-white font-medium focus:border-team-primary focus:outline-none"
                  placeholder="Lucas"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#8a96a8] mb-1">Sobrenome</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded-lg px-3 py-2 text-white font-medium focus:border-team-primary focus:outline-none"
                  placeholder="Silva"
                />
              </div>
            </div>

            {/* Seleção do País */}
            <div>
              <label className="block text-xs font-mono text-[#8a96a8] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-team-primary" />
                País que você representa
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                {COUNTRIES.map(c => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'bg-team-primary/20 border-team-primary text-white shadow-team-glow font-bold'
                          : 'bg-[#0a0c0f] border-[#2b3345] text-[#8a96a8] hover:text-white hover:border-[#3d475d]'
                      }`}
                    >
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Posição & Altura */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl space-y-4">
            <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-team-primary" />
              2. Posição & Tamanho
            </h2>

            {/* Posição em Quadra */}
            <div>
              <label className="block text-xs font-mono text-[#8a96a8] mb-1.5">Posição Tática</label>
              <div className="grid grid-cols-5 gap-2">
                {(['PG', 'SG', 'SF', 'PF', 'C'] as Position[]).map(pos => {
                  const isSelected = position === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => handlePositionChange(pos)}
                      className={`py-2.5 text-xs font-condensed font-black tracking-wider rounded-lg transition-all ${
                        isSelected
                          ? 'bg-team-primary text-white shadow-team-glow scale-105'
                          : 'bg-[#0a0c0f] text-[#8a96a8] hover:text-white border border-[#2b3345]'
                      }`}
                    >
                      {pos}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider de Altura */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-[#8a96a8]">Altura do Atleta:</span>
                <span className="text-white font-bold text-sm">
                  {feet}'{inches}" <span className="text-[#8a96a8] font-normal">({cm} cm)</span>
                </span>
              </div>
              <input
                type="range"
                min={70} // 5'10"
                max={88} // 7'4"
                value={heightInches}
                onChange={e => setHeightInches(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#8a96a8] mt-1">
                <span>5'10" (178 cm)</span>
                <span>Armador Rápido</span>
                <span>Pivô Gigante</span>
                <span>7'4" (224 cm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Arquétipos Duplos & Ofertas da NCAA */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 3: Arquétipos Duplos (Primário + Secundário) */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b3345] pb-2">
              <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white">
                3. Arquétipos Duplos (Estilo de Jogo)
              </h2>
              <div className="px-2.5 py-0.5 rounded bg-team-primary text-team-contrast text-xs font-mono font-black">
                {hybridResult.overall} OVR
              </div>
            </div>

            {/* Selo do Estilo Híbrido */}
            <div className="bg-[#0a0c0f] border border-team-primary/50 p-3 rounded-lg flex items-center justify-between shadow-team-glow">
              <div>
                <span className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8] block">
                  Perfil de Atributos Automático
                </span>
                <span className="text-base font-condensed font-black uppercase text-amber-400">
                  {hybridResult.hybridTitle}
                </span>
              </div>
              <div className="text-right text-xs font-mono text-[#8a96a8]">
                {selectedCountry.flag} {position} · {feet}'{inches}"
              </div>
            </div>

            {/* Seletor Arquétipo Primário */}
            <div>
              <label className="block text-xs font-mono text-team-primary font-bold mb-1">
                ⭐ Arquétipo Primário (Base de Jogo - 65%)
              </label>
              <select
                value={primaryArchetype}
                onChange={e => setPrimaryArchetype(e.target.value as Archetype)}
                className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-team-primary focus:outline-none"
              >
                {archetypeList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.tagline}
                  </option>
                ))}
              </select>
            </div>

            {/* Seletor Arquétipo Secundário */}
            <div>
              <label className="block text-xs font-mono text-blue-400 font-bold mb-1">
                ✨ Arquétipo Secundário (Arma Complementar - 35%)
              </label>
              <select
                value={secondaryArchetype}
                onChange={e => setSecondaryArchetype(e.target.value as Archetype)}
                className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-team-primary focus:outline-none"
              >
                {archetypeList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.tagline}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Card 4: 4 Ofertas Sorteadas da NCAA */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b3345] pb-2">
              <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                4. Suas 4 Ofertas de Bolsa da NCAA
              </h2>
              <button
                type="button"
                onClick={handleRerollNcaa}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1c222e] hover:bg-[#2b3345] text-amber-400 border border-[#2b3345] text-xs font-mono transition-all"
                title="Sortear 4 novas universidades"
              >
                <Dices className="w-3.5 h-3.5" />
                Re-sortear
              </button>
            </div>

            <p className="text-xs text-[#8a96a8]">
              Esses 4 renomados programas universitários ofereceram bolsa de estudos integral para o seu ano de calouro:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ncaaChoices.map(college => {
                const isSelected = selectedCollegeId === college.id;
                return (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() => setSelectedCollegeId(college.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-[#1c222e] border-team-primary shadow-team-glow'
                        : 'bg-[#0a0c0f] border-[#2b3345] hover:border-[#3d475d]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <TeamLogo team={college} size="sm" />
                      <div>
                        <div className="font-condensed font-bold uppercase text-xs text-white">
                          {college.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#8a96a8]">
                          {college.conference} · Prestígio: {college.prestige}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botão Gigante de Conclusão */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartCareer}
                className="w-full py-3.5 px-4 rounded-xl bg-team-primary text-white font-condensed font-black uppercase tracking-wider text-base hover:opacity-95 shadow-team-glow transition-all flex items-center justify-center gap-2"
              >
                Assinar Bolsa & Iniciar Carreira na NCAA
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

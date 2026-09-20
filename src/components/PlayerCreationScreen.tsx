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
  Sliders,
  Search
} from 'lucide-react';

export function pickRandomNcaaTeams(count = 4) {
  return [...NCAA_TEAMS].sort(() => Math.random() - 0.5).slice(0, count);
}

export const PlayerCreationScreen: React.FC = () => {
  const { createNewPlayer } = useGameStore();

  const [firstName, setFirstName] = useState('Lucas');
  const [lastName, setLastName] = useState('Silva');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(DEFAULT_COUNTRY);
  const [searchCountry, setSearchCountry] = useState('');
  const [position, setPosition] = useState<Position>('PG');
  
  // Altura padrão por posição
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

  // Sorteio de 4 equipes da NCAA
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

  // Filtragem de países com busca inteligente
  const filteredCountries = useMemo(() => {
    const query = searchCountry.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.code.toLowerCase().includes(query)
    );
  }, [searchCountry]);

  // Fusão arcade de arquétipos
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
  const primDef = ARCHETYPES[primaryArchetype];
  const secDef = ARCHETYPES[secondaryArchetype];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Cabeçalho Arcade */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-team-primary/20 border border-team-primary text-team-primary text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Modo Carreira Arcade 🏀 Criação Ágil
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-condensed font-black uppercase tracking-tight text-white">
          Crie sua Lenda do Basquete
        </h1>
        <p className="text-xs sm:text-sm text-[#8a96a8] max-w-xl mx-auto mt-1 px-2">
          Escolha seu país entre todas as nações do mundo 🌎, combine 2 arquétipos visuais 🎯 e inicie sua jornada rumo ao Hall da Fama!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Coluna Esquerda: Identidade, País & Posição */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Card 1: Identidade & Nacionalidade */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-team-primary" />
              1. Identidade & Nacionalidade
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            {/* Seleção do País com Busca Instantânea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-[#8a96a8] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-team-primary" />
                  País Representado:
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span>{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                </span>
              </div>

              {/* Campo de Busca de País */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-[#8a96a8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchCountry}
                  onChange={e => setSearchCountry(e.target.value)}
                  placeholder="Buscar qualquer país do mundo... (Ex: Brasil, Japão, EUA, Cabo Verde)"
                  className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8a96a8] focus:border-team-primary focus:outline-none"
                />
              </div>

              {/* Grid Rolável de Países */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {filteredCountries.slice(0, 48).map(c => {
                  const isSelected = selectedCountry.code === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCountry(c)}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-xs font-medium transition-all text-left truncate ${
                        isSelected
                          ? 'bg-team-primary/20 border-team-primary text-white shadow-team-glow font-bold'
                          : 'bg-[#0a0c0f] border-[#2b3345] text-[#8a96a8] hover:text-white hover:border-[#3d475d]'
                      }`}
                    >
                      <span className="text-sm shrink-0">{c.flag}</span>
                      <span className="truncate text-[11px]">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 2: Posição & Altura */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
            <h2 className="text-base sm:text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-team-primary" />
              2. Posição Tática & Físico
            </h2>

            {/* Posição em Quadra */}
            <div>
              <label className="block text-xs font-mono text-[#8a96a8] mb-1.5">Posição em Quadra</label>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {(['PG', 'SG', 'SF', 'PF', 'C'] as Position[]).map(pos => {
                  const isSelected = position === pos;
                  return (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => handlePositionChange(pos)}
                      className={`py-2 text-xs font-condensed font-black tracking-wider rounded-lg transition-all ${
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
                <span>Armador Veloz</span>
                <span>Pivô Gigante</span>
                <span>7'4" (224 cm)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Arquétipos Duplos Visuais & Ofertas da NCAA */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          {/* Card 3: Arquétipos Duplos com Estética Visual Rica */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b3345] pb-2">
              <h2 className="text-base sm:text-lg font-condensed font-bold uppercase tracking-wider text-white">
                3. Arquétipos Duplos (Fusão de Estilo)
              </h2>
              <div className="px-2.5 py-0.5 rounded bg-emerald-500 text-black text-xs font-mono font-black shadow-lg shadow-emerald-500/20">
                {hybridResult.overall} OVR
              </div>
            </div>

            {/* Banner de Fusão Visual */}
            <div className="bg-[#0a0c0f] border border-team-primary/50 p-3 rounded-xl flex items-center justify-between shadow-team-glow">
              <div>
                <span className="text-[10px] font-condensed uppercase tracking-wider text-[#8a96a8] block">
                  Identidade do Atleta
                </span>
                <span className="text-base sm:text-lg font-condensed font-black uppercase text-amber-400">
                  {hybridResult.hybridTitle}
                </span>
              </div>
              <div className="text-right text-xs font-mono text-[#8a96a8]">
                {selectedCountry.flag} {position} · {feet}'{inches}"
              </div>
            </div>

            {/* Seletor Arquétipo Primário */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>⭐</span> Arquétipo Primário (65% dos Atributos)
                </span>
                <span className="text-xs">{primDef.emoji}</span>
              </div>
              <select
                value={primaryArchetype}
                onChange={e => setPrimaryArchetype(e.target.value as Archetype)}
                className="w-full bg-[#0a0c0f] border border-amber-500/40 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-amber-400 focus:outline-none"
              >
                {archetypeList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.emoji} {a.name} — {a.tagline}
                  </option>
                ))}
              </select>
              {/* Highlights do estilo */}
              <div className="flex flex-wrap gap-1 mt-1">
                {primDef.playStyleHighlights.map((h, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c222e] text-[#8a96a8] border border-[#2b3345]">
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Seletor Arquétipo Secundário */}
            <div className="space-y-1.5 pt-2 border-t border-[#1c222e]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-400 font-bold flex items-center gap-1">
                  <span>✨</span> Arquétipo Secundário (35% de Complemento)
                </span>
                <span className="text-xs">{secDef.emoji}</span>
              </div>
              <select
                value={secondaryArchetype}
                onChange={e => setSecondaryArchetype(e.target.value as Archetype)}
                className="w-full bg-[#0a0c0f] border border-blue-500/40 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-blue-400 focus:outline-none"
              >
                {archetypeList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.emoji} {a.name} — {a.tagline}
                  </option>
                ))}
              </select>
              {/* Highlights do estilo secundário */}
              <div className="flex flex-wrap gap-1 mt-1">
                {secDef.playStyleHighlights.map((h, i) => (
                  <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c222e] text-[#8a96a8] border border-[#2b3345]">
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: 4 Ofertas Sorteadas da NCAA */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2b3345] pb-2">
              <h2 className="text-base sm:text-lg font-condensed font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                4. Suas 4 Ofertas Universitárias da NCAA
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ncaaChoices.map(college => {
                const isSelected = selectedCollegeId === college.id;
                return (
                  <button
                    key={college.id}
                    type="button"
                    onClick={() => setSelectedCollegeId(college.id)}
                    className={`flex items-center justify-between p-2.5 sm:p-3 rounded-lg border transition-all text-left ${
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

            {/* Botão de Iniciar Carreira */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartCareer}
                className="w-full py-3.5 px-4 rounded-xl bg-team-primary text-team-contrast font-condensed font-black uppercase tracking-wider text-base hover:opacity-95 shadow-team-glow transition-all flex items-center justify-center gap-2"
              >
                Assinar Bolsa & Iniciar Carreira na NCAA 🚀
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

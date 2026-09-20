import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { Position, Archetype, PlayerAttributes } from '../types';
import { NCAA_TEAMS } from '../data/teamsRepository';
import { TeamLogo } from './TeamLogo';
import { calculateOverall } from '../engine/biologicalAging';
import { 
  User, 
  Target, 
  Shield, 
  Zap, 
  Flame, 
  Award, 
  GraduationCap, 
  CheckCircle2, 
  Dumbbell,
  ArrowRight
} from 'lucide-react';

const ARCHETYPES_CONFIG: Record<Archetype, {
  name: string;
  description: string;
  icon: React.ReactNode;
  bonusAttrs: Partial<PlayerAttributes>;
}> = {
  SHARPSHOOTER: {
    name: 'Sharpshooter',
    description: 'Especialista em arremessos do perímetro e espaçamento de quadra. Alta eficiência de 3 pontos e lances livres.',
    icon: <Target className="w-5 h-5 text-amber-400" />,
    bonusAttrs: { threePoint: 86, midRange: 82, freeThrow: 88, clutch: 80 },
  },
  LOCKDOWN_DEFENDER: {
    name: 'Lockdown Defender',
    description: 'Âncora defensiva de elite capaz de neutralizar a principal arma adversária e forçar turnovers.',
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    bonusAttrs: { perimeterDefense: 86, interiorDefense: 80, steal: 82, block: 78, stamina: 85 },
  },
  PLAYMAKER: {
    name: 'Playmaker',
    description: 'Criador tático primário com drible refinado, visão de jogo aguçada e controle absoluto do ritmo.',
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    bonusAttrs: { passing: 88, ballControl: 88, offensiveIQ: 85, speed: 84 },
  },
  SLASHER: {
    name: 'Slasher',
    description: 'Agressor implacável de garrafão com primeiro passo explosivo, infiltrações cortantes e finalizações no aro.',
    icon: <Flame className="w-5 h-5 text-rose-400" />,
    bonusAttrs: { slashing: 88, inside: 84, speed: 86, vertical: 88, acceleration: 86 },
  },
  POST_SCORER: {
    name: 'Post Scorer',
    description: 'Dominador de garrafão com jogo de pés clássico de costas para a cesta, rebotes e força física imponente.',
    icon: <Dumbbell className="w-5 h-5 text-purple-400" />,
    bonusAttrs: { inside: 88, strength: 88, offensiveRebound: 82, defensiveRebound: 85, interiorDefense: 80 },
  },
};

const DEFAULT_BASE_ATTRS: PlayerAttributes = {
  speed: 70,
  acceleration: 70,
  vertical: 70,
  stamina: 75,
  strength: 70,
  inside: 70,
  midRange: 70,
  threePoint: 70,
  freeThrow: 72,
  slashing: 70,
  passing: 70,
  ballControl: 70,
  offensiveIQ: 72,
  defensiveIQ: 72,
  clutch: 70,
  perimeterDefense: 70,
  interiorDefense: 70,
  steal: 68,
  block: 65,
  offensiveRebound: 65,
  defensiveRebound: 68,
};

export const PlayerCreationScreen: React.FC = () => {
  const { createNewPlayer } = useGameStore();

  const [firstName, setFirstName] = useState('Lucas');
  const [lastName, setLastName] = useState('Silva');
  const [position, setPosition] = useState<Position>('PG');
  const [archetype, setArchetype] = useState<Archetype>('PLAYMAKER');
  const [heightFeet, setHeightFeet] = useState(6);
  const [heightInches, setHeightInches] = useState(3);
  const [weightLbs, setWeightLbs] = useState(195);
  const [wingspanInches, setWingspanInches] = useState(78);

  const [pointsRemaining, setPointsRemaining] = useState(25);
  const [customAdditions, setCustomAdditions] = useState<Record<string, number>>({});
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('duke-blue-devils');

  // Compila atributos finais
  const currentAttributes: PlayerAttributes = useMemo(() => {
    const base = { ...DEFAULT_BASE_ATTRS };
    const archetypeBonus = ARCHETYPES_CONFIG[archetype].bonusAttrs;

    for (const [k, v] of Object.entries(archetypeBonus)) {
      (base as any)[k] = v;
    }

    for (const [k, v] of Object.entries(customAdditions)) {
      (base as any)[k] = ((base as any)[k] || 70) + v;
    }

    return base;
  }, [archetype, customAdditions]);

  const currentOvr = useMemo(() => {
    return calculateOverall(currentAttributes, position);
  }, [currentAttributes, position]);

  // Recrutamento e ofertas de bolsas
  const recruitStars = currentOvr >= 79 ? 5 : currentOvr >= 74 ? 4 : 3;

  const eligibleColleges = useMemo(() => {
    if (recruitStars === 5) {
      // Todas as faculdades de elite abertas
      return NCAA_TEAMS;
    } else if (recruitStars === 4) {
      return NCAA_TEAMS.filter(t => t.prestige <= 94);
    } else {
      return NCAA_TEAMS.filter(t => t.prestige <= 85);
    }
  }, [recruitStars]);

  const handleAddPoint = (attrKey: keyof PlayerAttributes) => {
    if (pointsRemaining <= 0) return;
    const curBonus = customAdditions[attrKey] || 0;
    if (curBonus >= 10) return; // Limite de 10 pontos por atributo
    setCustomAdditions({ ...customAdditions, [attrKey]: curBonus + 1 });
    setPointsRemaining(pointsRemaining - 1);
  };

  const handleSubPoint = (attrKey: keyof PlayerAttributes) => {
    const curBonus = customAdditions[attrKey] || 0;
    if (curBonus <= 0) return;
    setCustomAdditions({ ...customAdditions, [attrKey]: curBonus - 1 });
    setPointsRemaining(pointsRemaining + 1);
  };

  const totalHeightInches = heightFeet * 12 + heightInches;

  const handleStartCareer = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Por favor, digite o nome completo do atleta.');
      return;
    }

    createNewPlayer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position,
      archetype,
      heightInches: totalHeightInches,
      weightLbs,
      wingspanInches,
      initialAttributes: currentAttributes,
      collegeTeamId: selectedCollegeId,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Cabeçalho de Criação */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-team-primary/20 border border-team-primary text-team-primary text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4" />
          Etapa 1: Criação de Atleta & Recrutamento NCAA
        </div>
        <h1 className="text-4xl md:text-5xl font-condensed font-black uppercase tracking-tight text-white">
          Início da Jornada Universitária
        </h1>
        <p className="text-sm text-[#8a96a8] max-w-2xl mx-auto mt-1">
          Defina sua biomecânica e arquétipo tático. Seu prestígio determinará quais programas da NCAA Division I oferecerão bolsa de estudos integral.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Painel Esquerdo: Biomecânica & Perfil */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl">
            <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-team-primary" />
              1. Biomecânica do Prospecto
            </h2>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#8a96a8] mb-1">Primeiro Nome</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded px-3 py-2 text-white font-medium focus:border-team-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#8a96a8] mb-1">Sobrenome</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded px-3 py-2 text-white font-medium focus:border-team-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Posição Tática */}
              <div>
                <label className="block text-xs font-mono text-[#8a96a8] mb-1">Posição em Quadra</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['PG', 'SG', 'SF', 'PF', 'C'] as Position[]).map(pos => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setPosition(pos)}
                      className={`py-2 text-xs font-condensed font-black tracking-wider rounded transition-all ${
                        position === pos
                          ? 'bg-team-primary text-white shadow-team-glow'
                          : 'bg-[#1c222e] text-[#8a96a8] hover:text-white border border-[#2b3345]'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Altura, Peso, Envergadura */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#8a96a8] mb-1">Altura</label>
                  <div className="flex gap-1">
                    <select
                      value={heightFeet}
                      onChange={e => setHeightFeet(Number(e.target.value))}
                      className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded p-1.5 text-xs text-white"
                    >
                      <option value={5}>5'</option>
                      <option value={6}>6'</option>
                      <option value={7}>7'</option>
                    </select>
                    <select
                      value={heightInches}
                      onChange={e => setHeightInches(Number(e.target.value))}
                      className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded p-1.5 text-xs text-white"
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i}"</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-[10px] text-[#8a96a8] font-mono mt-0.5 block">
                    {Math.round(totalHeightInches * 2.54)} cm
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8a96a8] mb-1">Peso</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={e => setWeightLbs(Number(e.target.value))}
                    min={160}
                    max={320}
                    className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded px-2 py-1.5 text-xs text-white"
                  />
                  <span className="text-[10px] text-[#8a96a8] font-mono mt-0.5 block">
                    {Math.round(weightLbs * 0.453592)} kg
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8a96a8] mb-1">Envergadura</label>
                  <input
                    type="number"
                    value={wingspanInches}
                    onChange={e => setWingspanInches(Number(e.target.value))}
                    min={68}
                    max={90}
                    className="w-full bg-[#0a0c0f] border border-[#2b3345] rounded px-2 py-1.5 text-xs text-white"
                  />
                  <span className="text-[10px] text-[#8a96a8] font-mono mt-0.5 block">
                    {Math.round(wingspanInches * 2.54)} cm
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seleção de Arquétipo */}
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl">
            <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 mb-3">
              2. Arquétipo Tático
            </h2>
            <div className="space-y-2">
              {(Object.keys(ARCHETYPES_CONFIG) as Archetype[]).map(archKey => {
                const conf = ARCHETYPES_CONFIG[archKey];
                const isSelected = archetype === archKey;
                return (
                  <button
                    key={archKey}
                    type="button"
                    onClick={() => setArchetype(archKey)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-[#1c222e] border-team-primary shadow-team-glow'
                        : 'bg-[#0a0c0f]/60 border-[#2b3345] hover:border-[#3d475d]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {conf.icon}
                      <span className="font-condensed font-bold uppercase tracking-wide text-sm text-white">
                        {conf.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#8a96a8] leading-relaxed">
                      {conf.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Painel Central: Alocação de Atributos */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2b3345] pb-3 mb-4">
              <div>
                <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white">
                  3. Distribuição de Atributos
                </h2>
                <p className="text-xs text-[#8a96a8]">Ajuste fino dos fundamentos do prospecto</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-[#8a96a8]">Pontos Restantes: </span>
                <span className="text-base font-mono font-black text-amber-400">
                  {pointsRemaining}
                </span>
              </div>
            </div>

            {/* Overall e Estrelas */}
            <div className="bg-[#0a0c0f] border border-[#2b3345] rounded-lg p-3 flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-team-primary flex items-center justify-center font-mono font-black text-xl text-white shadow-team-glow">
                  {currentOvr}
                </div>
                <div>
                  <div className="text-xs font-condensed uppercase tracking-wider text-[#8a96a8]">Classificação Geral</div>
                  <div className="text-sm font-bold text-white font-mono">{position} · {archetype}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-[#8a96a8]">Status no High School</div>
                <div className="flex items-center gap-1 justify-end text-amber-400 font-mono font-bold text-sm">
                  {Array.from({ length: recruitStars }).map((_, i) => (
                    <Award key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span>{recruitStars} Estrelas</span>
                </div>
              </div>
            </div>

            {/* Tabela de Atributos */}
            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {[
                { key: 'threePoint', label: 'Arremesso de 3 Pontos' },
                { key: 'midRange', label: 'Tiro de Meia Distância' },
                { key: 'inside', label: 'Finalização no Garrafão' },
                { key: 'freeThrow', label: 'Lances Livres' },
                { key: 'slashing', label: 'Infiltração / Slashing' },
                { key: 'passing', label: 'Passe & Visão de Quadra' },
                { key: 'ballControl', label: 'Controle de Bola' },
                { key: 'offensiveIQ', label: 'QI Ofensivo' },
                { key: 'defensiveIQ', label: 'QI Defensivo' },
                { key: 'perimeterDefense', label: 'Defesa de Perímetro' },
                { key: 'interiorDefense', label: 'Defesa no Garrafão' },
                { key: 'steal', label: 'Roubo de Bola' },
                { key: 'block', label: 'Tocos' },
                { key: 'defensiveRebound', label: 'Rebote Defensivo' },
                { key: 'speed', label: 'Velocidade' },
                { key: 'vertical', label: 'Impulsão Vertical' },
                { key: 'strength', label: 'Força Física' },
              ].map(({ key, label }) => {
                const attrKey = key as keyof PlayerAttributes;
                const value = currentAttributes[attrKey];
                const added = customAdditions[attrKey] || 0;

                return (
                  <div key={key} className="flex items-center justify-between bg-[#0a0c0f]/60 px-3 py-1.5 rounded border border-[#1c222e]">
                    <span className="text-xs text-[#f0f3f8]">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold w-6 text-right ${added > 0 ? 'text-amber-400' : 'text-white'}`}>
                        {value}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleSubPoint(attrKey)}
                          disabled={added <= 0}
                          className="w-5 h-5 rounded bg-[#1c222e] text-[#8a96a8] hover:text-white disabled:opacity-30 text-xs flex items-center justify-center font-mono font-bold"
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddPoint(attrKey)}
                          disabled={pointsRemaining <= 0 || added >= 10}
                          className="w-5 h-5 rounded bg-team-primary text-white hover:opacity-90 disabled:opacity-30 text-xs flex items-center justify-center font-mono font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Painel Direito: Bolsas da NCAA */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-[#13171f] border border-[#2b3345] rounded-xl p-5 shadow-xl flex flex-col h-full justify-between">
            <div>
              <h2 className="text-lg font-condensed font-bold uppercase tracking-wider text-white border-b border-[#2b3345] pb-2 mb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                4. Ofertas da NCAA
              </h2>
              <p className="text-xs text-[#8a96a8] mb-3">
                Selecione onde jogará sua temporada universitária:
              </p>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {eligibleColleges.map(college => {
                  const isSelected = selectedCollegeId === college.id;
                  return (
                    <button
                      key={college.id}
                      type="button"
                      onClick={() => setSelectedCollegeId(college.id)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'bg-[#1c222e] border-team-primary shadow-team-glow'
                          : 'bg-[#0a0c0f]/60 border-[#2b3345] hover:border-[#3d475d]'
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
            </div>

            {/* Botão de Conclusão */}
            <div className="pt-4 border-t border-[#2b3345] mt-4">
              <button
                type="button"
                onClick={handleStartCareer}
                className="w-full py-3 px-4 rounded-xl bg-team-primary text-white font-condensed font-black uppercase tracking-wider text-base hover:opacity-95 shadow-team-glow transition-all flex items-center justify-center gap-2"
              >
                Assinar Carta de Intenção
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

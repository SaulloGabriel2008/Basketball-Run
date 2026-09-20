import { Archetype, Position, PlayerAttributes } from '../types';
import { calculateOverall } from '../engine/biologicalAging';

export interface ArchetypeDefinition {
  id: Archetype;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  emoji: string;
  gradient: string;
  playStyleHighlights: string[];
  boostedAttributes: Partial<PlayerAttributes>;
}

export const ARCHETYPES: Record<Archetype, ArchetypeDefinition> = {
  SHARPSHOOTER: {
    id: 'SHARPSHOOTER',
    name: 'Sharpshooter',
    tagline: 'Gatilho de Elite do Perímetro',
    description: 'Especialista letal no tiro de 3 pontos, bolas em catch-and-shoot e espaçamento ofensivo.',
    badgeColor: '#F59E0B',
    emoji: '🎯',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    playStyleHighlights: ['Catch & Shoot 3PT', 'Espaçamento de Quadra', 'Precisão no Clutch'],
    boostedAttributes: {
      threePoint: 88,
      midRange: 82,
      freeThrow: 88,
      offensiveIQ: 82,
      clutch: 80,
    },
  },
  PLAYMAKER: {
    id: 'PLAYMAKER',
    name: 'Playmaker',
    tagline: 'Criador Tático Primário',
    description: 'Mestre do drible e controle de ritmo, visão periférica de passe e leitura refinada de pick & roll.',
    badgeColor: '#3B82F6',
    emoji: '🧠',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    playStyleHighlights: ['Visão de Passe 360°', 'Drible Desestabilizador', 'Pick & Roll Maestro'],
    boostedAttributes: {
      passing: 88,
      ballControl: 88,
      offensiveIQ: 86,
      speed: 84,
      acceleration: 83,
    },
  },
  LOCKDOWN_DEFENDER: {
    id: 'LOCKDOWN_DEFENDER',
    name: 'Lockdown Defender',
    tagline: 'Cão de Caça Perimetral',
    description: 'Especialista em sufocar as principais armas adversárias, cortar linhas de passe e forçar erros.',
    badgeColor: '#10B981',
    emoji: '🔒',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    playStyleHighlights: ['Roubos em Transição', 'Sufoco 1 contra 1', 'Pressão Defensiva 94ft'],
    boostedAttributes: {
      perimeterDefense: 88,
      steal: 85,
      defensiveIQ: 86,
      stamina: 86,
      speed: 83,
    },
  },
  SLASHER: {
    id: 'SLASHER',
    name: 'Slasher',
    tagline: 'Agressor Explosivo do Aro',
    description: 'Primeiro passo veloz, ataque implacável ao aro em velocidade e enterradas acrobáticas.',
    badgeColor: '#EF4444',
    emoji: '⚡',
    gradient: 'from-red-500/20 via-rose-500/10 to-transparent',
    playStyleHighlights: ['Enterradas no Tráfego', 'Infiltração Explosiva', 'Cavador de Faltas no Aro'],
    boostedAttributes: {
      slashing: 88,
      speed: 87,
      vertical: 88,
      acceleration: 86,
      inside: 84,
    },
  },
  POST_SCORER: {
    id: 'POST_SCORER',
    name: 'Post Scorer',
    tagline: 'Mestre do Jogo de Costas',
    description: 'Trabalho de pés impecável no garrafão, ganchos indefensáveis e finalizações com contato físico.',
    badgeColor: '#8B5CF6',
    emoji: '🥋',
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    playStyleHighlights: ['Ganchos Cirúrgicos', 'Trabalho de Pés no Garrafão', 'Finalização com Contato'],
    boostedAttributes: {
      inside: 88,
      strength: 86,
      offensiveIQ: 84,
      midRange: 80,
      offensiveRebound: 82,
    },
  },
  PAINT_PROTECTOR: {
    id: 'PAINT_PROTECTOR',
    name: 'Paint Protector',
    tagline: 'Muralha e Âncora do Aro',
    description: 'Guardião intransponível da tábua defensiva, alterando arremessos e liderando rebotes.',
    badgeColor: '#0EA5E9',
    emoji: '🧱',
    gradient: 'from-sky-500/20 via-cyan-500/10 to-transparent',
    playStyleHighlights: ['Tocos Monumentais', 'Rebotes Protetivos', 'Intimidação no Garrafão'],
    boostedAttributes: {
      block: 88,
      interiorDefense: 88,
      defensiveRebound: 88,
      strength: 87,
      defensiveIQ: 84,
    },
  },
  MID_RANGE_MAESTRO: {
    id: 'MID_RANGE_MAESTRO',
    name: 'Mid-Range Maestro',
    tagline: 'Cirurgião da Meia-Distância',
    description: 'Especialista em criar separação com fadeaways, pull-ups mortais e arremessos fluidos da meia distância.',
    badgeColor: '#EC4899',
    emoji: '🗡️',
    gradient: 'from-pink-500/20 via-rose-500/10 to-transparent',
    playStyleHighlights: ['Fadeaway Indefensável', 'Pull-up no Drible', 'Isolamento 1 contra 1'],
    boostedAttributes: {
      midRange: 90,
      ballControl: 82,
      offensiveIQ: 85,
      clutch: 84,
      freeThrow: 86,
    },
  },
  STRETCH_BIG: {
    id: 'STRETCH_BIG',
    name: 'Stretch Big',
    tagline: 'Pivô Espaçador Moderno',
    description: 'Pivô alto com capacidade de punir defesas da linha de 3 pontos em situações de pick-and-pop.',
    badgeColor: '#06B6D4',
    emoji: '🏹',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    playStyleHighlights: ['Pick & Pop de 3 Pontos', 'Abertura de Espaço', 'Rebotes Defensivos'],
    boostedAttributes: {
      threePoint: 84,
      inside: 80,
      defensiveRebound: 82,
      strength: 82,
      midRange: 80,
    },
  },
  POINT_FORWARD: {
    id: 'POINT_FORWARD',
    name: 'Point Forward',
    tagline: 'Ala Armador Geracional',
    description: 'Físico avantajado com visão de jogo de um armador, orquestrando contra-ataques com dominância física.',
    badgeColor: '#EAB308',
    emoji: '👑',
    gradient: 'from-yellow-500/20 via-amber-500/10 to-transparent',
    playStyleHighlights: ['Triplo-Duplo em Potencial', 'Condução no Transição', 'Criação para os Alas'],
    boostedAttributes: {
      passing: 85,
      ballControl: 84,
      offensiveIQ: 85,
      defensiveRebound: 78,
      strength: 80,
    },
  },
  TWO_WAY_SPECIALIST: {
    id: 'TWO_WAY_SPECIALIST',
    name: 'Two-Way Specialist',
    tagline: 'Equilíbrio Total 3&D',
    description: 'Impacto consistente nas duas metades da quadra: pontuação eficiente e defesa tenaz sem erros.',
    badgeColor: '#14B8A6',
    emoji: '⚔️',
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    playStyleHighlights: ['Eficiência em Ambos os Lados', 'Arremessos Livres de 3', 'Defesa Sem Faltas'],
    boostedAttributes: {
      perimeterDefense: 84,
      threePoint: 82,
      slashing: 80,
      defensiveIQ: 82,
      stamina: 84,
    },
  },
};

export const ARCHETYPES_CATALOG = Object.values(ARCHETYPES);

/**
 * Gera um título estilizado de arquétipo híbrido com emoji
 */
export function getHybridArchetypeName(primary: Archetype, secondary: Archetype): string {
  if (primary === secondary) {
    return `${ARCHETYPES[primary].emoji} ${ARCHETYPES[primary].name} Puro`;
  }

  const p = primary;
  const s = secondary;

  if ((p === 'SHARPSHOOTER' && s === 'PLAYMAKER') || (p === 'PLAYMAKER' && s === 'SHARPSHOOTER')) {
    return '🎯🧠 Armador Atirador Dinâmico';
  }
  if ((p === 'SLASHER' && s === 'PLAYMAKER') || (p === 'PLAYMAKER' && s === 'SLASHER')) {
    return '⚡🧠 Infiltrador Criador Explosivo';
  }
  if ((p === 'LOCKDOWN_DEFENDER' && s === 'SHARPSHOOTER') || (p === 'SHARPSHOOTER' && s === 'LOCKDOWN_DEFENDER')) {
    return '🔒🎯 Especialista 3&D de Elite';
  }
  if ((p === 'PAINT_PROTECTOR' && s === 'POST_SCORER') || (p === 'POST_SCORER' && s === 'PAINT_PROTECTOR')) {
    return '🧱🥋 Pivô Dominador Clássico';
  }
  if ((p === 'PAINT_PROTECTOR' && s === 'STRETCH_BIG') || (p === 'STRETCH_BIG' && s === 'PAINT_PROTECTOR')) {
    return '🧱🏹 Pivô Protetor Espaçador';
  }
  if ((p === 'POINT_FORWARD' && s === 'TWO_WAY_SPECIALIST') || (p === 'TWO_WAY_SPECIALIST' && s === 'POINT_FORWARD')) {
    return '👑⚔️ Ala Facilitador Two-Way';
  }

  return `${ARCHETYPES[primary].emoji} ${ARCHETYPES[primary].name} / ${ARCHETYPES[secondary].name}`;
}

/**
 * Combina dois arquétipos de forma arcade instantânea e calcula atributos iniciais balanceados
 */
export function combineArchetypes(
  primary: Archetype,
  secondary: Archetype,
  position: Position
): { attributes: PlayerAttributes; overall: number; hybridTitle: string } {
  const baseValue = 68;

  const initialAttrs: PlayerAttributes = {
    speed: baseValue,
    acceleration: baseValue,
    vertical: baseValue,
    stamina: 74,
    strength: baseValue,
    inside: baseValue,
    midRange: baseValue,
    threePoint: baseValue,
    freeThrow: 72,
    slashing: baseValue,
    passing: baseValue,
    ballControl: baseValue,
    offensiveIQ: 72,
    defensiveIQ: 72,
    clutch: 70,
    perimeterDefense: baseValue,
    interiorDefense: baseValue,
    steal: 68,
    block: 65,
    offensiveRebound: 65,
    defensiveRebound: 68,
  };

  // Ajustes biomecânicos por posição
  if (position === 'PG' || position === 'SG') {
    initialAttrs.speed += 4;
    initialAttrs.ballControl += 4;
  } else if (position === 'PF' || position === 'C') {
    initialAttrs.strength += 6;
    initialAttrs.defensiveRebound += 5;
    initialAttrs.interiorDefense += 4;
  }

  const primBoosts = ARCHETYPES[primary].boostedAttributes;
  const secBoosts = ARCHETYPES[secondary].boostedAttributes;

  // Primário contribui com ~65% do bônus
  for (const [k, v] of Object.entries(primBoosts)) {
    const key = k as keyof PlayerAttributes;
    if (typeof v === 'number') {
      const delta = v - initialAttrs[key];
      initialAttrs[key] = Math.round(initialAttrs[key] + delta * 0.65);
    }
  }

  // Secundário contribui com ~35% do bônus
  for (const [k, v] of Object.entries(secBoosts)) {
    const key = k as keyof PlayerAttributes;
    if (typeof v === 'number') {
      const delta = v - initialAttrs[key];
      initialAttrs[key] = Math.round(initialAttrs[key] + Math.max(0, delta * 0.35));
    }
  }

  const overall = calculateOverall(initialAttrs, position);
  const hybridTitle = getHybridArchetypeName(primary, secondary);

  return {
    attributes: initialAttrs,
    overall,
    hybridTitle,
  };
}

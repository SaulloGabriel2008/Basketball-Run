import { Archetype, Position, PlayerAttributes } from '../types';
import { calculateOverall } from '../engine/biologicalAging';

export interface ArchetypeDefinition {
  id: Archetype;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  boostedAttributes: Partial<PlayerAttributes>;
}

export const ARCHETYPES: Record<Archetype, ArchetypeDefinition> = {
  SHARPSHOOTER: {
    id: 'SHARPSHOOTER',
    name: 'Sharpshooter',
    tagline: 'Gatilho de Elite do Perímetro',
    description: 'Especialista letal no tiro de 3 pontos, bolas em catch-and-shoot e espaçamento ofensivo.',
    badgeColor: '#F59E0B',
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
    boostedAttributes: {
      slashing: 89,
      inside: 84,
      speed: 87,
      vertical: 88,
      acceleration: 86,
    },
  },
  POST_SCORER: {
    id: 'POST_SCORER',
    name: 'Post Scorer',
    tagline: 'Mestre Clássico do Garrafão',
    description: 'Jogo de pés polido de costas para a cesta, ganchos perfeitos e domínio físico na pintura.',
    badgeColor: '#8B5CF6',
    boostedAttributes: {
      inside: 88,
      strength: 88,
      offensiveRebound: 82,
      midRange: 78,
      interiorDefense: 78,
    },
  },
  PAINT_PROTECTOR: {
    id: 'PAINT_PROTECTOR',
    name: 'Paint Protector',
    tagline: 'Muralha e Protetor de Aro',
    description: 'Âncora defensiva de garrafão, contestador de arremessos, especialista em tocos e rebotes defensivos.',
    badgeColor: '#06B6D4',
    boostedAttributes: {
      interiorDefense: 89,
      block: 88,
      defensiveRebound: 88,
      strength: 85,
      vertical: 80,
    },
  },
  MID_RANGE_MAESTRO: {
    id: 'MID_RANGE_MAESTRO',
    name: 'Mid-Range Maestro',
    tagline: 'Virtuoso da Meia Distância',
    description: 'Arremesso clássico de parada brusca, fadeaway no post médio e frieza em momentos decisivos.',
    badgeColor: '#D97706',
    boostedAttributes: {
      midRange: 89,
      clutch: 85,
      freeThrow: 86,
      offensiveIQ: 83,
      inside: 80,
    },
  },
  STRETCH_BIG: {
    id: 'STRETCH_BIG',
    name: 'Stretch Big',
    tagline: 'Pivô Espaçador Moderno',
    description: 'Homem grande com pontaria exterior afiada no pick & pop, abrindo a quadra para infiltrações.',
    badgeColor: '#EC4899',
    boostedAttributes: {
      threePoint: 84,
      midRange: 80,
      defensiveRebound: 80,
      interiorDefense: 76,
      freeThrow: 82,
    },
  },
  POINT_FORWARD: {
    id: 'POINT_FORWARD',
    name: 'Point Forward',
    tagline: 'Ala Facilitador Completo',
    description: 'Porte físico de ala com inteligência e habilidade de armador principal criando para os colegas.',
    badgeColor: '#6366F1',
    boostedAttributes: {
      passing: 84,
      ballControl: 84,
      offensiveIQ: 85,
      defensiveRebound: 78,
      strength: 80,
    },
  },
  TWO_WAY_SPECIALIST: {
    id: 'TWO_WAY_SPECIALIST',
    name: 'Two-Way Specialist',
    tagline: 'Especialista em Ambas as Extremidades',
    description: 'Equilíbrio ideal entre produção ofensiva eficiente e compromisso defensivo incansável.',
    badgeColor: '#14B8A6',
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
 * Gera um título estilizado de arquétipo híbrido
 */
export function getHybridArchetypeName(primary: Archetype, secondary: Archetype): string {
  if (primary === secondary) {
    return `Puro ${ARCHETYPES[primary].name}`;
  }

  const p = primary;
  const s = secondary;

  if ((p === 'SHARPSHOOTER' && s === 'LOCKDOWN_DEFENDER') || (p === 'LOCKDOWN_DEFENDER' && s === 'SHARPSHOOTER')) {
    return '3&D Perimetral de Elite';
  }
  if ((p === 'PLAYMAKER' && s === 'SLASHER') || (p === 'SLASHER' && s === 'PLAYMAKER')) {
    return 'Agressor Criador Explosivo';
  }
  if ((p === 'PLAYMAKER' && s === 'SHARPSHOOTER') || (p === 'SHARPSHOOTER' && s === 'PLAYMAKER')) {
    return 'Playmaker Atirador Dinâmico';
  }
  if ((p === 'POST_SCORER' && s === 'PAINT_PROTECTOR') || (p === 'PAINT_PROTECTOR' && s === 'POST_SCORER')) {
    return 'Âncora Dominante de Garrafão';
  }
  if ((p === 'STRETCH_BIG' && s === 'PAINT_PROTECTOR') || (p === 'PAINT_PROTECTOR' && s === 'STRETCH_BIG')) {
    return 'Pivô Protetor Espaçador';
  }
  if ((p === 'POINT_FORWARD' && s === 'TWO_WAY_SPECIALIST') || (p === 'TWO_WAY_SPECIALIST' && s === 'POINT_FORWARD')) {
    return 'Ala Facilitador Two-Way';
  }

  return `${ARCHETYPES[primary].name} / ${ARCHETYPES[secondary].name}`;
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

  // Ajustes por posição
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

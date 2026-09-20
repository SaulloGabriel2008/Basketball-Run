import { CareerEvent, PlayerEntity } from '../types';

export const CAREER_EVENTS_DATABASE: CareerEvent[] = [
  {
    id: 'media-controversy-1',
    title: 'Entrevista Pós-Jogo e Polêmica com a Imprensa',
    description: 'Após uma derrota apertada, os jornalistas perguntam insistentemente sobre as decisões táticas do treinador no último quarto.',
    category: 'MEDIA',
    choices: [
      {
        id: 'c1',
        text: 'Assumir a culpa coletiva e defender o plano do treinador',
        impactDescription: '+10 Moral do Treinador, +5 Química do Elenco, -5 Exposição na Mídia',
        effect: { chemistry: 8, moral: 5 },
      },
      {
        id: 'c2',
        text: 'Criticar abertamente as jogadas desenhadas nos minutos finais',
        impactDescription: '-15 Química com a comissão técnica, +10 Foco Individual',
        effect: { chemistry: -12, moral: -5, attributes: { clutch: 2 } },
      },
      {
        id: 'c3',
        text: 'Recusar comentários e ir direto para a sessão de arremessos',
        impactDescription: '+3 Ética de Trabalho, -5 Energia',
        effect: { energy: -8, attributes: { threePoint: 1 } },
      },
    ],
  },
  {
    id: 'locker-room-conflict',
    title: 'Tensão no Vestiário com o Veterano da Posição',
    description: 'O veterano da equipe sente que você está roubando seus minutos e faz comentários irônicos durante o treino matinal.',
    category: 'LOCKER_ROOM',
    choices: [
      {
        id: 'c1',
        text: 'Chamar o veterano para um jantar particular e pedir conselhos',
        impactDescription: '+15 Química de Balneário, +2 QI Ofensivo',
        effect: { chemistry: 15, attributes: { offensiveIQ: 2 } },
      },
      {
        id: 'c2',
        text: 'Desafiá-lo publicamente para um duelo 1 contra 1 no treino',
        impactDescription: '+5 Moral Pessoal, +3 Slashing, risco de atrito com a liderança',
        effect: { moral: 10, chemistry: -5, attributes: { slashing: 2 } },
      },
      {
        id: 'c3',
        text: 'Ignorar a provocação e focar exclusivamente na academia',
        impactDescription: '+1 Força, +5 Fadiga',
        effect: { energy: -10, attributes: { strength: 1 } },
      },
    ],
  },
  {
    id: 'training-regimen',
    title: 'Semana do All-Star Break: Descanso ou Treino Intenso?',
    description: 'Durante a pausa de uma semana no calendário regular da liga, você pode viajar para relaxar ou intensificar o condicionamento físico.',
    category: 'TRAINING',
    choices: [
      {
        id: 'c1',
        text: 'Fazer um mini-camp de condicionamento e mecânica de tiro',
        impactDescription: '+2 Lançamento de 3 Pontos, +2 Meia Distância, -15 Energia',
        effect: { energy: -15, attributes: { threePoint: 2, midRange: 2 } },
      },
      {
        id: 'c2',
        text: 'Descansar com a família e recuperar a musculatura',
        impactDescription: 'Recuperação de 100% da Energia e Redução drástica de risco de lesão',
        effect: { energy: 35, moral: 15 },
      },
      {
        id: 'c3',
        text: 'Estudo intensivo de vídeo tático com os assistentes técnicos',
        impactDescription: '+3 QI Defensivo, +2 Visão de Passe',
        effect: { attributes: { defensiveIQ: 3, passing: 2 } },
      },
    ],
  },
  {
    id: 'agent-commercial-deal',
    title: 'Proposta Comercial de Marca Esportiva Global',
    description: 'Uma gigante dos materiais esportivos quer lançar uma linha exclusiva com seu nome, mas exige participação em gravações comerciais exaustivas.',
    category: 'CONTRACT',
    choices: [
      {
        id: 'c1',
        text: 'Assinar o contrato de patrocínio global com foco em marketing',
        impactDescription: '+20 Moral, +10 Exposição, -10 Energia',
        effect: { moral: 20, energy: -10 },
      },
      {
        id: 'c2',
        text: 'Recusar as viagens publicitárias e focar na temporada em quadra',
        impactDescription: '+10 Respeito do Treinador, +5 Foco em Jogo',
        effect: { chemistry: 10, attributes: { clutch: 1 } },
      },
    ],
  },
];

/**
 * Sorteia um evento aleatório aplicável ao momento do jogador
 */
export function getRandomCareerEvent(): CareerEvent {
  const idx = Math.floor(Math.random() * CAREER_EVENTS_DATABASE.length);
  return CAREER_EVENTS_DATABASE[idx];
}

/**
 * Aplica as consequências da escolha no estado do atleta
 */
export function applyEventChoice(player: PlayerEntity, event: CareerEvent, choiceId: string): PlayerEntity {
  const choice = event.choices.find(c => c.id === choiceId);
  if (!choice) return player;

  const updated: PlayerEntity = {
    ...player,
    moral: Math.max(0, Math.min(100, player.moral + (choice.effect.moral || 0))),
    chemistry: Math.max(0, Math.min(100, player.chemistry + (choice.effect.chemistry || 0))),
    energy: Math.max(0, Math.min(100, player.energy + (choice.effect.energy || 0))),
    attributes: { ...player.attributes },
  };

  if (choice.effect.attributes) {
    for (const [attrKey, delta] of Object.entries(choice.effect.attributes)) {
      const key = attrKey as keyof typeof updated.attributes;
      if (typeof delta === 'number') {
        updated.attributes[key] = Math.max(40, Math.min(99, updated.attributes[key] + delta));
      }
    }
  }

  return updated;
}

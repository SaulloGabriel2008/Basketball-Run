import { PlayerEntity, ContractOffer } from '../types';
import { NBA_TEAMS, getTeamById } from '../data/teamsRepository';

/**
 * Gera propostas formais de renovação do time atual e ofertas de franquias rivais da NBA
 */
export function generateContractOffers(player: PlayerEntity): ContractOffer[] {
  const currentTeam = getTeamById(player.currentTeamId);
  const ovr = player.overall;

  // Cálculo de salário de mercado baseado no OVR
  let marketSalary = 6000000;
  if (ovr >= 95) {
    marketSalary = Math.round(48000000 + (ovr - 95) * 3500000);
  } else if (ovr >= 90) {
    marketSalary = Math.round(38000000 + (ovr - 90) * 2000000);
  } else if (ovr >= 85) {
    marketSalary = Math.round(26000000 + (ovr - 85) * 2400000);
  } else if (ovr >= 80) {
    marketSalary = Math.round(16000000 + (ovr - 80) * 2000000);
  } else if (ovr >= 75) {
    marketSalary = Math.round(9000000 + (ovr - 75) * 1400000);
  }

  const role: ContractOffer['role'] = ovr >= 90 
    ? 'FRANCHISE_CORNERSTONE' 
    : ovr >= 80 
      ? 'STARTER' 
      : 'SIXTH_MAN';

  const offers: ContractOffer[] = [];

  // 1. Proposta de Renovação / Extensão da Franquia Atual
  if (currentTeam) {
    const loyaltyBonus = Math.round(marketSalary * 1.08); // 8% a mais pelo direito Bird
    offers.push({
      id: `offer-current-${Date.now()}`,
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      salaryPerYear: loyaltyBonus,
      yearsTotal: 4,
      role,
      isExtension: true,
      pitchMessage: `A diretoria e a torcida do ${currentTeam.name} querem manter você no centro do projeto vencedor por mais 4 anos com contrato máximo!`,
      teamPrestige: currentTeam.prestige,
    });
  }

  // 2. Propostas de 4 Franquias Rivais da NBA
  const otherTeams = NBA_TEAMS
    .filter(t => t.id !== player.currentTeamId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const pitchTemplates = [
    (teamName: string) => `O General Manager do ${teamName} preparou espaço salarial limpo e quer você comandando o nosso ataque rumo ao título!`,
    (teamName: string) => `A comissão técnica do ${teamName} projetou um plano tático ao redor do seu estilo de jogo para você ser o líder da equipe.`,
    (teamName: string) => `O ${teamName} possui um elenco jovem e competitivo pronto para dar o salto com a sua liderança veterana e capacidade de decisão no clutch.`
  ];

  otherTeams.forEach((team, idx) => {
    // Variação financeira entre ofertas (-10% a +12%)
    const variation = 0.90 + (idx * 0.06);
    const rivalSalary = Math.round(marketSalary * variation);
    const rivalYears = idx % 2 === 0 ? 3 : 4;

    offers.push({
      id: `offer-rival-${team.id}-${Date.now()}`,
      teamId: team.id,
      teamName: team.name,
      salaryPerYear: rivalSalary,
      yearsTotal: rivalYears,
      role,
      isExtension: false,
      pitchMessage: pitchTemplates[idx % pitchTemplates.length](team.name),
      teamPrestige: team.prestige,
    });
  });

  return offers;
}

/**
 * Gera opções imediatas para solicitação de troca (Trade Request)
 */
export function generateTradeOptions(player: PlayerEntity): { teamId: string; teamName: string; pitch: string }[] {
  const eligible = NBA_TEAMS
    .filter(t => t.id !== player.currentTeamId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return eligible.map(t => ({
    teamId: t.id,
    teamName: t.name,
    pitch: `O ${t.name} (Prestígio: ${t.prestige}) aceita absorver o seu contrato atual via pacote de escolhas de draft e jovens ativos.`,
  }));
}

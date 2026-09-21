import { PlayerEntity, ContractOffer } from '../types';
import { NBA_TEAMS, getTeamById } from '../data/teamsRepository';
import { evaluateTeamFit } from './teamFitEngine';

/**
 * Gera propostas formais de renovação do time atual e ofertas de franquias rivais da NBA,
 * analisando encaixe tático, papel projetado e concorrência na posição.
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

  const offers: ContractOffer[] = [];

  // 1. Proposta de Renovação / Extensão da Franquia Atual
  if (currentTeam) {
    const loyaltyBonus = Math.round(marketSalary * 1.08); // 8% a mais pelo direito Bird
    const currentFit = evaluateTeamFit(player, currentTeam.id);

    offers.push({
      id: `offer-current-${Date.now()}`,
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      salaryPerYear: loyaltyBonus,
      yearsTotal: 4,
      role: currentFit.expectedRole,
      isExtension: true,
      pitchMessage: `A diretoria do ${currentTeam.name} quer manter você como peça central do projeto por mais 4 anos sob contrato de lealdade Bird Rights!`,
      teamPrestige: currentTeam.prestige,
      teamFit: currentFit,
    });
  }

  // 2. Propostas de 4 Franquias Rivais da NBA
  const otherTeams = NBA_TEAMS
    .filter(t => t.id !== player.currentTeamId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  otherTeams.forEach((team, idx) => {
    // Variação financeira entre ofertas (-10% a +12%)
    const variation = 0.90 + (idx * 0.06);
    const rivalSalary = Math.round(marketSalary * variation);
    const rivalYears = idx % 2 === 0 ? 3 : 4;
    const teamFit = evaluateTeamFit(player, team.id);

    let customPitch = `O General Manager do ${team.name} preparou espaço salarial limpo para ter você no elenco.`;
    if (teamFit.expectedRole === 'FRANCHISE_CORNERSTONE') {
      customPitch = `O ${team.name} quer você como a estrela número 1 indiscutível e dono da franquia rumo ao título!`;
    } else if (teamFit.expectedRole === 'STARTER') {
      customPitch = `A comissão técnica do ${team.name} projetou sua titularidade imediata para comandar o quinteto principal.`;
    } else if (teamFit.expectedRole === 'SIXTH_MAN') {
      customPitch = `O ${team.name} oferece papel de 6º homem estelar e líder ofensivo da segunda unidade na briga por playoffs.`;
    } else if (teamFit.expectedRole === 'ROTATION_BATTLE') {
      customPitch = `O ${team.name} propõe disputa sadia de minutos com ${teamFit.directRivalName || 'o titular atual'} para elevar o nível da equipe.`;
    }

    offers.push({
      id: `offer-rival-${team.id}-${Date.now()}`,
      teamId: team.id,
      teamName: team.name,
      salaryPerYear: rivalSalary,
      yearsTotal: rivalYears,
      role: teamFit.expectedRole,
      isExtension: false,
      pitchMessage: customPitch,
      teamPrestige: team.prestige,
      teamFit,
    });
  });

  return offers;
}

/**
 * Gera opções imediatas para solicitação de troca (Trade Request) com análise de papel projetado
 */
export function generateTradeOptions(player: PlayerEntity): ContractOffer[] {
  const eligible = NBA_TEAMS
    .filter(t => t.id !== player.currentTeamId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const salary = player.contract ? player.contract.salaryPerYear : 12000000;
  const years = player.contract ? player.contract.yearsRemaining : 3;

  return eligible.map(t => {
    const fit = evaluateTeamFit(player, t.id);
    const msg = `A diretoria do ${t.name} (Prestígio: ${t.prestige}) preparou pacote de troca para absorver seu contrato. Papel projetado: ${fit.roleTitle}.`;
    return {
      id: `trade-offer-${t.id}-${Date.now()}`,
      teamId: t.id,
      teamName: t.name,
      salaryPerYear: salary,
      yearsTotal: Math.max(1, years),
      role: fit.expectedRole,
      isExtension: false,
      pitchMessage: msg,
      pitch: msg,
      teamPrestige: t.prestige,
      teamFit: fit,
    };
  });
}

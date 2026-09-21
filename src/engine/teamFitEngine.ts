import { PlayerEntity, TeamFitReport, ProjectedRole } from '../types';
import { getTeamById } from '../data/teamsRepository';
import { NBA_ACTIVE_STARS } from '../data/nbaRoster';

/**
 * Avalia o encaixe tático, papel projetado (Estrela, Titular, 6º Homem, Banco)
 * e se vale a pena o jogador assinar com determinada equipe da NBA.
 */
export function evaluateTeamFit(player: PlayerEntity, targetTeamId: string): TeamFitReport {
  const team = getTeamById(targetTeamId);
  const teamName = team ? team.name : targetTeamId;
  const prestige = team ? team.prestige : 75;

  // 1. Projeto da Franquia
  let projectType: TeamFitReport['projectType'] = 'PLAYOFFS';
  let projectLabel = 'Briga por Playoffs 📈';
  if (prestige >= 85) {
    projectType = 'CONTENDER';
    projectLabel = 'Candidato ao Título 🏆';
  } else if (prestige < 72) {
    projectType = 'REBUILDING';
    projectLabel = 'Reconstrução Total 🏗️';
  }

  // 2. Busca atletas da equipe na mesma posição
  const teamRoster = NBA_ACTIVE_STARS.filter(s => s.teamId === targetTeamId);
  const positionalRivals = teamRoster
    .filter(s => s.position === player.position && s.id !== player.id)
    .sort((a, b) => b.overall - a.overall);

  const directRival = positionalRivals[0];
  const rivalOvr = directRival ? directRival.overall : 74;
  const diff = player.overall - rivalOvr;

  let expectedRole: ProjectedRole = 'STARTER';
  let roleTitle = '⭐ Titular Absoluto';
  let expectedMinutes = '30-34 min/jogo';
  let isWorthIt = true;
  let fitStars = 4;
  let verdictTitle = 'Vale a Pena';
  let verdictPtBr = 'Vale a Pena';
  let analysisText = '';

  // 3. Determinação do Papel Projetado & Veredito
  let prosPtBr: string[] = [];
  let consPtBr: string[] = [];

  if (player.overall >= 92 && (diff >= 3 || !directRival)) {
    expectedRole = 'FRANCHISE_CORNERSTONE';
    roleTitle = '👑 Super Estrela / Dono da Franquia';
    expectedMinutes = '34-38 min/jogo (1ª Opção Ofensiva)';
    isWorthIt = true;
    fitStars = 5;
    verdictTitle = 'Vale Muito a Pena ⭐⭐⭐⭐⭐';
    verdictPtBr = 'Cenário perfeito para ser o rosto da franquia e disputar o prêmio de MVP com bola na mão em todos os ataques decisivos.';
    analysisText = directRival
      ? `O ${teamName} carece de uma superestrela geracional. Você supera ${directRival.name} (${directRival.overall} OVR) e terá as chaves da franquia para liderar todas as posses.`
      : `O ${teamName} não possui nenhum jogador de alto calibre na posição ${player.position}. Você será a cara da franquia e o foco ofensivo total.`;
    prosPtBr = ['Dono da franquia e foco do playbook ofensivo', 'Minutos máximos em quadra (35+ min)'];
    consPtBr = ['Pressão imensa por resultados e playoffs'];
  } else if (diff >= 3 || (!directRival && player.overall >= 78)) {
    expectedRole = 'STARTER';
    roleTitle = '⭐ Titular Indiscutível';
    expectedMinutes = '30-34 min/jogo (Quinteto Inicial)';
    isWorthIt = true;
    fitStars = prestige >= 80 ? 5 : 4;
    verdictTitle = 'Vale a Pena ⭐⭐⭐⭐';
    verdictPtBr = 'Excelente oportunidade para ser titular imediato e consolidar sua carreira com alto volume de minutos na NBA.';
    analysisText = directRival
      ? `Você é superior a ${directRival.name} (${directRival.overall} OVR) e garante a titularidade incontestável no quinteto inicial.`
      : `Vaga de titular desimpedida na posição ${player.position}, permitindo grande minutagem e espaço de evolução.`;
    prosPtBr = ['Titularidade garantida no quinteto inicial', 'Espaço de destaque sem concorrência perigosa'];
    consPtBr = projectType === 'REBUILDING' ? ['Franquia jovem com poucas chances de título imediato'] : [];
  } else if (Math.abs(diff) <= 2 && directRival) {
    expectedRole = 'ROTATION_BATTLE';
    roleTitle = '⚔️ Disputa Aberta pela Vaga';
    expectedMinutes = '25-29 min/jogo (Minutos Divididos)';
    isWorthIt = player.overall >= 84;
    fitStars = 3;
    verdictTitle = 'Concorrência Equilibrada ⭐⭐⭐';
    verdictPtBr = 'Disputa de posição acirrada. Você terá que produzir logo de início para assegurar a titularidade definitiva.';
    analysisText = `Você disputará posição diretamente com ${directRival.name} (${directRival.overall} OVR). A comissão técnica dividirá arremessos e minutos entre vocês.`;
    prosPtBr = ['Chance real de virar titular se atuar em alto nível'];
    consPtBr = [`Minutos divididos com ${directRival.name} (${directRival.overall} OVR)`];
  } else if (diff < -2 && player.overall >= 80 && directRival) {
    expectedRole = 'SIXTH_MAN';
    roleTitle = '⚡ 6º Homem / Líder da 2ª Unidade';
    expectedMinutes = '22-26 min/jogo (Chave do Banco)';
    isWorthIt = prestige >= 82;
    fitStars = prestige >= 85 ? 4 : 3;
    verdictTitle = prestige >= 82 ? 'Chance de Título (6º Homem)' : 'Risco de Banco ⭐⭐';
    verdictPtBr = isWorthIt 
      ? 'Excelente como 6º homem de luxo em time com aspirações reais de título.' 
      : 'Risco de perder espaço e prestígio vindo do banco em equipe que não briga por troféus.';
    analysisText = `${directRival.name} (${directRival.overall} OVR) é titular consolidado da franquia. Você terá o papel de 6º homem de luxo, liderando a segunda unidade.`;
    prosPtBr = ['Liderança absoluta da segunda unidade', 'Favorito na disputa do prêmio de Sexto Homem (6MOY)'];
    consPtBr = [`Titularidade bloqueada por ${directRival.name} (${directRival.overall} OVR)`];
  } else {
    expectedRole = 'ROTATION';
    roleTitle = '🔄 Rotação Secundária';
    expectedMinutes = '14-18 min/jogo (Reserva)';
    isWorthIt = false;
    fitStars = 2;
    verdictTitle = 'Pouco Recomendado ⭐⭐';
    verdictPtBr = 'Destino desfavorável. A concorrência é forte demais e seus minutos serão severamente cortados.';
    analysisText = directRival
      ? `O ${teamName} já conta com ${directRival.name} (${directRival.overall} OVR) e outros atletas estabelecidos. Você terá poucos minutos de quadra.`
      : `Minutagem limitada de rotação. Recomenda-se buscar equipes com maior necessidade na sua posição.`;
    prosPtBr = ['Contrato oficial garantido na NBA'];
    consPtBr = directRival 
      ? [`Barreira contra ${directRival.name} (${directRival.overall} OVR)`, 'Minutagem escassa (10-18 min/jogo)']
      : ['Tempo de quadra limitado'];
  }

  return {
    targetTeamId,
    targetTeamName: teamName,
    projectType,
    projectLabel,
    fitStars,
    expectedRole,
    roleTitle,
    expectedMinutes,
    directRivalName: directRival ? directRival.name : undefined,
    directRivalOvr: directRival ? directRival.overall : undefined,
    directRivalPosition: directRival ? directRival.position : undefined,
    isWorthIt,
    verdictTitle,
    verdictPtBr,
    analysisText,
    prosPtBr,
    consPtBr,
  };
}

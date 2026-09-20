import { describe, it, expect } from 'vitest';
import { NBA_TEAMS, G_LEAGUE_TEAMS, NCAA_TEAMS, getGLeagueAffiliate } from '../data/teamsRepository';
import { generateTeamBadgeSvg } from '../utils/teamBadges';

describe('ETAPA 1: Modelo de Dados e Infraestrutura de Ativos', () => {
  it('deve conter exatamente 30 franquias da NBA', () => {
    expect(NBA_TEAMS.length).toBe(30);

    const east = NBA_TEAMS.filter(t => t.conference === 'Eastern');
    const west = NBA_TEAMS.filter(t => t.conference === 'Western');
    expect(east.length).toBe(15);
    expect(west.length).toBe(15);

    const ids = new Set(NBA_TEAMS.map(t => t.id));
    expect(ids.size).toBe(30);

    // Validação de formato hexadecimal das cores
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    NBA_TEAMS.forEach(team => {
      expect(team.colors.primary).toMatch(hexRegex);
      expect(team.colors.secondary).toMatch(hexRegex);
      expect(team.colors.text).toMatch(hexRegex);
      expect(team.arena.length).toBeGreaterThan(2);
      expect(team.abbreviation.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('deve conter exatamente 31 equipes na NBA G-League com as afiliações corretas', () => {
    expect(G_LEAGUE_TEAMS.length).toBe(31);

    // Mexico City Capitanes é independente
    const capitanes = G_LEAGUE_TEAMS.find(t => t.id === 'mexico-city-capitanes');
    expect(capitanes).toBeDefined();
    expect(capitanes?.parentAffiliateId).toBeNull();

    // Novas franquias obrigatórias
    const valleySuns = G_LEAGUE_TEAMS.find(t => t.id === 'valley-suns');
    expect(valleySuns).toBeDefined();
    expect(valleySuns?.parentAffiliateId).toBe('phx-suns');

    const noblesvilleBoom = G_LEAGUE_TEAMS.find(t => t.id === 'noblesville-boom');
    expect(noblesvilleBoom).toBeDefined();
    expect(noblesvilleBoom?.parentAffiliateId).toBe('ind-pacers');

    const sdClippers = G_LEAGUE_TEAMS.find(t => t.id === 'san-diego-clippers');
    expect(sdClippers).toBeDefined();
    expect(sdClippers?.parentAffiliateId).toBe('lac-clippers');

    // As outras 30 equipes devem ter franquia NBA afiliada
    const affiliated = G_LEAGUE_TEAMS.filter(t => t.parentAffiliateId !== null);
    expect(affiliated.length).toBe(30);
  });

  it('deve conter os principais programas da NCAA Division I por conferência', () => {
    expect(NCAA_TEAMS.length).toBeGreaterThanOrEqual(25);

    const conferences = new Set(NCAA_TEAMS.map(t => t.conference));
    expect(conferences.has('ACC')).toBe(true);
    expect(conferences.has('Big Ten')).toBe(true);
    expect(conferences.has('Big 12')).toBe(true);
    expect(conferences.has('SEC')).toBe(true);
    expect(conferences.has('Big East')).toBe(true);
  });

  it('deve mapear afiliação de G-League via getGLeagueAffiliate', () => {
    const celticsGLeague = getGLeagueAffiliate('bos-celtics');
    expect(celticsGLeague).toBeDefined();
    expect(celticsGLeague?.id).toBe('maine-celtics');
  });

  it('deve gerar SVG procedural válido para insígnia de emergência', () => {
    const svg = generateTeamBadgeSvg('BOS', '#007A33', '#BA9653', '#FFFFFF');
    expect(svg).toContain('<svg');
    expect(svg).toContain('BOS');
    expect(svg).toContain('#007A33');
    expect(svg).toContain('#BA9653');
    expect(svg).toContain('</svg>');
  });
});

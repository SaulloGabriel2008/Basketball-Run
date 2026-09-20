import { TeamEntity, LeagueId } from '../types';
import nbaData from './nbaTeams.json';
import gleagueData from './gleagueTeams.json';
import ncaaData from './ncaaTeams.json';

export const NBA_TEAMS: TeamEntity[] = nbaData as TeamEntity[];
export const G_LEAGUE_TEAMS: TeamEntity[] = gleagueData as TeamEntity[];
export const NCAA_TEAMS: TeamEntity[] = ncaaData as TeamEntity[];

export const ALL_TEAMS: TeamEntity[] = [
  ...NBA_TEAMS,
  ...G_LEAGUE_TEAMS,
  ...NCAA_TEAMS,
];

const teamMap = new Map<string, TeamEntity>();
ALL_TEAMS.forEach(team => {
  teamMap.set(team.id, team);
});

export function getTeamById(id: string): TeamEntity | undefined {
  return teamMap.get(id);
}

export function getTeamsByLeague(league: LeagueId): TeamEntity[] {
  return ALL_TEAMS.filter(t => t.league === league);
}

export function getTeamsByConference(league: LeagueId, conference: string): TeamEntity[] {
  return ALL_TEAMS.filter(t => t.league === league && t.conference === conference);
}

export function getGLeagueAffiliate(nbaTeamId: string): TeamEntity | undefined {
  return G_LEAGUE_TEAMS.find(g => g.parentAffiliateId === nbaTeamId);
}

export function getParentNbaTeam(gleagueTeamId: string): TeamEntity | undefined {
  const gTeam = teamMap.get(gleagueTeamId);
  if (!gTeam || !gTeam.parentAffiliateId) return undefined;
  return teamMap.get(gTeam.parentAffiliateId);
}

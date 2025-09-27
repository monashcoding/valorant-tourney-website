export interface Player {
  id: string;
  name: string;
  ign: string;
  role?: string;
}

export interface Team {
  id: string;
  abbreviation: string;
  name: string;
  members: Player[];
  stats?: TeamStats;
}

export interface TeamStats {
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  mapWins: number;
  mapLosses: number;
}

export interface MapResult {
  mapName: string;
  team1Score: number;
  team2Score: number;
  duration?: number;
}

export type MatchFormat = 'BO1' | 'BO3' | 'BO5';

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  scheduledTime: Date;
  startTime?: Date;
  endTime?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'postponed';
  format: MatchFormat;
  maps: MapResult[];
  winner?: Team;
  bracketPosition?: string;
  roundNumber?: number;
  slotNumber?: number;
  stage: 'group-stage' | 'semifinal' | 'winners-final' | 'losers-final' | 'grand-final';
}

export interface TournamentSlot {
  id: string;
  number: number;
  timeSlot: string;
  matches: Match[];
}

export interface TournamentRound {
  id: string;
  number: number;
  name: string;
  description: string;
  timeSlot: string;
  slots: TournamentSlot[];
}

export interface TournamentDay {
  id: string;
  dayNumber: number;
  date: Date;
  rounds: TournamentRound[];
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  team: Team;
  wins: number;
  losses: number;
  score: number;
  eliminationStatus: 'eliminated' | 'advanced' | 'pending';
}

export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  days: TournamentDay[];
  currentDay?: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  qualifiedTeams: Team[];
  winners?: Team[];
}

export interface BracketStage {
  id: string;
  name: string;
  type: 'single-elimination' | 'double-elimination' | 'round-robin';
  rounds: TournamentRound[];
}

export interface Bracket {
  id: string;
  name: string;
  stages: BracketStage[];
  finals?: Match[];
  champion?: Team;
}
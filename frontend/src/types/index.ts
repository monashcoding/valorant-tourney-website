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
}

export interface MapResult {
  mapName: string;
  team1Score: number;
  team2Score: number;
}

export type MatchFormat = "BO1" | "BO3";

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  scheduledTime: Date;
  status: "scheduled" | "in-progress" | "completed";
  format: MatchFormat;
  maps: MapResult[];
  winner?: Team;
}

export interface TournamentSlot {
  id: string;
  number: number;
  matches: Match[];
}

export interface TournamentRound {
  id: string;
  number: number;
  name: string;
  slots: TournamentSlot[];
}

export interface TournamentDay {
  id: string;
  dayNumber: number;
  date: Date;
  rounds: TournamentRound[];
}

export interface Tournament {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  days: TournamentDay[];
  qualifiedTeams: Team[];
  status: "upcoming" | "ongoing" | "completed";
}

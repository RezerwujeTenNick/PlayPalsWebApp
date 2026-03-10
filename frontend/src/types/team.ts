import type { User } from "./user";

export interface Team {
  id: number;
  name: string;
  owner_id: number;
  captain_id: number | null;
  category: string;
  created_at: string;
}

export interface TeamDetail extends Team {
  members: User[];
}

export type MatchOutcome = "W" | "L" | "D";

export interface MatchResult {
  id: number;
  tournament_id: number;
  tournament_name: string;
  opponent_name: string;
  goals_scored: number;
  goals_conceded: number;
  outcome: MatchOutcome;
  date: string;
}

export interface TeamTournamentRef {
  id: number;
  name: string;
  date: string;
  status: string;
}

export interface TeamStats {
  matches: MatchResult[];
  previous_tournament: TeamTournamentRef | null;
  upcoming_tournament: TeamTournamentRef | null;
}

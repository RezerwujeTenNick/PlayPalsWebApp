export type TournamentStatus = "draft" | "open" | "in_progress" | "finished";
export type TournamentType = "league" | "cup" | "friendly";

export interface Tournament {
  id: number;
  name: string;
  date: string;           // ISO datetime string "2025-04-20T14:00:00"
  location: string;
  status: TournamentStatus;
  tournament_type: TournamentType;
  min_teams: number;
  max_teams: number;
  creator_id: number;
  is_paid: boolean;
  entry_fee: number | null;
  created_at: string;
  updated_at: string;
}

export interface EnrolledTeam {
  id: number;
  name: string;
}

export interface TournamentDetail extends Tournament {
  enrolled_team_ids: number[];
  enrolled_teams: EnrolledTeam[];
}

// ─── Matches / Schedule ───────────────────────────────────────────────────────

export type MatchStatus = "scheduled" | "in_progress" | "finished";

export interface TournamentMatch {
  id: number;
  tournament_id: number;
  round: number;
  match_number: number;
  home_team_id: number | null;
  away_team_id: number | null;
  home_team_name: string;
  away_team_name: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  scheduled_time: string | null;
}

// ─── Cup bracket ──────────────────────────────────────────────────────────────

export interface BracketRound {
  round: number;
  label: string;
  matches: TournamentMatch[];
}

export interface TournamentBracket {
  tournament_id: number;
  rounds: BracketRound[];
}

// ─── League table ─────────────────────────────────────────────────────────────

export interface LeagueRow {
  team_id: number;
  team_name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export interface LeagueTable {
  tournament_id: number;
  rows: LeagueRow[];
  matches: TournamentMatch[];
}

// ─── Protocol ─────────────────────────────────────────────────────────────────

export interface ProtocolPlayerNote {
  player_id: number;
  player_name: string;
  distinguished: boolean;
  note: string;
}

export interface ProtocolTeamEntry {
  team_id: number;
  team_name: string;
  coaches: string[];
  players_count: number;
  player_notes: ProtocolPlayerNote[];
}

export interface TournamentProtocol {
  tournament_id: number;
  tournament_name: string;
  date: string;
  location: string;
  teams_count: number;
  matches_played: number;
  show_results: boolean;
  team_entries: ProtocolTeamEntry[];
  atmosphere: "excellent" | "good" | "average" | "poor";
  parents_behavior: "excellent" | "good" | "average" | "poor";
  notes: string;
}

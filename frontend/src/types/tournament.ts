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

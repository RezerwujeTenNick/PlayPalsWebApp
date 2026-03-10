import type { TournamentStatus, TournamentType } from "../types/tournament";

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  draft:       "Draft",
  open:        "Zapisy",
  in_progress: "W toku",
  finished:    "Zakończony",
};

export const TOURNAMENT_STATUS_COLORS: Record<TournamentStatus, string> = {
  draft:       "bg-slate-700/50 text-slate-300 border-slate-600/50",
  open:        "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  in_progress: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  finished:    "bg-red-500/15 text-red-300 border-red-400/30",
};

export const TOURNAMENT_TYPE_LABELS: Record<TournamentType, string> = {
  league:   "Liga",
  cup:      "Puchar",
  friendly: "Towarzyski",
};

export function getStatusLabel(status: TournamentStatus): string {
  return TOURNAMENT_STATUS_LABELS[status] ?? status;
}

export function getStatusColor(status: TournamentStatus): string {
  return TOURNAMENT_STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600";
}

export function getTypeLabel(type: TournamentType): string {
  return TOURNAMENT_TYPE_LABELS[type] ?? type;
}

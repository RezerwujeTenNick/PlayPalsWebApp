import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Tournament, TournamentDetail } from "../../types/tournament";
import { getStatusLabel, getStatusColor, getTypeLabel } from "../../helpers/tournamentHelpers";
import { getTournament } from "../../api/client";
import { Calendar, MapPin, Users, Trophy, Coins, CheckCircle, ClipboardList, Shield, Clock, ExternalLink } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface Props {
  tournament: Tournament;
  canEnroll: boolean;
  onEnroll: (tournament: Tournament) => void;
}

function formatDateTime(dateStr: string): { date: string; time: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: dateStr, time: "" };
  const date = d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

export default function TournamentCard({ tournament: t, canEnroll, onEnroll }: Props) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<TournamentDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { date, time } = formatDateTime(t.date);

  async function handleToggle() {
    if (!expanded && !detail) {
      setLoadingDetail(true);
      try {
        const data = await getTournament(t.id);
        setDetail(data as TournamentDetail);
      } finally {
        setLoadingDetail(false);
      }
    }
    setExpanded((v) => !v);
  }

  return (
    <Card hoverable className={`transition-all cursor-pointer ${expanded ? "border-(--color-border-soft)" : ""}`} onClick={handleToggle}>
      <div className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-(--color-text-primary)">{t.name}</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusColor(t.status)}`}>
                {getStatusLabel(t.status)}
              </span>
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 text-(--color-text-secondary) border border-(--color-border) font-medium">
                <Trophy className="w-3 h-3" />
                {getTypeLabel(t.tournament_type)}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-col gap-2 text-xs text-(--color-text-muted)">
              <div className="flex gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {date}
                </span>
                {time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {time}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {t.min_teams}–{t.max_teams} drużyn
                </span>
                {t.is_paid
                  ? <span className="flex items-center gap-1 text-(--color-warning)">
                      <Coins className="w-3.5 h-3.5" />
                      {t.entry_fee} PLN
                    </span>
                  : <span className="flex items-center gap-1 text-(--color-success)">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Darmowy
                    </span>
                }
              </div>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {t.location}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); navigate(`/tournaments/${t.id}`); }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Podgląd
            </Button>
            {canEnroll && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onEnroll(t); }}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Dołącz
              </Button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-(--color-border) px-5 pb-5 pt-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs text-(--color-text-muted) uppercase tracking-wider font-semibold">
              Drużyny
            </p>
            {!loadingDetail && detail && (
              <span className={`text-xs rounded-full px-2 py-0.5 font-semibold ${
                detail.enrolled_teams.length >= t.max_teams
                  ? "bg-(--color-error)/15 text-(--color-error)"
                  : "bg-(--color-primary)/15 text-(--color-primary)"
              }`}>
                {detail.enrolled_teams.length}/{t.max_teams}
              </span>
            )}
          </div>
          {loadingDetail ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : detail ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {detail.enrolled_teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center gap-2 bg-(--color-primary)/8 border border-(--color-primary)/20 rounded-xl px-3 py-2"
                >
                  <div className="w-5 h-5 rounded-md bg-(--color-primary)/15 flex items-center justify-center shrink-0">
                    <Shield className="w-3 h-3 text-(--color-primary)" />
                  </div>
                  <span className="text-sm font-medium text-(--color-text-secondary) truncate">{team.name}</span>
                </div>
              ))}

              {Array.from({ length: t.max_teams - detail.enrolled_teams.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-2 border border-dashed border-(--color-border) rounded-xl px-3 py-2 opacity-90"
                >
                  <div className="w-5 h-5 rounded-md border border-(--color-border-soft) flex items-center justify-center shrink-0">
                    <Shield className="w-3 h-3 text-(--color-text-muted)" />
                  </div>
                  <span className="text-xs text-(--color-text-muted)">Wolne miejsce</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}

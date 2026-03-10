import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getTeam, getTeamStats } from "../api/client";
import type { TeamDetail, TeamStats } from "../types/team";
import type { User } from "../types/user";
import { getCategoryLabel } from "../helpers/teamHelpers";
import {
  ArrowLeft, Shield, Crown, Star, Users, Calendar,
  Trophy, ChevronDown, ChevronUp, Target, Swords,
  TrendingUp, Clock, CheckCircle2, XCircle, MinusCircle,
  ArrowRight,
} from "lucide-react";
import Button from "../components/ui/Button";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

// ─── Member Card ─────────────────────────────────────────────────────────────

function MemberCard({ member, isCaptain, isOwner }: { member: User; isCaptain: boolean; isOwner: boolean }) {
  const age = calcAge(member.date_of_birth);
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-(--color-primary)/15 border border-(--color-primary)/25 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-(--color-primary)">{member.nickname.charAt(0).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-(--color-text-primary) text-sm">{member.nickname}</span>
          {isCaptain && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/25 font-medium">
              <Crown className="w-3 h-3" /> Kapitan
            </span>
          )}
          {isOwner && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/25 font-medium">
              <Star className="w-3 h-3" /> Manager
            </span>
          )}
        </div>
        {member.date_of_birth ? (
          <span className="flex items-center gap-1 text-xs text-(--color-text-muted) mt-0.5">
            <Calendar className="w-3 h-3" />
            {age} lat
          </span>
        ) : (
          <span className="text-xs text-(--color-text-muted) italic mt-0.5 block">brak daty urodzenia</span>
        )}
      </div>
    </div>
  );
}

// ─── Outcome Badge ────────────────────────────────────────────────────────────

function OutcomeBadge({ outcome }: { outcome: "W" | "L" | "D" }) {
  if (outcome === "W") return (
    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">W</span>
  );
  if (outcome === "L") return (
    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-black">P</span>
  );
  return (
    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-600/50 border border-slate-500/30 text-slate-300 text-xs font-black">R</span>
  );
}

// ─── Stats Widget ─────────────────────────────────────────────────────────────

function StatsWidget({ stats }: { stats: TeamStats }) {
  const [expanded, setExpanded] = useState(false);
  const { matches } = stats;

  const wins   = matches.filter((m) => m.outcome === "W").length;
  const losses = matches.filter((m) => m.outcome === "L").length;
  const draws  = matches.filter((m) => m.outcome === "D").length;
  const goalsFor     = matches.reduce((s, m) => s + m.goals_scored, 0);
  const goalsAgainst = matches.reduce((s, m) => s + m.goals_conceded, 0);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-(--color-primary)" />
          <span className="text-sm font-bold text-(--color-text-primary)">Ostatnie {matches.length} meczów</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {matches.map((m, i) => (
              <OutcomeBadge key={i} outcome={m.outcome} />
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs font-semibold ml-2 border-l border-(--color-border) pl-3">
            <span className="flex items-center gap-1 text-(--color-success)"><CheckCircle2 className="w-3.5 h-3.5" />{wins}</span>
            <span className="flex items-center gap-1 text-(--color-text-muted)"><MinusCircle className="w-3.5 h-3.5" />{draws}</span>
            <span className="flex items-center gap-1 text-(--color-error)"><XCircle className="w-3.5 h-3.5" />{losses}</span>
          </div>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-(--color-text-muted) ml-1" />
            : <ChevronDown className="w-4 h-4 text-(--color-text-muted) ml-1" />
          }
        </div>
      </button>

      {expanded && (
        <div className="border-t border-(--color-border) divide-y divide-(--color-border)">
          <div className="px-5 py-3 flex items-center gap-6 text-xs text-(--color-text-muted) bg-white/2">
            <span className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-(--color-success)" />
              Bramki zdobyte: <strong className="text-(--color-success)">{goalsFor}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-(--color-error)" />
              Bramki stracone: <strong className="text-(--color-error)">{goalsAgainst}</strong>
            </span>
          </div>
          {matches.map((m) => (
            <div key={m.id} className="px-5 py-3 flex items-center gap-3">
              <OutcomeBadge outcome={m.outcome} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-(--color-text-primary)">{m.opponent_name}</span>
                  <span className="text-xs text-(--color-text-muted)">{m.tournament_name}</span>
                </div>
                <span className="text-xs text-(--color-text-muted) flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />{m.date}
                </span>
              </div>
              <div className={`text-sm font-black tabular-nums px-3 py-1 rounded-lg ${
                m.outcome === "W"
                  ? "bg-(--color-success)/15 text-(--color-success)"
                  : m.outcome === "L"
                  ? "bg-(--color-error)/15 text-(--color-error)"
                  : "bg-white/5 text-(--color-text-secondary)"
              }`}>
                {m.goals_scored}:{m.goals_conceded}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tournament Ref Card ──────────────────────────────────────────────────────

function TournamentRefCard({ label, tournament }: { label: string; tournament: TeamStats["previous_tournament"] | TeamStats["upcoming_tournament"] }) {
  if (!tournament) return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-3 opacity-40">
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-(--color-border) flex items-center justify-center shrink-0">
        <Trophy className="w-4 h-4 text-(--color-text-muted)" />
      </div>
      <div>
        <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm text-(--color-text-muted) italic">Brak</p>
      </div>
    </div>
  );

  return (
    <Link
      to="/dashboard"
      className="glass-card rounded-xl p-4 flex items-center gap-3 hover:border-(--color-primary)/30 transition-all group"
    >
      <div className="w-9 h-9 rounded-lg bg-(--color-primary)/10 border border-(--color-primary)/20 flex items-center justify-center shrink-0">
        <Trophy className="w-4 h-4 text-(--color-primary)" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-(--color-text-primary) truncate">{tournament.name}</p>
        <p className="text-xs text-(--color-text-muted) flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3" />{formatDate(tournament.date)}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-(--color-text-muted) group-hover:text-(--color-primary) transition-colors shrink-0" />
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getTeam(Number(id)),
      getTeamStats(Number(id)),
    ])
      .then(([teamData, statsData]) => {
        setTeam(teamData as TeamDetail);
        setStats(statsData as TeamStats);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Błąd"))
      .finally(() => setLoading(false));
  }, [id]);

  const coaches  = team?.members.filter((m) => m.role === "trener")  ?? [];
  const players  = team?.members.filter((m) => m.role === "zawodnik") ?? [];
  const ownerUser = team?.members.find((m) => m.id === team.owner_id) ?? null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-6">

        {/* Back */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft />
          Powrót
        </Button>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/5 border border-white/8 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card rounded-xl p-6 text-center text-(--color-error)">{error}</div>
        )}

        {!loading && team && (
          <>
            {/* ── Header ── */}
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-(--color-primary)/5 blur-3xl rounded-full pointer-events-none" />
              <div className="flex items-center gap-5 relative">
                <div className="w-16 h-16 rounded-2xl bg-(--color-primary)/10 border border-(--color-primary)/25 flex items-center justify-center shrink-0 shadow-lg shadow-(--color-primary)/10">
                  <Shield className="w-8 h-8 text-(--color-primary)" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-(--color-text-primary) tracking-tight">{team.name}</h1>
                  <p className="text-(--color-text-muted) text-sm mt-0.5">{getCategoryLabel(team.category)}</p>
                  {ownerUser && (
                    <p className="text-xs text-(--color-text-muted) mt-1 flex items-center gap-1">
                      <Star className="w-3 h-3 text-(--color-warning)" />
                      Manager: <span className="text-(--color-warning) font-semibold">{ownerUser.nickname}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Stats (last 5 matches) ── */}
            {stats && stats.matches.length > 0 && (
              <StatsWidget stats={stats} />
            )}

            {/* ── Tournament refs ── */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TournamentRefCard label="Poprzedni turniej" tournament={stats.previous_tournament} />
                <TournamentRefCard label="Nadchodzący turniej" tournament={stats.upcoming_tournament} />
              </div>
            )}

            {/* ── Coaches ── */}
            {coaches.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-(--color-warning)" />
                  <h2 className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider">
                    Trenerzy <span className="text-(--color-text-muted) font-normal">({coaches.length})</span>
                  </h2>
                </div>
                <div className="space-y-2">
                  {coaches.map((m) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      isCaptain={false}
                      isOwner={m.id === team.owner_id}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Players ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-(--color-primary)" />
                <h2 className="text-sm font-bold text-(--color-text-secondary) uppercase tracking-wider">
                  Zawodnicy <span className="text-(--color-text-muted) font-normal">({players.length})</span>
                </h2>
              </div>
              {players.length === 0 ? (
                <div className="glass-card rounded-xl p-6 text-center text-(--color-text-muted) text-sm">
                  Brak zawodników w drużynie.
                </div>
              ) : (
                <div className="space-y-2">
                  {players.map((m) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      isCaptain={m.id === team.captain_id}
                      isOwner={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonGrid, SkeletonList } from "../components/ui/Skeleton";
import TeamCard from "../features/teams/TeamCard";
import TournamentCard from "../features/tournaments/TournamentCard";
import CreateTeamModal from "../features/teams/CreateTeamModal";
import CreateTournamentModal from "../features/tournaments/CreateTournamentModal";
import EnrollModal from "../features/tournaments/EnrollModal";
import { getTeams, getTournaments, joinTeam } from "../api/client";
import type { Team } from "../types/team";
import type { Tournament } from "../types/tournament";
import { AlertCircle, Plus, SlidersHorizontal } from "lucide-react";
import Button from "../components/ui/Button";

type TournamentFilter = "all" | "mine";
type PaidFilter = "all" | "free" | "paid";
type SortOrder = "date_asc" | "date_desc";

export default function DashboardPage() {
  const { user } = useAuth();
  const isTrener = user?.role === "trener";

  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinError, setJoinError] = useState("");

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState<Tournament | null>(null);

  // Tournament filters
  const [tournamentFilter, setTournamentFilter] = useState<TournamentFilter>("all");
  const [paidFilter, setPaidFilter] = useState<PaidFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("date_asc");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [t, tr] = await Promise.all([getTeams(), getTournaments()]);
      setTeams(t as Team[]);
      setTournaments(tr as Tournament[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleJoin(teamId: number) {
    setJoinError("");
    try {
      await joinTeam(teamId);
      fetchData();
    } catch (err: unknown) {
      setJoinError(err instanceof Error ? err.message : "Błąd");
    }
  }

  // Teams: only user's own teams
  const myTeams = useMemo(
    () => teams.filter((t) => t.owner_id === user?.id),
    [teams, user]
  );

  // Tournaments with filters
  const filteredTournaments = useMemo(() => {
    let list = [...tournaments];

    if (tournamentFilter === "mine") {
      list = list.filter((t) => t.creator_id === user?.id);
    }

    if (paidFilter === "free") list = list.filter((t) => !t.is_paid);
    if (paidFilter === "paid") list = list.filter((t) => t.is_paid);

    list.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "date_asc" ? diff : -diff;
    });

    return list;
  }, [tournaments, tournamentFilter, paidFilter, sortOrder, user]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        {/* Teams section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-(--color-text-primary)">Moje drużyny</h2>
            {isTrener && (
              <Button variant="primary" size="sm" onClick={() => setShowCreateTeam(true)}>
                <Plus className="w-3.5 h-3.5" />
                Utwórz drużynę
              </Button>
            )}
          </div>

          {joinError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/30 text-red-300 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {joinError}
            </div>
          )}

          {loading ? (
            <SkeletonGrid count={2} />
          ) : myTeams.length === 0 ? (
            <EmptyState
              icon="🏆"
              message="Brak drużyn"
              submessage={isTrener ? "Utwórz pierwszą!" : "Poczekaj aż trener doda Cię do drużyny."}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  canJoin={false}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          )}
        </section>

        {/* Tournaments section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-(--color-text-primary)">Turnieje</h2>
            {isTrener && (
              <Button variant="primary" size="sm" onClick={() => setShowCreateTournament(true)}>
                <Plus className="w-3.5 h-3.5" />
                Utwórz turniej
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-5 items-center">
            <SlidersHorizontal className="w-4 h-4 text-(--color-text-muted) shrink-0" />

            {/* mine / all */}
            <div className="flex rounded-xl overflow-hidden border border-(--color-border-soft) text-xs font-semibold">
              {(["all", "mine"] as TournamentFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setTournamentFilter(f)}
                  className={`px-3 py-1.5 transition-colors ${
                    tournamentFilter === f
                      ? "bg-(--color-primary) text-(--color-bg)"
                      : "text-(--color-text-muted) hover:text-(--color-text-secondary) hover:bg-white/5"
                  }`}
                >
                  {f === "all" ? "Wszystkie" : "Moje"}
                </button>
              ))}
            </div>

            {/* free / paid */}
            <div className="flex rounded-xl overflow-hidden border border-(--color-border-soft) text-xs font-semibold">
              {(["all", "free", "paid"] as PaidFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setPaidFilter(f)}
                  className={`px-3 py-1.5 transition-colors ${
                    paidFilter === f
                      ? "bg-(--color-primary) text-(--color-bg)"
                      : "text-(--color-text-muted) hover:text-(--color-text-secondary) hover:bg-white/5"
                  }`}
                >
                  {f === "all" ? "Wszystkie" : f === "free" ? "Darmowe" : "Płatne"}
                </button>
              ))}
            </div>

            {/* sort */}
            <div className="flex rounded-xl overflow-hidden border border-(--color-border-soft) text-xs font-semibold">
              {(["date_asc", "date_desc"] as SortOrder[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortOrder(s)}
                  className={`px-3 py-1.5 transition-colors ${
                    sortOrder === s
                      ? "bg-(--color-primary) text-(--color-bg)"
                      : "text-(--color-text-muted) hover:text-(--color-text-secondary) hover:bg-white/5"
                  }`}
                >
                  {s === "date_asc" ? "Data ↑" : "Data ↓"}
                </button>
              ))}
            </div>

            {filteredTournaments.length !== tournaments.length && (
              <span className="text-xs text-(--color-text-muted) ml-1">
                {filteredTournaments.length} z {tournaments.length}
              </span>
            )}
          </div>

          {loading ? (
            <SkeletonList count={3} />
          ) : filteredTournaments.length === 0 ? (
            <EmptyState
              icon="🎯"
              message="Brak turniejów"
              submessage={tournamentFilter === "mine" ? "Nie masz jeszcze żadnych turniejów." : "Brak turniejów spełniających kryteria."}
            />
          ) : (
            <div className="space-y-4">
              {filteredTournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  tournament={t}
                  canEnroll={isTrener && t.status !== "finished" && myTeams.length > 0}
                  onEnroll={setEnrollTarget}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {showCreateTeam && (
        <CreateTeamModal onClose={() => setShowCreateTeam(false)} onCreated={fetchData} />
      )}
      {showCreateTournament && (
        <CreateTournamentModal onClose={() => setShowCreateTournament(false)} onCreated={fetchData} />
      )}
      {enrollTarget && (
        <EnrollModal
          tournamentId={enrollTarget.id}
          tournamentName={enrollTarget.name}
          myTeams={myTeams}
          onClose={() => setEnrollTarget(null)}
          onEnrolled={fetchData}
        />
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import SectionHeader from "../components/ui/SectionHeader";
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
import { AlertCircle } from "lucide-react";

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

  const ownedTeams = teams.filter((t) => t.owner_id === user?.id);

  return (
    <div
      className="min-h-screen"
    >
      <Navbar />

      <main className="max-w-5xl mx-auto p-6 space-y-10">
        <section>
          <SectionHeader
            title="Drużyny"
            showAction={isTrener}
            actionLabel="Utwórz drużynę"
            onAction={() => setShowCreateTeam(true)}
          />

          {joinError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/30 text-red-300 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {joinError}
            </div>
          )}

          {loading ? (
            <SkeletonGrid count={2} />
          ) : teams.length === 0 ? (
            <EmptyState
              icon="🏆"
              message="Brak drużyn"
              submessage={isTrener ? "Utwórz pierwszą!" : "Poczekaj aż trener stworzy drużynę."}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  canJoin={!isTrener && team.owner_id !== user?.id}
                  onJoin={handleJoin}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeader
            title="Turnieje"
            showAction={isTrener}
            actionLabel="Utwórz turniej"
            onAction={() => setShowCreateTournament(true)}
          />

          {loading ? (
            <SkeletonList count={3} />
          ) : tournaments.length === 0 ? (
            <EmptyState
              icon="🎯"
              message="Brak turniejów"
              submessage={isTrener ? "Utwórz pierwszy!" : "Poczekaj na turnieje."}
            />
          ) : (
            <div className="space-y-4">
              {tournaments.map((t) => (
                <TournamentCard
                  key={t.id}
                  tournament={t}
                  canEnroll={isTrener && t.status !== "finished" && ownedTeams.length > 0}
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
          myTeams={ownedTeams}
          onClose={() => setEnrollTarget(null)}
          onEnrolled={fetchData}
        />
      )}
    </div>
  );
}

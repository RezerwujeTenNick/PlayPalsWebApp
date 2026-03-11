import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Calendar, MapPin, Users, Coins, CheckCircle, Clock, FileText, GitBranch, Table2, Shield } from "lucide-react";
import { getTournament, getTournamentBracket, getTournamentSchedule, getTournamentProtocol } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { TournamentDetail, TournamentBracket, LeagueTable, TournamentProtocol } from "../types/tournament";
import { getStatusLabel, getStatusColor, getTypeLabel } from "../helpers/tournamentHelpers";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import BracketView from "../features/tournaments/BracketView";
import LeagueTableView from "../features/tournaments/LeagueTableView";
import ProtocolModal from "../features/tournaments/ProtocolModal";

function formatDateTime(dateStr: string): { date: string; time: string } {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: dateStr, time: "" };
  return {
    date: d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }),
  };
}

type Tab = "bracket" | "table" | "schedule";

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [bracket, setBracket] = useState<TournamentBracket | null>(null);
  const [leagueTable, setLeagueTable] = useState<LeagueTable | null>(null);
  const [protocol, setProtocol] = useState<TournamentProtocol | null>(null);
  const [showProtocol, setShowProtocol] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("bracket");

  const tournamentId = Number(id);
  const isOrganizer = user?.id === tournament?.creator_id;
  const isCup = tournament?.tournament_type === "cup";
  const isLeague = tournament?.tournament_type === "league";

  useEffect(() => {
    if (!tournamentId) return;
    setLoading(true);
    getTournament(tournamentId)
      .then((t) => {
        setTournament(t as TournamentDetail);
        const type = (t as TournamentDetail).tournament_type;
        if (type === "cup") {
          setActiveTab("bracket");
          return getTournamentBracket(tournamentId);
        } else if (type === "league") {
          setActiveTab("table");
          return getTournamentSchedule(tournamentId);
        }
        return null;
      })
      .then((data) => {
        if (!data) return;
        if ("rounds" in data) setBracket(data as TournamentBracket);
        else setLeagueTable(data as LeagueTable);
      })
      .finally(() => setLoading(false));
  }, [tournamentId]);

  async function handleOpenProtocol() {
    if (!protocol) {
      const p = await getTournamentProtocol(tournamentId);
      setProtocol(p);
    }
    setShowProtocol(true);
  }

  async function handleLoadBracket() {
    if (!bracket) {
      const data = await getTournamentBracket(tournamentId);
      setBracket(data as TournamentBracket);
    }
    setActiveTab("bracket");
  }

  async function handleLoadTable() {
    if (!leagueTable) {
      const data = await getTournamentSchedule(tournamentId);
      setLeagueTable(data as LeagueTable);
    }
    setActiveTab("table");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-(--color-bg) flex flex-col items-center justify-center gap-4">
        <p className="text-(--color-text-muted)">Nie znaleziono turnieju.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Wróć
        </Button>
      </div>
    );
  }

  const { date, time } = formatDateTime(tournament.date);

  return (
    <div className="min-h-screen bg-(--color-bg)">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Back */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft />
          Powrót
        </Button>

        {/* Header card */}
        <Card radius="2xl" className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-(--color-primary)/15 border border-(--color-primary)/25 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-(--color-primary)" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-(--color-text-primary)">{tournament.name}</h1>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusColor(tournament.status)}`}>
                    {getStatusLabel(tournament.status)}
                  </span>
                </div>
                <span className="text-sm text-(--color-text-muted)">{getTypeLabel(tournament.tournament_type)}</span>
              </div>
            </div>

            {/* Organizer actions */}
            {isOrganizer && (
              <div className="flex gap-2 flex-wrap">
                {(isCup || isLeague) && (
                  <Button variant="outline" size="sm" onClick={isCup ? handleLoadBracket : handleLoadTable}>
                    {isCup
                      ? <><GitBranch className="w-3.5 h-3.5 mr-1" />Drzewko</>
                      : <><Table2 className="w-3.5 h-3.5 mr-1" />Tabela</>
                    }
                  </Button>
                )}
                <Button variant="primary" size="sm" onClick={handleOpenProtocol}>
                  <FileText className="w-3.5 h-3.5 mr-1" />
                  Protokół
                </Button>
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-(--color-text-muted)">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
            {time && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {time}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {tournament.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {tournament.min_teams}–{tournament.max_teams} drużyn
            </span>
            {tournament.is_paid ? (
              <span className="flex items-center gap-1.5 text-(--color-warning)">
                <Coins className="w-4 h-4" />
                {tournament.entry_fee} PLN / drużyna
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-(--color-success)">
                <CheckCircle className="w-4 h-4" />
                Darmowy
              </span>
            )}
          </div>
        </Card>

        {/* Enrolled teams */}
        <Card radius="2xl" className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wider">Drużyny</h2>
            <span className={`text-xs rounded-full px-2 py-0.5 font-semibold ${
              tournament.enrolled_teams.length >= tournament.max_teams
                ? "bg-(--color-error)/15 text-(--color-error)"
                : "bg-(--color-primary)/15 text-(--color-primary)"
            }`}>
              {tournament.enrolled_teams.length}/{tournament.max_teams}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tournament.enrolled_teams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="flex items-center gap-2 bg-(--color-primary)/8 border border-(--color-primary)/20 rounded-xl px-3 py-2 hover:border-(--color-primary)/40 transition-colors"
              >
                <div className="w-5 h-5 rounded-md bg-(--color-primary)/15 flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3 text-(--color-primary)" />
                </div>
                <span className="text-sm font-medium text-(--color-text-secondary) truncate">{team.name}</span>
              </Link>
            ))}
            {Array.from({ length: tournament.max_teams - tournament.enrolled_teams.length }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-2 border border-dashed border-(--color-border) rounded-xl px-3 py-2">
                <div className="w-5 h-5 rounded-md border border-(--color-border-soft) flex items-center justify-center shrink-0">
                  <Shield className="w-3 h-3 text-(--color-text-muted)" />
                </div>
                <span className="text-xs text-(--color-text-muted)">Wolne miejsce</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bracket / Table / Schedule */}
        {(isCup || isLeague) && (
          <Card radius="2xl" className="p-5">
            <div className="flex items-center gap-3 mb-4">
              {isCup && (
                <h2 className="text-sm font-semibold text-(--color-text-secondary) uppercase tracking-wider flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4" /> Drzewko turniejowe
                </h2>
              )}
              {isLeague && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("table")}
                    className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      activeTab === "table" ? "text-(--color-primary)" : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
                    }`}
                  >
                    <Table2 className="w-4 h-4" /> Tabela
                  </button>
                  <button
                    onClick={() => setActiveTab("schedule")}
                    className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                      activeTab === "schedule" ? "text-(--color-primary)" : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
                    }`}
                  >
                    <Calendar className="w-4 h-4" /> Terminarz
                  </button>
                </div>
              )}
            </div>

            {isCup && bracket && <BracketView bracket={bracket} />}
            {isLeague && leagueTable && activeTab === "table" && (
              <LeagueTableView table={{ ...leagueTable, matches: [] }} />
            )}
            {isLeague && leagueTable && activeTab === "schedule" && (
              <LeagueTableView table={{ tournament_id: leagueTable.tournament_id, rows: [], matches: leagueTable.matches }} />
            )}
          </Card>
        )}
      </div>

      {showProtocol && protocol && (
        <ProtocolModal protocol={protocol} onClose={() => setShowProtocol(false)} />
      )}
    </div>
  );
}

import type { TournamentBracket, TournamentMatch } from "../../types/tournament";

interface Props {
  bracket: TournamentBracket;
}

function MatchCard({ match }: { match: TournamentMatch }) {
  const isFinished = match.status === "finished";
  const homeName = match.home_team_name || "TBD";
  const awayName = match.away_team_name || "TBD";

  return (
    <div className="glass-card rounded-xl p-3 min-w-[180px] text-sm">
      <div className={`flex items-center justify-between gap-2 mb-1 ${
        isFinished && match.home_score !== null && match.away_score !== null && match.home_score > match.away_score
          ? "font-bold text-(--color-text-primary)"
          : "text-(--color-text-secondary)"
      }`}>
        <span className="truncate">{homeName}</span>
        {isFinished && match.home_score !== null ? (
          <span className="text-(--color-primary) font-mono font-bold">{match.home_score}</span>
        ) : (
          <span className="text-(--color-text-muted)">—</span>
        )}
      </div>
      <div className={`flex items-center justify-between gap-2 ${
        isFinished && match.home_score !== null && match.away_score !== null && match.away_score > match.home_score
          ? "font-bold text-(--color-text-primary)"
          : "text-(--color-text-secondary)"
      }`}>
        <span className="truncate">{awayName}</span>
        {isFinished && match.away_score !== null ? (
          <span className="text-(--color-primary) font-mono font-bold">{match.away_score}</span>
        ) : (
          <span className="text-(--color-text-muted)">—</span>
        )}
      </div>
      {match.scheduled_time && !isFinished && (
        <p className="text-xs text-(--color-text-muted) mt-1.5">
          {new Date(match.scheduled_time).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
        </p>
      )}
    </div>
  );
}

export default function BracketView({ bracket }: Props) {
  if (!bracket.rounds.length) {
    return (
      <p className="text-center text-(--color-text-muted) py-8">Brak drzewka — turniej jeszcze nie wystartował.</p>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-8 min-w-max">
        {bracket.rounds.map((round) => (
          <div key={round.round} className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-(--color-text-muted) uppercase tracking-wider text-center mb-2">
              {round.label}
            </h3>
            <div className="flex flex-col gap-4 justify-around flex-1">
              {round.matches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

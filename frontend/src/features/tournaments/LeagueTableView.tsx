import type { LeagueTable, TournamentMatch } from "../../types/tournament";

interface Props {
  table: LeagueTable;
}

function ScheduleSection({ matches }: { matches: TournamentMatch[] }) {
  if (!matches.length) return null;

  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-(--color-text-secondary) mb-3">Terminarz meczów</h3>
      <div className="space-y-4">
        {rounds.map((round) => (
          <div key={round}>
            <p className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wider mb-2">Kolejka {round}</p>
            <div className="space-y-2">
              {matches.filter((m) => m.round === round).map((m) => (
                <div key={m.id} className="glass-card rounded-xl px-4 py-2.5 flex items-center justify-between text-sm">
                  <span className="text-(--color-text-secondary) flex-1 text-right">{m.home_team_name || "TBD"}</span>
                  <span className="mx-3 font-mono text-(--color-primary) font-bold min-w-[40px] text-center">
                    {m.status === "finished" && m.home_score !== null
                      ? `${m.home_score}:${m.away_score}`
                      : "vs"}
                  </span>
                  <span className="text-(--color-text-secondary) flex-1">{m.away_team_name || "TBD"}</span>
                  {m.scheduled_time && m.status !== "finished" && (
                    <span className="text-xs text-(--color-text-muted) ml-4">
                      {new Date(m.scheduled_time).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeagueTableView({ table }: Props) {
  const { rows, matches } = table;

  if (!rows.length) {
    return <p className="text-center text-(--color-text-muted) py-8">Brak tabeli — turniej jeszcze nie wystartował.</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-(--color-text-muted) uppercase tracking-wider border-b border-(--color-border)">
              <th className="text-left pb-3 pr-2">#</th>
              <th className="text-left pb-3">Drużyna</th>
              <th className="text-center pb-3 px-2">M</th>
              <th className="text-center pb-3 px-2">W</th>
              <th className="text-center pb-3 px-2">R</th>
              <th className="text-center pb-3 px-2">P</th>
              <th className="text-center pb-3 px-2">G+</th>
              <th className="text-center pb-3 px-2">G-</th>
              <th className="text-center pb-3 px-2">RG</th>
              <th className="text-center pb-3 pl-2 font-bold text-(--color-primary)">Pkt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)/50">
            {rows.map((row, i) => (
              <tr key={row.team_id} className="hover:bg-white/2 transition-colors">
                <td className="py-2.5 pr-2 text-(--color-text-muted)">{i + 1}</td>
                <td className="py-2.5 font-medium text-(--color-text-primary)">{row.team_name}</td>
                <td className="py-2.5 text-center text-(--color-text-secondary) px-2">{row.played}</td>
                <td className="py-2.5 text-center text-(--color-success) px-2">{row.wins}</td>
                <td className="py-2.5 text-center text-(--color-text-muted) px-2">{row.draws}</td>
                <td className="py-2.5 text-center text-(--color-error) px-2">{row.losses}</td>
                <td className="py-2.5 text-center text-(--color-text-secondary) px-2">{row.goals_for}</td>
                <td className="py-2.5 text-center text-(--color-text-secondary) px-2">{row.goals_against}</td>
                <td className="py-2.5 text-center text-(--color-text-secondary) px-2">
                  {row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}
                </td>
                <td className="py-2.5 text-center font-bold text-(--color-primary) pl-2">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScheduleSection matches={matches} />
    </div>
  );
}

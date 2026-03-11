import { useState } from "react";
import { X, FileText, Star, Printer } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import type { TournamentProtocol, ProtocolPlayerNote } from "../../types/tournament";

interface Props {
  protocol: TournamentProtocol;
  onClose: () => void;
}

type Rating = "excellent" | "good" | "average" | "poor";

const RATING_LABELS: Record<Rating, string> = {
  excellent: "Doskonała",
  good: "Dobra",
  average: "Przeciętna",
  poor: "Słaba",
};

const RATING_COLORS: Record<Rating, string> = {
  excellent: "text-(--color-success)",
  good: "text-(--color-primary)",
  average: "text-(--color-warning)",
  poor: "text-(--color-error)",
};

function RatingSelect({ value, onChange }: { value: Rating; onChange: (v: Rating) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Rating)}
      className="input-dark rounded-xl px-3 py-2 text-sm"
    >
      {(["excellent", "good", "average", "poor"] as Rating[]).map((r) => (
        <option key={r} value={r} className="bg-slate-800">{RATING_LABELS[r]}</option>
      ))}
    </select>
  );
}

export default function ProtocolModal({ protocol: initial, onClose }: Props) {
  const [atmosphere, setAtmosphere] = useState<Rating>(initial.atmosphere);
  const [parentsBehavior, setParentsBehavior] = useState<Rating>(initial.parents_behavior);
  const [notes, setNotes] = useState(initial.notes);
  const [playerNotes, setPlayerNotes] = useState<Record<number, ProtocolPlayerNote>>(
    Object.fromEntries(
      initial.team_entries.flatMap((te) => te.player_notes.map((pn) => [pn.player_id, { ...pn }]))
    )
  );

  function toggleDistinguished(playerId: number) {
    setPlayerNotes((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], distinguished: !prev[playerId].distinguished },
    }));
  }

  function setPlayerNote(playerId: number, note: string) {
    setPlayerNotes((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], note },
    }));
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <Card radius="2xl" className="w-full max-w-2xl p-6 shadow-2xl shadow-black/40 my-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-(--color-primary)/15 border border-(--color-primary)/25 flex items-center justify-center">
              <FileText className="w-4 h-4 text-(--color-primary)" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-(--color-text-primary)">Protokół turnieju</h2>
              <p className="text-xs text-(--color-text-muted)">{initial.tournament_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Drukuj
            </Button>
            <Button variant="icon" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-(--color-primary)">{initial.teams_count}</p>
            <p className="text-xs text-(--color-text-muted) mt-0.5">drużyn</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-(--color-text-primary)">{initial.matches_played}</p>
            <p className="text-xs text-(--color-text-muted) mt-0.5">meczów rozegranych</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-(--color-text-secondary)">
              {new Date(initial.date).toLocaleDateString("pl-PL")}
            </p>
            <p className="text-xs text-(--color-text-muted) mt-0.5">{initial.location}</p>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-4 mb-6">
          {initial.team_entries.map((entry) => (
            <div key={entry.team_id} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-(--color-text-primary)">{entry.team_name}</h3>
                <span className="text-xs text-(--color-text-muted)">{entry.players_count} zawodników</span>
              </div>

              {entry.coaches.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-(--color-text-muted) mb-1">Trenerzy</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.coaches.map((coach) => (
                      <span key={coach} className="text-xs bg-(--color-bg-elevated) border border-(--color-border-soft) rounded-lg px-2.5 py-1 text-(--color-text-secondary)">
                        {coach}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.player_notes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-(--color-text-muted) mb-2">Zawodnicy</p>
                  <div className="space-y-2">
                    {entry.player_notes.map((pn) => {
                      const state = playerNotes[pn.player_id] ?? pn;
                      return (
                        <div key={pn.player_id} className="flex items-center gap-2">
                          <button
                            onClick={() => toggleDistinguished(pn.player_id)}
                            className={`shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                              state.distinguished
                                ? "bg-(--color-warning)/20 border-(--color-warning) text-(--color-warning)"
                                : "border-(--color-border-soft) text-(--color-text-muted) hover:border-(--color-warning)/50"
                            }`}
                            title="Wyróżnij zawodnika"
                          >
                            <Star className="w-3.5 h-3.5" fill={state.distinguished ? "currentColor" : "none"} />
                          </button>
                          <span className={`text-sm min-w-[140px] ${state.distinguished ? "text-(--color-warning) font-medium" : "text-(--color-text-secondary)"}`}>
                            {pn.player_name}
                          </span>
                          <input
                            type="text"
                            value={state.note}
                            onChange={(e) => setPlayerNote(pn.player_id, e.target.value)}
                            placeholder="Notatka..."
                            className="input-dark rounded-lg px-2.5 py-1 text-xs flex-1"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-1.5">Atmosfera</label>
            <RatingSelect value={atmosphere} onChange={setAtmosphere} />
            <p className={`text-xs mt-1 font-medium ${RATING_COLORS[atmosphere]}`}>{RATING_LABELS[atmosphere]}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-1.5">Zachowanie rodziców</label>
            <RatingSelect value={parentsBehavior} onChange={setParentsBehavior} />
            <p className={`text-xs mt-1 font-medium ${RATING_COLORS[parentsBehavior]}`}>{RATING_LABELS[parentsBehavior]}</p>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-(--color-text-secondary) mb-1.5">Uwagi ogólne</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Dodatkowe uwagi do turnieju..."
            className="input-dark w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
          />
        </div>

        {/* Show results disclaimer */}
        {!initial.show_results && (
          <div className="mb-4 p-3 bg-(--color-info)/10 border border-(--color-info)/30 rounded-xl text-xs text-(--color-info)">
            Kategoria wiekowa: wyniki i klasyfikacja końcowa nie są uwzględniane w protokole (Skrzaty/Żaki/Orliki).
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Zamknij</Button>
          <Button variant="primary" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1.5" />
            Drukuj protokół
          </Button>
        </div>
      </Card>
    </div>
  );
}

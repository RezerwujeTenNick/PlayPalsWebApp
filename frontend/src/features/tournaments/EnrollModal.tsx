import { useState } from "react";
import { enrollTeam } from "../../api/client";
import type { Team } from "../../types/team";
import { X, ClipboardList } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

interface Props {
  tournamentId: number;
  tournamentName: string;
  myTeams: Team[];
  onClose: () => void;
  onEnrolled: () => void;
}

export default function EnrollModal({ tournamentId, tournamentName, myTeams, onClose, onEnrolled }: Props) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(myTeams[0]?.id ?? null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTeamId) return;
    setError("");
    setLoading(true);
    try {
      await enrollTeam(tournamentId, selectedTeamId);
      onEnrolled();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Błąd");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card radius="2xl" className="w-full max-w-sm p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-(--color-primary)/15 border border-(--color-primary)/25 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-(--color-primary)" />
            </div>
            <h2 className="text-lg font-bold text-(--color-text-primary)">Zapisz drużynę</h2>
          </div>
          <Button variant="icon" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <p className="text-sm text-(--color-text-muted) mb-5">
          do: <span className="font-semibold text-(--color-text-secondary)">{tournamentName}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-(--color-error)/10 border border-(--color-error)/30 text-(--color-error) rounded-xl text-sm">
            {error}
          </div>
        )}

        {myTeams.length === 0 ? (
          <p className="text-sm text-(--color-text-muted) text-center py-4">
            Nie masz żadnej drużyny. Utwórz ją najpierw.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--color-text-secondary) mb-1.5">Wybierz drużynę</label>
              <select
                value={selectedTeamId ?? ""}
                onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                className="input-dark w-full rounded-xl px-3.5 py-2.5 text-sm transition-all"
              >
                {myTeams.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-800">{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" type="button" onClick={onClose} className="flex-1 py-2.5 text-sm">
                Anuluj
              </Button>
              <Button variant="primary" type="submit" disabled={loading} className="flex-1 py-2.5 text-sm">
                {loading ? "Zapisywanie..." : "Zapisz"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

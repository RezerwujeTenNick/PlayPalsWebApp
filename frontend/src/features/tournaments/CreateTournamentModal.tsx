import { useState } from "react";
import { createTournament } from "../../api/client";
import { X, Trophy, Coins } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTournamentModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "12:00",
    min_teams: 2,
    max_teams: 8,
    location: "",
    tournament_type: "cup" as "league" | "cup" | "friendly",
    is_paid: false,
    entry_fee: "" as string,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string | number | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const datetime = form.date && form.time ? form.date + "T" + form.time + ":00" : form.date;
      await createTournament({
        ...form,
        date: datetime,
        entry_fee: form.is_paid && form.entry_fee !== "" ? Number(form.entry_fee) : null,
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Błąd");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "input-dark w-full rounded-xl px-3.5 py-2.5 text-sm transition-all";
  const labelClass = "block text-sm font-medium text-(--color-text-secondary) mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card radius="2xl" className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-(--color-primary)/15 border border-(--color-primary)/25 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-(--color-primary)" />
            </div>
            <h2 className="text-lg font-bold text-(--color-text-primary)">Utwórz turniej</h2>
          </div>
          <Button variant="icon" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-(--color-error)/10 border border-(--color-error)/30 text-(--color-error) rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={labelClass}>Nazwa</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
              placeholder="np. Wiosenny Cup 2025"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Data</label>
              <input type="date" required value={form.date} onChange={(e) => set("date", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Godzina</label>
              <input type="time" required value={form.time} onChange={(e) => set("time", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Lokalizacja</label>
            <input
              required
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputClass}
              placeholder="np. Kraków, Hala Sportowa"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Min drużyn</label>
              <input type="number" min={2} required value={form.min_teams} onChange={(e) => set("min_teams", Number(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max drużyn</label>
              <input type="number" min={2} required value={form.max_teams} onChange={(e) => set("max_teams", Number(e.target.value))} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Typ turnieju</label>
            <select value={form.tournament_type} onChange={(e) => set("tournament_type", e.target.value)} className={inputClass}>
              <option value="cup" className="bg-slate-800">Cup (puchar)</option>
              <option value="league" className="bg-slate-800">Liga</option>
              <option value="friendly" className="bg-slate-800">Towarzyski</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                form.is_paid
                  ? "bg-(--color-primary) border-(--color-primary)"
                  : "border-(--color-border-soft) bg-white/5"
              }`}>
                {form.is_paid && <span className="text-(--color-bg) text-xs font-black">✓</span>}
              </div>
              <input type="checkbox" checked={form.is_paid} onChange={(e) => set("is_paid", e.target.checked)} className="sr-only" />
              <span className="text-sm font-medium text-(--color-text-secondary) flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-(--color-warning)" />
                Turniej płatny
              </span>
            </label>
          </div>
          {form.is_paid && (
            <div>
              <label className={labelClass}>Wpisowe (PLN / drużyna)</label>
              <input
                type="number" min={0} step={0.01} required
                value={form.entry_fee}
                onChange={(e) => set("entry_fee", e.target.value)}
                className={inputClass}
                placeholder="np. 150"
              />
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1 py-2.5 text-sm">
              Anuluj
            </Button>
            <Button variant="primary" type="submit" disabled={loading} className="flex-1 py-2.5 text-sm">
              {loading ? "Tworzenie..." : "Utwórz"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

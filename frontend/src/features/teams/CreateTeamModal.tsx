import { useState } from "react";
import { createTeam } from "../../api/client";
import { X, Shield } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CATEGORIES = [
  { value: "u6_u7",   label: "Skrzaty (U6-U7)" },
  { value: "u8_u9",   label: "Żaki (U8-U9)" },
  { value: "u10_u11", label: "Orliki (U10-U11)" },
  { value: "u12_u13", label: "Młodzicy (U12-U13)" },
  { value: "u14_u15", label: "Trampkarze (U14-U15)" },
  { value: "u16_u17", label: "Juniorzy młodsi (U16-U17)" },
  { value: "u18_u19", label: "Juniorzy starsi (U18-U19)" },
  { value: "senior",  label: "Seniorzy" },
];

export default function CreateTeamModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("senior");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createTeam({ name, category });
      onCreated();
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-(--color-primary)/15 border border-(--color-primary)/25 flex items-center justify-center">
              <Shield className="w-4 h-4 text-(--color-primary)" />
            </div>
            <h2 className="text-lg font-bold text-(--color-text-primary)">Utwórz drużynę</h2>
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
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-1.5">Nazwa drużyny</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-dark w-full rounded-xl px-3.5 py-2.5 text-sm transition-all"
              placeholder="np. FC Champions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-1.5">Kategoria wiekowa</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-dark w-full rounded-xl px-3.5 py-2.5 text-sm transition-all"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-800">{c.label}</option>
              ))}
            </select>
          </div>
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, getMe } from "../api/client";
import { useAuth, type UserOut } from "../context/AuthContext";
import { Trophy, ShieldCheck, AlertCircle, CheckCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

type Tab = "login" | "register";

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regNickname, setRegNickname] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"zawodnik" | "trener">("zawodnik");
  const [regDob, setRegDob] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access_token } = await login({ email: loginEmail, password: loginPassword });
      const user = await getMe();
      authLogin(access_token, user as UserOut);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Błąd logowania");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register({ email: regEmail, nickname: regNickname, password: regPassword, role: regRole, date_of_birth: regDob || null });
      setSuccess("Konto utworzone! Możesz się teraz zalogować.");
      setTab("login");
      setLoginEmail(regEmail);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "input-dark w-full rounded-xl px-4 py-3 text-sm transition-all";
  const labelClass = "block text-sm font-medium text-(--color-text-secondary) mb-1.5";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Ambient orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-(--color-primary)/8 rounded-full blur-3xl pointer-events-none animate-glow-float" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-(--color-primary)/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative flex flex-col gap-8">
        <div className="flex flex-col gap-4 items-center">
          <div className="inline-flex items-center justify-center w-24 h-24">
            <img src="/logo_mark.svg" alt="PlayPals" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-extrabold text-(--color-text-primary) tracking-tight">
            Play Pals
          </h1>
          <p className="text-(--color-text-muted) mt-2 text-sm">Zarządzaj drużyną · Rywalizuj w turniejach</p>
        </div>

        <Card radius="2xl" className="overflow-hidden shadow-2xl shadow-black/40">
          {/* Tabs */}
          <div className="flex border-b border-(--color-border)">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                  tab === t
                    ? "text-(--color-primary) border-b-2 border-(--color-primary) bg-(--color-primary)/5"
                    : "text-(--color-text-muted) hover:text-(--color-text-secondary)"
                }`}
              >
                {t === "login" ? "Zaloguj się" : "Zarejestruj się"}
              </button>
            ))}
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-(--color-error)/10 border border-(--color-error)/30 text-(--color-error) rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-(--color-success)/10 border border-(--color-success)/30 text-(--color-success) rounded-xl text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className={inputClass} placeholder="twoj@email.pl" />
                </div>
                <div>
                  <label className={labelClass}>Hasło</label>
                  <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>
                <Button type="submit" disabled={loading} className="w-full py-3 mt-2">
                  {loading ? "Logowanie..." : "Zaloguj się"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className={inputClass} placeholder="twoj@email.pl" />
                </div>
                <div>
                  <label className={labelClass}>Nick</label>
                  <input type="text" required value={regNickname} onChange={(e) => setRegNickname(e.target.value)} className={inputClass} placeholder="ProGamer123" />
                </div>
                <div>
                  <label className={labelClass}>Hasło</label>
                  <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>
                <div>
                  <label className={labelClass}>Data urodzenia</label>
                  <input type="date" value={regDob} onChange={(e) => setRegDob(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Rola</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["zawodnik", "trener"] as const).map((role) => (
                      <label
                        key={role}
                        className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                          regRole === role
                            ? "border-(--color-primary)/60 bg-(--color-primary)/10"
                            : "border-(--color-border) hover:border-(--color-border-soft)"
                        }`}
                      >
                        <input type="radio" className="sr-only" value={role} checked={regRole === role} onChange={() => setRegRole(role)} />
                        <span className="mb-2">
                          {role === "zawodnik"
                            ? <ShieldCheck className={`w-6 h-6 ${regRole === role ? "text-(--color-primary)" : "text-(--color-text-muted)"}`} />
                            : <Trophy className={`w-6 h-6 ${regRole === role ? "text-(--color-primary)" : "text-(--color-text-muted)"}`} />
                          }
                        </span>
                        <span className={`text-sm font-semibold capitalize ${regRole === role ? "text-(--color-primary)" : "text-(--color-text-muted)"}`}>
                          {role}
                        </span>
                        <span className="text-xs text-(--color-text-muted) text-center mt-1">
                          {role === "zawodnik" ? "Dołączaj do drużyn" : "Twórz drużyny i turnieje"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full py-3 mt-2">
                  {loading ? "Rejestracja..." : "Zarejestruj się"}
                </Button>
              </form>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

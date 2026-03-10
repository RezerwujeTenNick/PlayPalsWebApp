import createClient from "openapi-fetch";
import type { paths } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const api = createClient<paths>({
  baseUrl: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.use({
  onRequest({ request }) {
    const token = localStorage.getItem("token");
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
  onResponse({ response }) {
    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
    }
    return response;
  },
});

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(body: {
  email: string;
  nickname: string;
  password: string;
  role: "zawodnik" | "trener";
  date_of_birth?: string | null;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Registration failed");
  return data;
}

export async function login(body: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Login failed");
  return data as { access_token: string; token_type: string };
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, { headers: authHeader() });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function getTeams() {
  const res = await fetch(`${API_URL}/teams`, { headers: authHeader() });
  return res.json();
}

export async function createTeam(body: { name: string; category?: string }) {
  const res = await fetch(`${API_URL}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to create team");
  return data;
}

export async function getTeam(id: number) {
  const res = await fetch(`${API_URL}/teams/${id}`, { headers: authHeader() });
  return res.json();
}

export async function getTeamStats(id: number) {
  const res = await fetch(`${API_URL}/teams/${id}/stats`, { headers: authHeader() });
  if (!res.ok) return { matches: [], previous_tournament: null, upcoming_tournament: null };
  return res.json();
}

export async function joinTeam(id: number) {
  const res = await fetch(`${API_URL}/teams/${id}/join`, {
    method: "POST",
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to join team");
  return data;
}

export async function inviteToTeam(id: number, nickname: string) {
  const res = await fetch(`${API_URL}/teams/${id}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ nickname }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to invite player");
  return data;
}

export async function getTournaments() {
  const res = await fetch(`${API_URL}/tournaments`, { headers: authHeader() });
  return res.json();
}

export async function createTournament(body: {
  name: string;
  date: string;
  min_teams: number;
  max_teams: number;
  location: string;
  tournament_type: "league" | "cup" | "friendly";
  is_paid?: boolean;
  entry_fee?: number | null;
}) {
  const res = await fetch(`${API_URL}/tournaments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to create tournament");
  return data;
}

export async function getTournament(id: number) {
  const res = await fetch(`${API_URL}/tournaments/${id}`, { headers: authHeader() });
  return res.json();
}

export async function enrollTeam(tournamentId: number, teamId: number) {
  const res = await fetch(`${API_URL}/tournaments/${tournamentId}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ team_id: teamId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to enroll team");
  return data;
}

export async function getStatus() {
  const { data } = await api.GET("/");
  return data ?? null;
}

export async function getHealth() {
  const { data } = await api.GET("/health");
  return data ?? null;
}

export async function getVersion() {
  const { data } = await api.GET("/version");
  return data ?? null;
}

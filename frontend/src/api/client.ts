import * as real from "./realClient";
import * as mock from "./mockClient";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

if (USE_MOCK) {
  console.info("🧪 [Mock API] Backend is disabled — set VITE_USE_MOCK=false to use real backend");
}

const impl = USE_MOCK ? mock : real;

export const register = impl.register;
export const login = impl.login;
export const getMe = impl.getMe;

export const getTeams = impl.getTeams;
export const createTeam = impl.createTeam;
export const getTeam = impl.getTeam;
export const getTeamStats = impl.getTeamStats;
export const joinTeam = impl.joinTeam;
export const inviteToTeam = impl.inviteToTeam;

export const getTournaments = impl.getTournaments;
export const createTournament = impl.createTournament;
export const getTournament = impl.getTournament;
export const enrollTeam = impl.enrollTeam;

// openapi-fetch instance (real only)
export const { api } = real;
export const getStatus = real.getStatus;
export const getHealth = real.getHealth;
export const getVersion = real.getVersion;

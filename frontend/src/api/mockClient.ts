/**
 * Mock API client — używany gdy VITE_USE_MOCK=true w .env
 * Symuluje opóźnienia sieciowe i zwraca dane testowe.
 */

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let nextId = 100;
const mockToken = "mock-jwt-token";

interface MockUser {
  id: number;
  email: string;
  nickname: string;
  role: "zawodnik" | "trener";
  password: string;
  date_of_birth: string | null;
  created_at: string;
}

const mockUsers: Record<string, MockUser> = {
  "trener@test.pl": {
    id: 1,
    email: "trener@test.pl",
    nickname: "CoachMike",
    role: "trener",
    password: "test123",
    date_of_birth: "1985-03-15",
    created_at: new Date().toISOString(),
  },
  "zawodnik@test.pl": {
    id: 2,
    email: "zawodnik@test.pl",
    nickname: "ProGamer99",
    role: "zawodnik",
    password: "test123",
    date_of_birth: "2005-07-22",
    created_at: new Date().toISOString(),
  },
  "zawodnik2@test.pl": {
    id: 3,
    email: "zawodnik2@test.pl",
    nickname: "SpeedRunner",
    role: "zawodnik",
    password: "test123",
    date_of_birth: "2003-11-08",
    created_at: new Date().toISOString(),
  },
  "zawodnik3@test.pl": {
    id: 4,
    email: "zawodnik3@test.pl",
    nickname: "GoldenBoot",
    role: "zawodnik",
    password: "test123",
    date_of_birth: "2007-01-30",
    created_at: new Date().toISOString(),
  },
};

let currentUserId: number | null = null;

// team members: teamId -> userId[]
const mockTeamMembers: Record<number, number[]> = {
  1: [1, 2, 3],
  2: [1, 4],
};

const mockTeams = [
  { id: 1, name: "FC Champions", owner_id: 1, captain_id: 2, category: "u14_u15", created_at: "2025-01-10T10:00:00Z" },
  { id: 2, name: "Eagles United", owner_id: 1, captain_id: null, category: "senior", created_at: "2025-02-15T12:00:00Z" },
];

// tournament enrollments: tournamentId -> teamId[]
const mockEnrollments: Record<number, number[]> = {
  1: [1],
  2: [],
};

const mockTournaments = [
  {
    id: 1,
    name: "Wiosenny Cup 2025",
    date: "2025-04-20T14:00:00",
    location: "Kraków, Hala Sportowa",
    status: "open",
    tournament_type: "cup",
    min_teams: 4,
    max_teams: 8,
    creator_id: 1,
    is_paid: true,
    entry_fee: 150,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Liga Jesień 2025",
    date: "2025-09-01T10:00:00",
    location: "Warszawa, Stadion Narodowy",
    status: "draft",
    tournament_type: "league",
    min_teams: 6,
    max_teams: 12,
    creator_id: 1,
    is_paid: false,
    entry_fee: null,
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: 3,
    name: "Zimowy Cup 2024",
    date: "2024-12-15T11:00:00",
    location: "Gdańsk, Arena Sportowa",
    status: "finished",
    tournament_type: "cup",
    min_teams: 4,
    max_teams: 8,
    creator_id: 1,
    is_paid: false,
    entry_fee: null,
    created_at: "2024-10-01T00:00:00Z",
    updated_at: "2024-12-20T00:00:00Z",
  },
];

// Enroll team 1 also in the finished tournament 3
mockEnrollments[3] = [1, 2];

// Mock match history per team: teamId -> MatchResult[]
const mockMatchHistory: Record<number, Array<{
  id: number; tournament_id: number; tournament_name: string;
  opponent_name: string; goals_scored: number; goals_conceded: number;
  outcome: "W" | "L" | "D"; date: string;
}>> = {
  1: [
    { id: 1, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "Eagles United", goals_scored: 3, goals_conceded: 1, outcome: "W", date: "2024-12-15" },
    { id: 2, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "Rapid FC",       goals_scored: 2, goals_conceded: 2, outcome: "D", date: "2024-12-15" },
    { id: 3, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "Thunder Boys",   goals_scored: 1, goals_conceded: 3, outcome: "L", date: "2024-12-15" },
    { id: 4, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "Blue Stars",     goals_scored: 4, goals_conceded: 0, outcome: "W", date: "2024-12-15" },
    { id: 5, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "City Wolves",    goals_scored: 2, goals_conceded: 1, outcome: "W", date: "2024-12-15" },
  ],
  2: [
    { id: 6, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "FC Champions",   goals_scored: 1, goals_conceded: 3, outcome: "L", date: "2024-12-15" },
    { id: 7, tournament_id: 3, tournament_name: "Zimowy Cup 2024", opponent_name: "Thunder Boys",   goals_scored: 0, goals_conceded: 0, outcome: "D", date: "2024-12-15" },
  ],
};

// --- Auth ---

export async function register(body: {
  email: string;
  nickname: string;
  password: string;
  role: "zawodnik" | "trener";
  date_of_birth?: string | null;
}) {
  await delay();
  if (mockUsers[body.email]) throw new Error("Email already registered");
  const user: MockUser = {
    id: ++nextId,
    email: body.email,
    nickname: body.nickname,
    role: body.role,
    password: body.password,
    date_of_birth: body.date_of_birth ?? null,
    created_at: new Date().toISOString(),
  };
  mockUsers[body.email] = user;
  return { id: user.id, email: user.email, nickname: user.nickname, role: user.role, date_of_birth: user.date_of_birth, created_at: user.created_at };
}

export async function login(body: { email: string; password: string }) {
  await delay();
  const user = mockUsers[body.email];
  if (!user || user.password !== body.password) throw new Error("Invalid email or password");
  currentUserId = user.id;
  return { access_token: mockToken, token_type: "bearer" };
}

export async function getMe() {
  await delay(100);
  const all = Object.values(mockUsers);
  const user = currentUserId ? all.find((u) => u.id === currentUserId) ?? all[0] : all[0];
  return { id: user.id, email: user.email, nickname: user.nickname, role: user.role, date_of_birth: user.date_of_birth, created_at: user.created_at };
}

// --- Teams ---

export async function getTeams() {
  await delay();
  return [...mockTeams];
}

export async function createTeam(body: { name: string; category?: string }) {
  await delay();
  if (mockTeams.find((t) => t.name === body.name)) throw new Error("Team name already taken");
  const id = ++nextId;
  const team = { id, name: body.name, owner_id: currentUserId ?? 1, captain_id: null, category: body.category ?? "senior", created_at: new Date().toISOString() };
  mockTeams.push(team);
  mockTeamMembers[id] = [currentUserId ?? 1];
  return team;
}

export async function getTeam(id: number) {
  await delay();
  const team = mockTeams.find((t) => t.id === id);
  if (!team) throw new Error("Team not found");
  const memberIds = mockTeamMembers[id] ?? [];
  const allUsers = Object.values(mockUsers);
  const members = memberIds
    .map((uid) => allUsers.find((u) => u.id === uid))
    .filter(Boolean)
    .map((u) => ({ id: u!.id, email: u!.email, nickname: u!.nickname, role: u!.role, date_of_birth: u!.date_of_birth, created_at: u!.created_at }));
  return { ...team, members };
}

export async function getTeamStats(id: number) {
  await delay(200);
  const matches = (mockMatchHistory[id] ?? []).slice(-5).reverse();
  const now = new Date();

  const enrolledTournamentIds = Object.entries(mockEnrollments)
    .filter(([, teams]) => teams.includes(id))
    .map(([tid]) => Number(tid));

  const teamTournaments = enrolledTournamentIds
    .map((tid) => mockTournaments.find((t) => t.id === tid))
    .filter((t): t is (typeof mockTournaments)[0] => Boolean(t));

  const previous = teamTournaments
    .filter((t) => new Date(t.date) < now && t.status === "finished")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] ?? null;

  const upcoming = teamTournaments
    .filter((t) => new Date(t.date) >= now && t.status !== "finished")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;

  return {
    matches,
    previous_tournament: previous ? { id: previous.id, name: previous.name, date: previous.date, status: previous.status } : null,
    upcoming_tournament: upcoming ? { id: upcoming.id, name: upcoming.name, date: upcoming.date, status: upcoming.status } : null,
  };
}

export async function joinTeam(id: number) {
  await delay();
  const team = mockTeams.find((t) => t.id === id);
  if (!team) throw new Error("Team not found");
  if (!mockTeamMembers[id]) mockTeamMembers[id] = [];
  if (currentUserId && !mockTeamMembers[id].includes(currentUserId)) {
    mockTeamMembers[id].push(currentUserId);
  }
  return team;
}

export async function inviteToTeam(id: number, nickname: string) {
  await delay();
  const team = mockTeams.find((t) => t.id === id);
  if (!team) throw new Error("Team not found");
  const allUsers = Object.values(mockUsers);
  const invitee = allUsers.find((u) => u.nickname === nickname);
  if (!invitee) throw new Error("Player not found");
  if (!mockTeamMembers[id]) mockTeamMembers[id] = [];
  if (!mockTeamMembers[id].includes(invitee.id)) {
    mockTeamMembers[id].push(invitee.id);
  }
  return team;
}

// --- Tournaments ---

export async function getTournaments() {
  await delay();
  return [...mockTournaments];
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
  await delay();
  const id = ++nextId;
  const tournament = {
    id,
    ...body,
    is_paid: body.is_paid ?? false,
    entry_fee: body.entry_fee ?? null,
    creator_id: currentUserId ?? 1,
    status: "open" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockTournaments.push(tournament);
  mockEnrollments[id] = [];
  return tournament;
}

export async function getTournament(id: number) {
  await delay();
  const t = mockTournaments.find((t) => t.id === id);
  if (!t) throw new Error("Tournament not found");
  const enrolledIds = mockEnrollments[id] ?? [];
  const enrolled_teams = enrolledIds
    .map((tid) => mockTeams.find((team) => team.id === tid))
    .filter(Boolean)
    .map((team) => ({ id: team!.id, name: team!.name }));
  return { ...t, enrolled_team_ids: enrolledIds, enrolled_teams };
}

export async function enrollTeam(tournamentId: number, teamId: number) {
  await delay();
  const t = mockTournaments.find((t) => t.id === tournamentId);
  if (!t) throw new Error("Tournament not found");
  if (!mockEnrollments[tournamentId]) mockEnrollments[tournamentId] = [];
  if (mockEnrollments[tournamentId].includes(teamId)) throw new Error("Team already enrolled");
  mockEnrollments[tournamentId].push(teamId);
  return t;
}

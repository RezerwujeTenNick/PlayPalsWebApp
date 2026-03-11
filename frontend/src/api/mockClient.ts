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
  // Organizator — trener z własnymi turniejami
  "organizator@test.pl": {
    id: 5,
    email: "organizator@test.pl",
    nickname: "TourneyMaster",
    role: "trener",
    password: "test123",
    date_of_birth: "1980-06-01",
    created_at: new Date().toISOString(),
  },
  "zawodnik4@test.pl": {
    id: 6,
    email: "zawodnik4@test.pl",
    nickname: "FlashKick",
    role: "zawodnik",
    password: "test123",
    date_of_birth: "2006-03-12",
    created_at: new Date().toISOString(),
  },
  "zawodnik5@test.pl": {
    id: 7,
    email: "zawodnik5@test.pl",
    nickname: "IronWall",
    role: "zawodnik",
    password: "test123",
    date_of_birth: "2005-09-20",
    created_at: new Date().toISOString(),
  },
  "trener2@test.pl": {
    id: 8,
    email: "trener2@test.pl",
    nickname: "CoachAlex",
    role: "trener",
    password: "test123",
    date_of_birth: "1988-04-22",
    created_at: new Date().toISOString(),
  },
  "trener3@test.pl": {
    id: 9,
    email: "trener3@test.pl",
    nickname: "CoachSara",
    role: "trener",
    password: "test123",
    date_of_birth: "1990-11-05",
    created_at: new Date().toISOString(),
  },
  "trener4@test.pl": {
    id: 10,
    email: "trener4@test.pl",
    nickname: "CoachDave",
    role: "trener",
    password: "test123",
    date_of_birth: "1983-07-19",
    created_at: new Date().toISOString(),
  },
};

let currentUserId: number | null = null;

// team members: teamId -> userId[]
const mockTeamMembers: Record<number, number[]> = {
  1:  [1, 2, 3],   // FC Champions — CoachMike
  2:  [1, 4],      // Eagles United — CoachMike
  3:  [5, 6],      // Rapid FC — TourneyMaster
  4:  [5, 7],      // Thunder Boys — TourneyMaster
  5:  [5],         // City Wolves — TourneyMaster
  6:  [5],         // Blue Stars — TourneyMaster
  7:  [8],         // Red Dragons — CoachAlex
  8:  [8],         // Iron Phoenix — CoachAlex
  9:  [8],         // Golden Hawks — CoachAlex
  10: [8],         // Silver Foxes — CoachAlex
  11: [9],         // Black Panthers — CoachSara
  12: [9],         // Storm Riders — CoachSara
  13: [9],         // Neon Wolves — CoachSara
  14: [9],         // Cyber United — CoachSara
  15: [10],        // Turbo FC — CoachDave
  16: [10],        // Apex Sports — CoachDave
  17: [10],        // Prime Eleven — CoachDave
  18: [10],        // Ultra Lions — CoachDave
};

const mockTeams = [
  { id: 1,  name: "FC Champions",    owner_id: 1, captain_id: 2,    category: "u14_u15", created_at: "2025-01-10T10:00:00Z" },
  { id: 2,  name: "Eagles United",   owner_id: 1, captain_id: null, category: "senior",  created_at: "2025-02-15T12:00:00Z" },
  { id: 3,  name: "Rapid FC",        owner_id: 5, captain_id: 6,    category: "u12_u13", created_at: "2025-01-20T09:00:00Z" },
  { id: 4,  name: "Thunder Boys",    owner_id: 5, captain_id: 7,    category: "u12_u13", created_at: "2025-01-21T09:00:00Z" },
  { id: 5,  name: "City Wolves",     owner_id: 5, captain_id: null, category: "u12_u13", created_at: "2025-01-22T09:00:00Z" },
  { id: 6,  name: "Blue Stars",      owner_id: 5, captain_id: null, category: "u12_u13", created_at: "2025-01-23T09:00:00Z" },
  { id: 7,  name: "Red Dragons",     owner_id: 8, captain_id: null, category: "u14_u15", created_at: "2024-06-01T09:00:00Z" },
  { id: 8,  name: "Iron Phoenix",    owner_id: 8, captain_id: null, category: "u14_u15", created_at: "2024-06-02T09:00:00Z" },
  { id: 9,  name: "Golden Hawks",    owner_id: 8, captain_id: null, category: "u14_u15", created_at: "2024-06-03T09:00:00Z" },
  { id: 10, name: "Silver Foxes",    owner_id: 8, captain_id: null, category: "u14_u15", created_at: "2024-06-04T09:00:00Z" },
  { id: 11, name: "Black Panthers",  owner_id: 9, captain_id: null, category: "u14_u15", created_at: "2024-06-05T09:00:00Z" },
  { id: 12, name: "Storm Riders",    owner_id: 9, captain_id: null, category: "u14_u15", created_at: "2024-06-06T09:00:00Z" },
  { id: 13, name: "Neon Wolves",     owner_id: 9, captain_id: null, category: "senior",  created_at: "2024-09-01T09:00:00Z" },
  { id: 14, name: "Cyber United",    owner_id: 9, captain_id: null, category: "senior",  created_at: "2024-09-02T09:00:00Z" },
  { id: 15, name: "Turbo FC",        owner_id: 10, captain_id: null, category: "senior",  created_at: "2024-09-03T09:00:00Z" },
  { id: 16, name: "Apex Sports",     owner_id: 10, captain_id: null, category: "senior",  created_at: "2024-09-04T09:00:00Z" },
  { id: 17, name: "Prime Eleven",    owner_id: 10, captain_id: null, category: "senior",  created_at: "2024-09-05T09:00:00Z" },
  { id: 18, name: "Ultra Lions",     owner_id: 10, captain_id: null, category: "senior",  created_at: "2024-09-06T09:00:00Z" },
];

// tournament enrollments: tournamentId -> teamId[]
const mockEnrollments: Record<number, number[]> = {
  1: [1],
};

const mockTournaments = [
  // ── CoachMike ───────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "Wiosenny Cup 2025",
    date: "2025-06-15T14:00:00",
    location: "Kraków, Hala Sportowa",
    status: "open",
    tournament_type: "cup",
    min_teams: 4,
    max_teams: 18,
    creator_id: 1,
    is_paid: true,
    entry_fee: 150,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  // ── TourneyMaster — CUP ──────────────────────────────────────────────────────
  // 4a: cup in_progress (SF rozegrane, finał zaplanowany)
  {
    id: 4,
    name: "Puchar Wiosny U12 2025",
    date: "2025-03-22T10:00:00",
    location: "Poznań, Akademia Futbolu",
    status: "in_progress",
    tournament_type: "cup",
    min_teams: 4,
    max_teams: 4,
    creator_id: 5,
    is_paid: true,
    entry_fee: 200,
    created_at: "2025-02-01T00:00:00Z",
    updated_at: "2025-03-22T00:00:00Z",
  },
  // 6: cup open (trwające zapisy, 4/8 drużyn)
  {
    id: 6,
    name: "Letni Puchar U14 2025",
    date: "2025-07-05T10:00:00",
    location: "Gdańsk, Orlik Główny",
    status: "open",
    tournament_type: "cup",
    min_teams: 4,
    max_teams: 8,
    creator_id: 5,
    is_paid: true,
    entry_fee: 250,
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-01T00:00:00Z",
  },
  // 7: cup finished (12 drużyn, pełne drzewko)
  {
    id: 7,
    name: "Zimowy Puchar Seniorów 2024",
    date: "2024-11-09T10:00:00",
    location: "Warszawa, Hala Torwar",
    status: "finished",
    tournament_type: "cup",
    min_teams: 8,
    max_teams: 16,
    creator_id: 5,
    is_paid: false,
    entry_fee: null,
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2024-11-10T00:00:00Z",
  },
  // ── TourneyMaster — LIGA ─────────────────────────────────────────────────────
  // 5: liga in_progress (4 drużyny, częściowo rozegrana)
  {
    id: 5,
    name: "Liga Młodzików U12 2025",
    date: "2025-03-15T09:00:00",
    location: "Wrocław, Orlik nr 3",
    status: "in_progress",
    tournament_type: "league",
    min_teams: 4,
    max_teams: 4,
    creator_id: 5,
    is_paid: false,
    entry_fee: null,
    created_at: "2025-02-10T00:00:00Z",
    updated_at: "2025-03-15T00:00:00Z",
  },
  // 8: liga open (trwające zapisy, 5/10 drużyn)
  {
    id: 8,
    name: "Liga Seniorów Jesień 2025",
    date: "2025-09-06T10:00:00",
    location: "Kraków, Stadion Miejski",
    status: "open",
    tournament_type: "league",
    min_teams: 6,
    max_teams: 10,
    creator_id: 5,
    is_paid: false,
    entry_fee: null,
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-01T00:00:00Z",
  },
  // 9: liga finished (10 drużyn, pełna tabela)
  {
    id: 9,
    name: "Liga Seniorów Wiosna 2025",
    date: "2025-03-01T10:00:00",
    location: "Gdańsk, Arena Sportowa",
    status: "finished",
    tournament_type: "league",
    min_teams: 8,
    max_teams: 10,
    creator_id: 5,
    is_paid: true,
    entry_fee: 100,
    created_at: "2025-01-15T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z",
  },
];

// cup in_progress (4)
mockEnrollments[4] = [3, 4, 5, 6];
// cup open — 4/8 slots taken (6)
mockEnrollments[6] = [7, 8, 9, 10];
// cup finished — 12 drużyn (7)
mockEnrollments[7] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

// liga in_progress (5)
mockEnrollments[5] = [3, 4, 5, 6];
// liga open — 5/10 slots taken (8)
mockEnrollments[8] = [13, 14, 15, 16, 17];
// liga finished — 10 drużyn (9)
mockEnrollments[9] = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

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

// ─── Tournament matches ────────────────────────────────────────────────────────
// Cup tournament 4: 4 teams → SF (round 1) + F (round 2)
// SF1: Rapid FC vs Thunder Boys → 2:1 (finished)
// SF2: City Wolves vs Blue Stars → 0:3 (finished)
// Final: Rapid FC vs Blue Stars → scheduled
// Helper to build a team name lookup
const teamName = (id: number): string =>
  ({ 3: "Rapid FC", 4: "Thunder Boys", 5: "City Wolves", 6: "Blue Stars",
     7: "Red Dragons", 8: "Iron Phoenix", 9: "Golden Hawks", 10: "Silver Foxes",
     11: "Black Panthers", 12: "Storm Riders", 13: "Neon Wolves", 14: "Cyber United",
     15: "Turbo FC", 16: "Apex Sports", 17: "Prime Eleven", 18: "Ultra Lions" } as Record<number, string>)[id] ?? `Team ${id}`;

const mkMatch = (
  id: number, tid: number, round: number, mn: number,
  h: number, a: number, hs: number | null, as_: number | null,
  time: string
) => ({
  id, tournament_id: tid, round, match_number: mn,
  home_team_id: h, away_team_id: a,
  home_team_name: teamName(h), away_team_name: teamName(a),
  home_score: hs, away_score: as_,
  status: (hs !== null ? "finished" : "scheduled") as "scheduled" | "finished",
  scheduled_time: time,
});

const mockTournamentMatches: Record<number, ReturnType<typeof mkMatch>[]> = {
  // ── Cup in_progress (4): 4 drużyny, SF rozegrane, finał scheduled ──────────
  4: [
    mkMatch(101, 4, 1, 1,  3, 4,  2,    1,    "2025-03-22T10:00:00"),
    mkMatch(102, 4, 1, 2,  5, 6,  0,    3,    "2025-03-22T11:00:00"),
    mkMatch(103, 4, 2, 1,  3, 6,  null, null, "2025-03-22T14:00:00"),
  ],

  // ── Liga in_progress (5): 4 drużyny, 4 z 6 meczów rozegranych ─────────────
  5: [
    mkMatch(201, 5, 1, 1,  3, 4,  3,    1,    "2025-03-15T09:00:00"),
    mkMatch(202, 5, 1, 2,  5, 6,  1,    1,    "2025-03-15T10:00:00"),
    mkMatch(203, 5, 2, 1,  3, 5,  2,    0,    "2025-03-22T09:00:00"),
    mkMatch(204, 5, 2, 2,  4, 6,  1,    2,    "2025-03-22T10:00:00"),
    mkMatch(205, 5, 3, 1,  3, 6,  null, null, "2025-03-29T09:00:00"),
    mkMatch(206, 5, 3, 2,  4, 5,  null, null, "2025-03-29T10:00:00"),
  ],

  // ── Cup finished (7): 12 drużyn → R1(4 mecze) → QF(4 mecze) → SF(2) → F(1) = 11 meczów
  // 12 drużyn: 4 mają BYE w R1, 8 gra → 4 wygrywa → +4 BYE = 8 w QF → 4 w SF → 2 → 1
  7: [
    // Runda 1 — 4 mecze (zwycięzcy awansują + 4 drużyny BYE: 15,16,17,18)
    mkMatch(301, 7, 1, 1,  7,  8,  3, 1, "2024-11-09T09:00:00"),
    mkMatch(302, 7, 1, 2,  9,  10, 2, 0, "2024-11-09T09:30:00"),
    mkMatch(303, 7, 1, 3,  11, 12, 1, 3, "2024-11-09T10:00:00"),
    mkMatch(304, 7, 1, 4,  13, 14, 0, 2, "2024-11-09T10:30:00"),
    // Ćwierćfinały — 4 zwycięzcy R1 + 4 BYE (15,16,17,18)
    mkMatch(305, 7, 2, 1,  7,  15, 2, 3, "2024-11-09T11:30:00"),
    mkMatch(306, 7, 2, 2,  9,  16, 4, 1, "2024-11-09T12:00:00"),
    mkMatch(307, 7, 2, 3,  12, 17, 2, 1, "2024-11-09T12:30:00"),
    mkMatch(308, 7, 2, 4,  14, 18, 1, 3, "2024-11-09T13:00:00"),
    // Półfinały
    mkMatch(309, 7, 3, 1,  15, 9,  1, 2, "2024-11-09T14:30:00"),
    mkMatch(310, 7, 3, 2,  12, 18, 3, 2, "2024-11-09T15:00:00"),
    // Finał
    mkMatch(311, 7, 4, 1,  9,  12, 2, 1, "2024-11-09T17:00:00"),
  ],

  // ── Liga finished (9): 10 drużyn → 45 meczów round-robin ──────────────────
  // Drużyny: 7-16. Generujemy wszystkie pary w 9 kolejkach (round-robin).
  // Wyniki: losowe, ale sensowne (suma goli 0-5)
  9: (() => {
    const teams = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    const scores: [number, number][] = [
      [3,1],[2,0],[1,1],[4,2],[0,0],[2,1],[3,2],[1,0],[2,2],[0,1],
      [1,3],[2,2],[0,2],[3,0],[1,2],[2,1],[4,1],[0,0],[1,1],[3,3],
      [2,0],[1,2],[3,1],[0,3],[2,2],[1,0],[2,1],[0,2],[3,2],[1,1],
      [2,3],[1,1],[4,0],[0,1],[2,2],[3,1],[1,2],[2,0],[0,0],[3,2],
      [1,0],[2,1],[3,3],[1,2],[0,1],
    ];
    const matches: ReturnType<typeof mkMatch>[] = [];
    let mId = 401, sIdx = 0;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const round = Math.floor(sIdx / 5) + 1;
        const mn = (sIdx % 5) + 1;
        const [hs, as_] = scores[sIdx];
        matches.push(mkMatch(mId++, 9, round, mn, teams[i], teams[j], hs, as_, `2025-03-${String(round).padStart(2,"0")}T${String(9 + mn).padStart(2,"0")}:00:00`));
        sIdx++;
      }
    }
    return matches;
  })(),
};

function computeLeagueTable(tournamentId: number, enrolledTeamIds: number[]) {
  const matches = mockTournamentMatches[tournamentId] ?? [];
  const rows: Record<number, { team_id: number; team_name: string; played: number; wins: number; draws: number; losses: number; goals_for: number; goals_against: number; }> = {};
  const allTeams = mockTeams;
  for (const tid of enrolledTeamIds) {
    const team = allTeams.find((t) => t.id === tid);
    rows[tid] = { team_id: tid, team_name: team?.name ?? `Team ${tid}`, played: 0, wins: 0, draws: 0, losses: 0, goals_for: 0, goals_against: 0 };
  }
  for (const m of matches) {
    if (m.status !== "finished" || m.home_score === null || m.away_score === null) continue;
    const h = m.home_team_id!; const a = m.away_team_id!;
    if (!rows[h] || !rows[a]) continue;
    rows[h].played++; rows[a].played++;
    rows[h].goals_for += m.home_score; rows[h].goals_against += m.away_score;
    rows[a].goals_for += m.away_score; rows[a].goals_against += m.home_score;
    if (m.home_score > m.away_score) { rows[h].wins++; rows[a].losses++; }
    else if (m.home_score < m.away_score) { rows[a].wins++; rows[h].losses++; }
    else { rows[h].draws++; rows[a].draws++; }
  }
  return Object.values(rows).map((r) => ({
    ...r,
    goal_diff: r.goals_for - r.goals_against,
    points: r.wins * 3 + r.draws,
  })).sort((a, b) => b.points - a.points || b.goal_diff - a.goal_diff);
}

function roundLabel(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Finał";
  if (fromEnd === 1) return "Półfinał";
  if (fromEnd === 2) return "Ćwierćfinał";
  return `Runda ${round}`;
}

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

export async function getTournamentBracket(tournamentId: number) {
  await delay(200);
  const matches = mockTournamentMatches[tournamentId] ?? [];
  const rounds = [...new Set(matches.map((m) => m.round))].sort((a, b) => a - b);
  const totalRounds = rounds.length;
  return {
    tournament_id: tournamentId,
    rounds: rounds.map((r) => ({
      round: r,
      label: roundLabel(r, totalRounds),
      matches: matches.filter((m) => m.round === r),
    })),
  };
}

export async function getTournamentSchedule(tournamentId: number) {
  await delay(200);
  const t = mockTournaments.find((t) => t.id === tournamentId);
  if (!t) throw new Error("Tournament not found");
  const enrolledIds = mockEnrollments[tournamentId] ?? [];
  const matches = mockTournamentMatches[tournamentId] ?? [];
  if (t.tournament_type === "league") {
    return {
      tournament_id: tournamentId,
      rows: computeLeagueTable(tournamentId, enrolledIds),
      matches,
    };
  }
  return { tournament_id: tournamentId, rows: [], matches };
}

export async function getTournamentProtocol(tournamentId: number) {
  await delay(300);
  const t = mockTournaments.find((t) => t.id === tournamentId);
  if (!t) throw new Error("Tournament not found");
  const enrolledIds = mockEnrollments[tournamentId] ?? [];
  const allUsers = Object.values(mockUsers);
  const matches = mockTournamentMatches[tournamentId] ?? [];
  const matchesPlayed = matches.filter((m) => m.status === "finished").length;

  // Categories without results/ranking
  const noResultsCategories = ["u6_u7", "u8_u9", "u10_u11"];
  const teamList = enrolledIds.map((tid) => mockTeams.find((t) => t.id === tid)).filter(Boolean) as typeof mockTeams;
  const anyCategory = teamList[0]?.category ?? "";
  const showResults = !noResultsCategories.includes(anyCategory);

  const team_entries = enrolledIds.map((tid) => {
    const team = mockTeams.find((t) => t.id === tid);
    const memberIds = mockTeamMembers[tid] ?? [];
    const members = memberIds.map((uid) => allUsers.find((u) => u.id === uid)).filter(Boolean) as typeof allUsers[number][];
    const coaches = members.filter((u) => u.role === "trener").map((u) => u.nickname);
    const players = members.filter((u) => u.role === "zawodnik");
    return {
      team_id: tid,
      team_name: team?.name ?? `Team ${tid}`,
      coaches,
      players_count: players.length,
      player_notes: players.map((p) => ({
        player_id: p.id,
        player_name: p.nickname,
        distinguished: false,
        note: "",
      })),
    };
  });

  return {
    tournament_id: tournamentId,
    tournament_name: t.name,
    date: t.date,
    location: t.location,
    teams_count: enrolledIds.length,
    matches_played: matchesPlayed,
    show_results: showResults,
    team_entries,
    atmosphere: "good" as const,
    parents_behavior: "good" as const,
    notes: "",
  };
}

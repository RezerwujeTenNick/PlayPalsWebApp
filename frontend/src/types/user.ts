export type Role = "zawodnik" | "trener";

export interface User {
  id: number;
  email: string;
  nickname: string;
  role: Role;
  date_of_birth: string | null;
  created_at: string;
}

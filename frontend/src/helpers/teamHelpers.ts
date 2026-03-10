export const TEAM_CATEGORY_LABELS: Record<string, string> = {
  u6_u7:   "Skrzaty (U6-U7)",
  u8_u9:   "Żaki (U8-U9)",
  u10_u11: "Orliki (U10-U11)",
  u12_u13: "Młodzicy (U12-U13)",
  u14_u15: "Trampkarze (U14-U15)",
  u16_u17: "Juniorzy młodsi (U16-U17)",
  u18_u19: "Juniorzy starsi (U18-U19)",
  senior:  "Seniorzy",
};

export function getCategoryLabel(category: string): string {
  return TEAM_CATEGORY_LABELS[category] ?? category;
}

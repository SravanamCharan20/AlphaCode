export const dashboardNextSteps = [
  "Connect live contest listings.",
  "Add rank and submission history.",
  "Introduce real queue and room state.",
] as const;

export const adminActions = [
  "Manage contests and queue configuration.",
  "Review user accounts and role assignments.",
  "Add analytics, moderation, and reporting tools here.",
] as const;

export function getRoleLabel(role?: string) {
  if (role === "admin") return "Administrator";
  if (role === "user") return "Member";
  return "User";
}

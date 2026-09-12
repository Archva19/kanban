import { RecentUser } from "@/types/auth";

const STORAGE_KEY = "kanban_recent_logins";

export function getRecentLogins() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveRecentUser(user: RecentUser) {
  const current = getRecentLogins();
  const filtered = current.filter((u: RecentUser) => u.email !== user.email);
  const updated = [user, ...filtered].slice(0, 4);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function updateRecentUser(
  email: string,
  updatedFields: Partial<RecentUser>,
) {
  const current = getRecentLogins();

  const updated = current.map((u: RecentUser) => {
    if (u.email === email) {
      return { ...u, ...updatedFields };
    }
    return u;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeRecentUser(email: string) {
  const current = getRecentLogins();
  const updated = current.filter((u: RecentUser) => u.email !== email);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

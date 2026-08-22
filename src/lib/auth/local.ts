// Stub for local auth (client-side cookie-based demo)
export type User = {
  id: string;
  email: string;
  fullName?: string;
};

// Hard-coded demo user
const DEMO_USER: User = {
  id: "demo-user-id",
  email: "demo@sponsordesk.io",
  fullName: "Demo User",
};

// Cookie helpers (client-side)
function setDemoCookie(value: string) {
  if (typeof window !== "undefined") {
    document.cookie = `demo-user=${value}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
  }
}
function getDemoCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )demo-user=([^;]+)")
  );
  return match ? match[2] : null;
}
function removeDemoCookie() {
  if (typeof window !== "undefined") {
    document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export async function getCurrentUser(): Promise<User | null> {
  // In demo mode, return demo user if cookie is present
  const cookie = getDemoCookie();
  if (cookie === "true") {
    return DEMO_USER;
  }
  // For easier testing during dev, also return demo user if no cookie at all
  // Remove this line when implementing real auth
  return DEMO_USER;
}

export async function signIn(email: string, password: string) {
  // In demo mode, accept demo@sponsordesk.io / demo
  if (email === "demo@sponsordesk.io" && password === "demo") {
    setDemoCookie("true");
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

export async function signOut() {
  removeDemoCookie();
  // Note: In a real app, we'd also redirect or something; here we just clear cookie
}
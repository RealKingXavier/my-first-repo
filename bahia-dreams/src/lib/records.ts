import "server-only";
import { store } from "./store";
import type { ContactMessage, OwnerLead } from "./validation";

export type LeadRecord = OwnerLead & {
  id: string;
  receivedAt: string;
  photoKeys: string[];
  notification: { channel: string | null; error?: string } | null;
};
export type MessageRecord = ContactMessage & {
  id: string;
  receivedAt: string;
  notification: { channel: string | null; error?: string } | null;
};

async function loadAll<T>(name: "leads" | "messages") {
  const s = store(name);
  const keys = (await s.list()).sort().reverse();
  const rows = await Promise.all(keys.map((k) => s.getJSON<T>(k)));
  return rows.filter(Boolean) as T[];
}

export const loadLeads = () => loadAll<LeadRecord>("leads");
export const loadMessages = () => loadAll<MessageRecord>("messages");

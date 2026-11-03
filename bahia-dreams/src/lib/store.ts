import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";

// Private key/value storage. In production this is Netlify Blobs, which is
// never publicly addressable: records and uploaded photos are only readable
// through the authenticated /admin routes. During local development (no
// Netlify context) it falls back to ./.data on disk.

export type StoreName = "leads" | "messages" | "lead-files" | "ratelimit";

type Backend = {
  setJSON(key: string, value: unknown): Promise<void>;
  getJSON<T>(key: string): Promise<T | null>;
  setBytes(key: string, data: ArrayBuffer, contentType: string): Promise<void>;
  getBytes(key: string): Promise<{ data: ArrayBuffer; contentType: string } | null>;
  list(prefix?: string): Promise<string[]>;
};

export class StorageUnavailableError extends Error {}

function blobsBackend(name: StoreName): Backend | null {
  try {
    const store = getStore({ name });
    // On Netlify's Next.js runtime, reading a key that doesn't exist never
    // resolves (the 404 path hangs), so confirm a key exists before reading it.
    const exists = async (k: string) => (await store.list({ prefix: k })).blobs.some((b) => b.key === k);
    return {
      setJSON: async (k, v) => void (await store.setJSON(k, v)),
      getJSON: async <T,>(k: string) => ((await exists(k)) ? ((await store.get(k, { type: "json" })) as T | null) : null),
      setBytes: async (k, d, ct) => void (await store.set(k, d, { metadata: { contentType: ct } })),
      getBytes: async (k) => {
        if (!(await exists(k))) return null;
        const r = await store.getWithMetadata(k, { type: "arrayBuffer" });
        if (!r) return null;
        return { data: r.data, contentType: String(r.metadata?.contentType ?? "application/octet-stream") };
      },
      list: async (prefix) => (await store.list({ prefix })).blobs.map((b) => b.key),
    };
  } catch {
    return null;
  }
}

function diskBackend(name: StoreName): Backend {
  const dir = path.join(process.cwd(), ".data", name);
  const file = (k: string) => path.join(dir, encodeURIComponent(k));
  return {
    setJSON: async (k, v) => {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file(k), JSON.stringify(v, null, 2));
    },
    getJSON: async <T,>(k: string) => {
      try {
        return JSON.parse(await fs.readFile(file(k), "utf8")) as T;
      } catch {
        return null;
      }
    },
    setBytes: async (k, d, ct) => {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(file(k), Buffer.from(d));
      await fs.writeFile(file(k) + ".type", ct);
    },
    getBytes: async (k) => {
      try {
        const data = await fs.readFile(file(k));
        const ct = await fs.readFile(file(k) + ".type", "utf8").catch(() => "application/octet-stream");
        return { data: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer, contentType: ct };
      } catch {
        return null;
      }
    },
    list: async (prefix) => {
      try {
        return (await fs.readdir(dir))
          .filter((f) => !f.endsWith(".type"))
          .map(decodeURIComponent)
          .filter((k) => !prefix || k.startsWith(prefix));
      } catch {
        return [];
      }
    },
  };
}

export function storageMode(): "netlify-blobs" | "local-disk" | "unavailable" {
  if (blobsBackend("leads")) return "netlify-blobs";
  return process.env.NODE_ENV === "development" ? "local-disk" : "unavailable";
}

export function store(name: StoreName): Backend {
  const b = blobsBackend(name);
  if (b) return b;
  if (process.env.NODE_ENV === "development") return diskBackend(name);
  throw new StorageUnavailableError("No storage backend configured");
}

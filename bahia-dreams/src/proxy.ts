import { NextResponse, type NextRequest } from "next/server";

// HTTP Basic auth in front of /admin. With no ADMIN_PASSWORD configured the
// admin area doesn't exist at all (404), so it can never be left open.

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  const user = process.env.ADMIN_USER || "admin";
  if (!password || password.length < 12) return new NextResponse("Not found", { status: 404 });

  const header = req.headers.get("authorization") ?? "";
  if (header.startsWith("Basic ")) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(":");
      if (safeEqual(u, user) && safeEqual(rest.join(":"), password)) return NextResponse.next();
    } catch {
      // fall through to the challenge
    }
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Bahia Dreams admin", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };

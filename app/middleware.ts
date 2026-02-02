import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function randomKey() {
  // proste i wystarczające na v0.1
  return "wk_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function middleware(req: NextRequest) {
  const wk = req.cookies.get("wk")?.value;

  if (wk) return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set("wk", randomKey(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dni
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Project = {
  id: string;
  name: string;
  clientName: string | null;
  includedLimit: number;
  createdAt?: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function loadProjects(signal?: AbortSignal) {
    setState((s) => (s === "ready" ? "loading" : "loading"));
    setError(null);

    try {
      const res = await fetch("/api/projects", { cache: "no-store", signal });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to fetch: ${res.status} ${text ? `— ${text.slice(0, 120)}` : ""}`);
      }

      const data = await res.json();
      const list = (data.projects ?? []) as Project[];

      // Safety: dedupe by id (w razie glitchy)
      const uniq = new Map<string, Project>();
      for (const p of list) {
        if (p?.id) uniq.set(p.id, p);
      }

      setProjects(Array.from(uniq.values()));
      setState("ready");
    } catch (e: unknown) {
      // Ignore aborts
      if ((e as { name?: string })?.name === "AbortError") return;

      // Extract a usable message
      const message =
        typeof e === "string"
          ? e
          : e instanceof Error
          ? e.message
          : (e as { message?: unknown })?.message
          ? String((e as { message?: unknown }).message)
          : "Unknown error";

      setError(message);
      setState("error");
      console.error("fetch projects failed", e);
    }
  }

  useEffect(() => {
    const ac = new AbortController();
    loadProjects(ac.signal);

    // auto-refresh when user comes back to tab (częsty case u testerów)
    const onFocus = () => loadProjects();
    const onVis = () => {
      if (document.visibilityState === "visible") loadProjects();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      ac.abort();
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countLabel = useMemo(() => {
    const n = projects.length;
    if (state === "loading" && n === 0) return "Loading…";
    return `${n} project${n === 1 ? "" : "s"}`;
  }, [projects.length, state]);

  return (
    <main style={{ display: "grid", gap: 14, maxWidth: 820 }}>
      <h1 style={{ margin: 0 }}>Revision Token Gate</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Link
          href="/projects/add"
          aria-label="Dodaj projekt"
          style={{
            display: "inline-flex",
            gap: 8,
            padding: "8px 12px",
            fontSize: 13,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "white",
            color: "#111827",
            textDecoration: "none",
            userSelect: "none",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          Dodaj projekt
        </Link>

        <button
          type="button"
          onClick={() => loadProjects()}
          disabled={state === "loading"}
          style={{
            display: "inline-flex",
            gap: 8,
            padding: "8px 12px",
            fontSize: 13,
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: state === "loading" ? "#f3f4f6" : "transparent",
            color: "#374151",
            cursor: state === "loading" ? "not-allowed" : "pointer",
            userSelect: "none",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          {state === "loading" ? "Ładowanie…" : "Odśwież"}
        </button>

        <span style={{ fontSize: 12, color: "#6b7280" }}>{countLabel}</span>
      </div>

      {error && (
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #fecaca",
            background: "#fff1f2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        <p style={{ margin: 0, color: "#374151" }}>Twoje projekty:</p>

        {state === "loading" && projects.length === 0 ? (
          <div style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 10 }}>
            Ładowanie projektów…
          </div>
        ) : projects.length === 0 ? (
          <div style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 10 }}>
            Brak dodanych projektów. Kliknij <strong>dodaj projekt</strong>.
          </div>
        ) : (
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {projects.map((p) => (
              <li key={p.id}>
                <strong>{p.name || "Unnamed project"}</strong>
                {p.clientName ? <> — <span>{p.clientName}</span></> : null}
                <span style={{ color: "#6b7280" }}> | limit: {p.includedLimit ?? "—"}</span>
                {" | "}
                <Link href={`/projects/${p.id}`} style={{ color: "#111827" }}>
                  open →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

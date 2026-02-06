import Link from "next/link";
import { headers } from "next/headers";
import CopyMessageButton from "./CopyMessageButton";

type RequestItem = {
  id: string;
  body: string;
  roundNumber: number;
  type: "included" | "extra";
};

type ApiResponse = {
  project: {
    id: string;
    name: string;
    clientName: string | null;
    includedLimit: number;
  };
  requests: RequestItem[];
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) throw new Error("Missing host header");
  return `${proto}://${host}`;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;

  const h = await headers();
  const cookieHeader = h.get("cookie") ?? "";

  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/projects/${projectId}/requests`,
    {
      cache: "no-store",
      headers: {
        cookie: cookieHeader, // ✅ workspaceKey działa
      },
    }
  );

  if (res.status === 404) {
    return <main><h1>Project not found.</h1></main>;
  }

  if (!res.ok) {
    return <main><h1>Error loading requests</h1></main>;
  }

  const data = (await res.json()) as ApiResponse;

  const { project, requests } = data;
  const lastRequest = requests.at(-1) ?? null;

  const currentRound = lastRequest?.roundNumber ?? 0;
  const currentType = lastRequest?.type ?? null;

  let status = "—";
  if (currentRound > 0) {
    if (currentType === "extra") status = "Poza pakietem";
    else if (currentRound === project.includedLimit) status = "Ostatnia w pakiecie";
    else status = "W pakiecie";
  }

  const meter = `Runda ${currentRound} / ${project.includedLimit} — ${status}`;

  return (
    <main>
      <h1>Projekt “{project.name}”</h1>
      <h2>{meter}</h2>

      <CopyMessageButton
        projectId={project.id}
        disabled={requests.length === 0}
      />

      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            {r.body} — Runda {r.roundNumber} — {r.type === "included" ? "W pakiecie" : "Poza pakietem"}
            {r.id === lastRequest?.id && <strong> ← obecna</strong>}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Link
          href="/"
          role="button"
          aria-label="Back to projects"
          style={{
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "transparent",
            color: "#374151",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            userSelect: "none",
          }}
        >
          Back to projects
        </Link>

        <Link
          href={`/projects/${projectId}/create`}
          role="button"
          aria-label="Add request"
          style={{
            padding: "8px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            background: "transparent",
            color: "#374151",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            userSelect: "none",
            gap: 8,
          }}
        >
          <span style={{ transform: "translateY(-1px)" }}>Dodaj poprawkę</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 5l6 7-6 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </main>
  );
}

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
    if (currentType === "extra") status = "Extra";
    else if (currentRound === project.includedLimit) status = "Last included";
    else status = "Included";
  }

  const meter = `Round ${currentRound} / ${project.includedLimit} — ${status}`;

  return (
    <main>
      <h1>Project “{project.name}”</h1>
      <h2>{meter}</h2>

      <CopyMessageButton
        projectId={project.id}
        disabled={requests.length === 0}
      />

      <ul>
        {requests.map((r) => (
          <li key={r.id}>
            {r.body} — Round {r.roundNumber} — {r.type}
            {r.id === lastRequest?.id && <strong> ← current</strong>}
          </li>
        ))}
      </ul>

      <Link href="/">Back to projects</Link>
    </main>
  );
}

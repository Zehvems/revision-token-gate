import Link from "next/link";
import CopyMessageButton from "./CopyMessageButton";

type RequestItem = {
    id: string;
    body: string;
    roundNumber: number;
    type: "included" | "extra";
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const paramss = await params;
  const projectId = paramss.id;
  const res = await fetch(
  `http://localhost:3000/api/projects/${projectId}/requests`,
  { cache: "no-store" }
);
  if(res.status === 404) {
  return (<main>
    <h1>Project not found.</h1>
  </main>);
  } 
  if(!res.ok) {
  return (<main>
    <h1>Error loading requests</h1>
  </main>);
  } 
  // Pobieranie danych z projektu
  const data = await res.json();
  const project = data.project;
  const includedLimit = project.includedLimit as number;
  const requests : RequestItem[] = data.requests ?? [];
  const lastRequest = requests[requests.length - 1] || null
  const currentRound = lastRequest?.roundNumber ?? 0
  const currentType = lastRequest?.type ?? null

  //status
  let status: string;
  if (currentRound === 0) status = "—";
  else if (currentType === "extra") status = "Extra";
  else if (currentRound === includedLimit) status = "Last included";
  else status = "Included";

  // meter (Round 3 / 2 — Extra)
  const meter = `Round ${currentRound} / ${includedLimit} — ${status}`;

  return (
  <main>
    <h1>Project &ldquo;{project.name}&rdquo;</h1>
    <h2>{meter}</h2>
    <CopyMessageButton projectId={project.id} disabled={requests.length === 0}/>
    <p>Requests:</p>
    <ul>  
    {requests.map((r: RequestItem) => (
      <li key={r.id}>
        {r.body} — Round {r.roundNumber} — Type: {r.type}
        {r.id === lastRequest?.id && <strong> ← current</strong>}
        </li>))}
    </ul>
    <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
    <Link
      href="/"
      role="button"
      aria-label="Back to projects"
      style={{
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: 'transparent',
    color: '#374151',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    userSelect: 'none',
      }}
    >
      Back to projects
    </Link>

    <Link
      href={`/projects/${projectId}/create`}
      role="button"
      aria-label="Add request"
      style={{
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    background: 'transparent',
    color: '#374151',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    userSelect: 'none',
      }}
    >
      <span style={{ transform: 'translateY(-1px)' }}>Add request</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 12h14M13 5l6 7-6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </Link>
    </div>
    
  </main>
  );
}
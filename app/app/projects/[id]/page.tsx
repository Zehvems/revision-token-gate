export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const paramss = await params;
    const projectId = paramss.id;
    const res = await fetch(
  `http://localhost:3000/api/projects/${projectId}/requests`,
  { cache: "no-store" }
);
    const data = await res.json();
    const requests = data.requests ?? [];


  return (
    <main>
      <h1>Project {projectId}</h1>
      <p>Requests:</p>
      <ul>
        {requests.map((r: any) => (
            <li key={r.id}>
                {r.body} — Round {r.roundNumber} — Type: {r.type}
                </li>))}
      </ul>
    </main>
  );
}
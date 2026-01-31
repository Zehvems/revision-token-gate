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
    const data = await res.json();
    const requests : RequestItem[] = data.requests ?? [];
    if(requests.length === 0) {
      return (
        <main><h1>No requests found for project {projectId}</h1></main>
      );
    }

  return (
    <main>
      <h1>Project {projectId}</h1>
      <p>Requests:</p>
      <ul>
        {requests.map((r: RequestItem) => (
            <li key={r.id}>
                {r.body} — Round {r.roundNumber} — Type: {r.type}
                </li>))}
      </ul>
    </main>
  );
}
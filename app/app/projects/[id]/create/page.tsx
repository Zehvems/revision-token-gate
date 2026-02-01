import RequestForm from "./RequestForm";

export default async function ProjectCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;
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
    // Renderowanie strony z formularzem dodawania poprawki
  return (
    <main>
      <h1>Project &ldquo;{project.name}&rdquo;</h1>
      <p>Dodaj nową poprawkę:</p>

      <RequestForm projectId={projectId} />
    </main>
  );
}

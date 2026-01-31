import RequestForm from "./RequestForm";

export default async function ProjectCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;

  return (
    <main>
      <h1>Project {projectId}</h1>
      <p>Requests:</p>

      <RequestForm projectId={projectId} />
    </main>
  );
}

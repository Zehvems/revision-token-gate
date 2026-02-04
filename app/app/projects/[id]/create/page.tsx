import { headers } from "next/headers";
import RequestForm from "./RequestForm";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export default async function ProjectCreatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectId } = await params;

  const h = await headers();
  const cookie = h.get("cookie") ?? ""; // ✅ forward 1:1
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/projects/${projectId}/requests`, {
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
  });

  if (res.status === 404) {
    return (
      <main>
        <h1>Project not found.</h1>
      </main>
    );
  }
  if (!res.ok) {
    return (
      <main>
        <h1>Error loading requests</h1>
      </main>
    );
  }

  const data = await res.json();
  const project = data.project;

  return (
    <main>
      <h1>Project &ldquo;{project.name}&rdquo;</h1>
      <RequestForm projectId={projectId} />
    </main>
  );
}

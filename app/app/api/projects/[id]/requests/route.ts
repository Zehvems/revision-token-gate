import { prisma } from "../../../../src/lib/prisma";
import { getWorkspaceKey } from "../../../../src/lib/workspace";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const wk = await getWorkspaceKey();
    const { id: projectId } = await params;

    console.log("Fetching requests for projectId+wk:", projectId, wk);

    // ✅ atomic: project must belong to this workspace
    const project = await prisma.project.findFirst({
      where: { id: projectId, workspaceKey: wk },
      select: { id: true, name: true, clientName: true, includedLimit: true },
    });

    if (!project) {
      return Response.json({ error: "project not found" }, { status: 404 });
    }

    const requests = await prisma.request.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    return Response.json(
      {
        status: "success",
        project,
        requests,
      },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    return Response.json({ error: "route err", detail: String(e) }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const paramss = await params;
  const wk = await getWorkspaceKey();
  const projectId = paramss.id;
  const data = await req.json();
  if (typeof data.body !== "string") {
    return Response.json({ error: "body required" }, { status: 400 });
  }
  const body = data.body.trim();
  if (!body) {
    return Response.json({ error: "body required" }, { status: 400 });
  }
console.log("Creating request for project ID and workspacekey: ", projectId, wk);
  const project = await prisma.project.findUnique({
    where: { id: projectId , workspaceKey: wk },
    select: { id: true, includedLimit: true, name: true },
  });
console.log("Found project: ", project);
  if (!project) {
    return Response.json({ error: "project not found" }, { status: 404 });
  }

  const count = await prisma.request.count({
    where: { projectId },
  });

  const roundNumber = count + 1;
  const type = roundNumber <= project.includedLimit ? "included" : "extra";

  const created = await prisma.request.create({
    data: {
      projectId,
      roundNumber,
      type,
      body,
    },
  });

  return Response.json(created, { status: 201 });
}
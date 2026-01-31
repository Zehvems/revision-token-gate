import { prisma } from "../../../../src/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const paramss = await params;
  const projectId = paramss.id;
  const data = await req.json();
  if (typeof data.body !== "string") {
    return Response.json({ error: "body required" }, { status: 400 });
  }
  const body = data.body.trim();
  if (!body) {
    return Response.json({ error: "body required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { includedLimit: true },
  });

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
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    console.log("Fetching requests for project ID:", projectId);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) {
      return Response.json({ error: "project not found" }, { status: 404 });
    }
    
    const requests = await prisma.request.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: "asc" },
    });
    console.error("Request *DEBUG*:", requests);
    if (!requests || requests.length === 0) {
      return Response.json({ message: "no requests found for this project", requests: [] }, { status: 200 });
    }

    return Response.json({ status: "success", requests }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "route err", detail: String(e) }, { status: 500 });
  }
}

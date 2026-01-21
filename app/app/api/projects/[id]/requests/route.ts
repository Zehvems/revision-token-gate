import { prisma } from "../../../../src/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { includedLimit: true },
  });

  if (!project) {
    return Response.json({ error: "project not found" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    projectId,
    includedLimit: project.includedLimit,
  });
}

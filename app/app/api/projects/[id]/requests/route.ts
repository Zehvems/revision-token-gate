import { prisma } from "../../../../src/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await params;
  console.log("HIT requests route", projectId);
  return Response.json({ ok: true, projectId });
}

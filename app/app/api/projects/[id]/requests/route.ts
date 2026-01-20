import { prisma } from "../../../../src/lib/prisma";
export async function POST(req: Request, ctx: { params: { id: string } }) {
  const projectId = ctx.params.id;
  console.log("HIT requests route", projectId);
  return Response.json({ ok: true, projectId });
}

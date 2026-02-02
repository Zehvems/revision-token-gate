import { prisma } from "../../src/lib/prisma";
import { getWorkspaceKey } from "../../src/lib/workspace";
function badRequest(message: string, detail?: unknown) {
  return Response.json(
    { error: message, ...(detail ? { detail } : {}) },
    { status: 400 }
  );
}

export async function POST(req: Request) {
  try {
    const wk = await getWorkspaceKey();
    const data = await req.json();

    const name = typeof data?.name === "string" ? data.name.trim() : "";
    const clientNameRaw = typeof data?.clientName === "string" ? data.clientName.trim() : "";
    const clientName = clientNameRaw ? clientNameRaw : null;

    const includedLimit = data?.includedLimit;

    if (!name) return badRequest("name required");
    if (typeof includedLimit !== "number" || !Number.isInteger(includedLimit) || includedLimit < 0) {
      return badRequest("includedLimit must be int >= 0");
    }

    const project = await prisma.project.create({
      data: {
        name,
        clientName,
        includedLimit,
        workspaceKey: wk,
      },
      select: {
        id: true,
        name: true,
        clientName: true,
        includedLimit: true,
        createdAt: true,
      },
    });

    return Response.json({ project }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "route err", detail: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const wk = await getWorkspaceKey();

    const projects = await prisma.project.findMany({
      where: { workspaceKey: wk },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        clientName: true,
        includedLimit: true,
        createdAt: true,
      },
    });

    return Response.json({ projects }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "route err", detail: String(e) }, { status: 500 });
  }
}

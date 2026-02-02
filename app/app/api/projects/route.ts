import { prisma } from "../../src/lib/prisma";
import { getWorkspaceKey } from "../../src/lib/workspace";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const wk = await getWorkspaceKey();

    const name = typeof data.name === "string" ? data.name.trim() : "";
    const clientName =
      typeof data.clientName === "string" && data.clientName.trim()
        ? data.clientName.trim()
        : null;

    const includedLimit = data.includedLimit;

    if (!name) {
      return Response.json({ error: "name required" }, { status: 400 });
    }
    if (
      typeof includedLimit !== "number" ||
      !Number.isInteger(includedLimit) ||
      includedLimit < 0
    ) {
      return Response.json({ error: "includedLimit must be int >= 0" }, { status: 400 });
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
        // workspaceKey: true, // odkomentuj tylko jeśli chcesz debugować
      },
    });

    console.log("[projects:POST] wk=", wk, "created project id=", project.id);

    return Response.json({ project }, { status: 201 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "route err", detail: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const wk = await getWorkspaceKey();
    console.log("[projects:GET] wk=", wk);

    const projects = await prisma.project.findMany({
      where: { workspaceKey: wk },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        clientName: true,
        includedLimit: true,
        createdAt: true,
        // workspaceKey: true, // odkomentuj tylko jeśli chcesz debugować
      },
    });

    // console.log("[projects:GET] returned", projects);

    return Response.json({ projects }, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "route err", detail: String(e) }, { status: 500 });
  }
}

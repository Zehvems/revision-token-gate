import { prisma } from "../../src/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (typeof data.name !== "string") {
      return Response.json({ error: "name required" }, { status: 400 });
    }
    data.name = data.name.trim();
    if (!data.clientName) data.clientName = null;
    if (
      typeof data.includedLimit !== "number" ||
      !Number.isInteger(data.includedLimit)
    ) {
      return Response.json(
        { error: "includedLimit must be an integer" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        clientName: data.clientName,
        includedLimit: data.includedLimit,
      },
    });
    return Response.json(project, { status: 201 });
  } catch {
    return Response.json({ error: "route err" }, { status: 500 });
  }
}

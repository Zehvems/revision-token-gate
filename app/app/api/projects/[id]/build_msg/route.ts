import { prisma } from "../../../../src/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const paramss = await params;
    const projectId = paramss.id;
    const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { includedLimit: true },
  });
    const lastRequest = await prisma.request.findFirst({
  where: { projectId },
  orderBy: { roundNumber: "desc" },
    });
    const clientMessage = lastRequest
  ? buildClientMessage({
      roundNumber: lastRequest.roundNumber,
      includedLimit: project!.includedLimit,
      type: lastRequest.type,
    })
  : null;

    return Response.json(
  { projectId, project, lastRequest , clientMessage},
  { status: 200 }
);

  } catch (e) {
  console.error(e);
  return Response.json(
    { error: "route err", detail: String(e) },
    { status: 500 },
  );
}
}

function buildClientMessage({
  roundNumber,
  includedLimit,
  type,
}: {
  roundNumber: number;
  includedLimit: number;
  type: "included" | "extra";
}) {
  if (type === "extra") {
    return `Ta poprawka jest poza zakresem pakietu i wchodzi jako dodatkowa runda.`;
  }

  if (roundNumber === includedLimit) {
    return `To jest ostatnia runda poprawek w ramach pakietu.`;
  }

  return `Ta poprawka mieści się w ramach pakietu. Zbierz proszę wszystkie zmiany w jednej wiadomości.`;
}

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('included', 'extra');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "clientName" TEXT,
    "includedLimit" INTEGER NOT NULL,
    "workspaceKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "type" "RequestType" NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Request_projectId_idx" ON "Request"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_projectId_roundNumber_key" ON "Request"("projectId", "roundNumber");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

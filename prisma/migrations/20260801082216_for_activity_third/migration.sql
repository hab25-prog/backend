-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_workspaceId_fkey";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "workspaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

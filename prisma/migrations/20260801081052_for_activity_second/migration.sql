/*
  Warnings:

  - Changed the type of `action` on the `Activity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "action",
ADD COLUMN     "action" "ActivityAction" NOT NULL;

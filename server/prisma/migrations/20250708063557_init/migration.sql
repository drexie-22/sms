/*
  Warnings:

  - You are about to drop the column `institutionName` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `trainer` on the `Training` table. All the data in the column will be lost.
  - Added the required column `institution` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainers` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "institutionName",
DROP COLUMN "trainer",
ADD COLUMN     "institution" TEXT NOT NULL,
ADD COLUMN     "trainers" TEXT NOT NULL;

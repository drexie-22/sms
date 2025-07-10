/*
  Warnings:

  - You are about to drop the column `trainingMode` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `trainingType` on the `Training` table. All the data in the column will be lost.
  - Added the required column `mode` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "trainingMode",
DROP COLUMN "trainingType",
ADD COLUMN     "mode" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

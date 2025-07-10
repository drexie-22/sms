/*
  Warnings:

  - You are about to drop the column `trainers` on the `Training` table. All the data in the column will be lost.
  - Added the required column `trainer` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "trainers",
ADD COLUMN     "trainer" TEXT NOT NULL;

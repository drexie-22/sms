/*
  Warnings:

  - You are about to drop the column `trainingDate` on the `Training` table. All the data in the column will be lost.
  - Added the required column `date` to the `Training` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "trainingDate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

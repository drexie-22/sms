/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Training` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[institutionalCode]` on the table `Institution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InstitutionStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Institution" ADD COLUMN     "status" "InstitutionStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "createdAt";

-- CreateIndex
CREATE UNIQUE INDEX "Institution_institutionalCode_key" ON "Institution"("institutionalCode");

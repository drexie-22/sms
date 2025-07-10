/*
  Warnings:

  - You are about to drop the column `femaleParticipants` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `gadNotes` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `institution` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `maleParticipants` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `othersParticipants` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `totalParticipants` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `trainers` on the `Training` table. All the data in the column will be lost.
  - Added the required column `female` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionName` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `male` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `others` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainer` to the `Training` table without a default value. This is not possible if the table is not empty.
  - Made the column `province` on table `Training` required. This step will fail if there are existing NULL values in that column.
  - Made the column `municipality` on table `Training` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trainingType` on table `Training` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trainingMode` on table `Training` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Training" DROP COLUMN "femaleParticipants",
DROP COLUMN "gadNotes",
DROP COLUMN "institution",
DROP COLUMN "maleParticipants",
DROP COLUMN "othersParticipants",
DROP COLUMN "totalParticipants",
DROP COLUMN "trainers",
ADD COLUMN     "female" INTEGER NOT NULL,
ADD COLUMN     "institutionName" TEXT NOT NULL,
ADD COLUMN     "male" INTEGER NOT NULL,
ADD COLUMN     "others" INTEGER NOT NULL,
ADD COLUMN     "remarks" TEXT NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL,
ADD COLUMN     "trainer" TEXT NOT NULL,
ALTER COLUMN "province" SET NOT NULL,
ALTER COLUMN "municipality" SET NOT NULL,
ALTER COLUMN "trainingType" SET NOT NULL,
ALTER COLUMN "trainingMode" SET NOT NULL;

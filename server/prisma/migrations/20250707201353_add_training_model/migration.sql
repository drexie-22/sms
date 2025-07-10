-- CreateTable
CREATE TABLE "Training" (
    "id" SERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "province" TEXT,
    "municipality" TEXT,
    "trainers" TEXT,
    "trainingType" TEXT,
    "trainingMode" TEXT,
    "maleParticipants" INTEGER NOT NULL DEFAULT 0,
    "femaleParticipants" INTEGER NOT NULL DEFAULT 0,
    "othersParticipants" INTEGER NOT NULL DEFAULT 0,
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "gadNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

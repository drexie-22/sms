-- CreateTable
CREATE TABLE "Institution" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "completeAddress" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "institutionType" TEXT NOT NULL,
    "institutionalCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "deploymentDate" TIMESTAMP(3) NOT NULL,
    "yearDistributed" INTEGER NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

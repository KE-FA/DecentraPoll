-- CreateTable
CREATE TABLE "indexer_state" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastBlock" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indexer_state_pkey" PRIMARY KEY ("id")
);

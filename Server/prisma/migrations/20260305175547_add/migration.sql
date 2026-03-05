/*
  Warnings:

  - You are about to alter the column `walletAddress` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(42)`.

*/
-- CreateEnum
CREATE TYPE "PollStatus" AS ENUM ('PENDING', 'ACTIVE', 'ENDED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "walletVerified" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "walletAddress" SET DATA TYPE VARCHAR(42);

-- CreateTable
CREATE TABLE "polls" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contractPollId" INTEGER NOT NULL,
    "transactionHash" TEXT,
    "adminId" INTEGER NOT NULL,
    "status" "PollStatus" NOT NULL DEFAULT 'PENDING',
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_options" (
    "id" SERIAL NOT NULL,
    "pollId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_history" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pollId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "txHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "polls_status_idx" ON "polls"("status");

-- CreateIndex
CREATE INDEX "vote_history_pollId_idx" ON "vote_history"("pollId");

-- CreateIndex
CREATE INDEX "vote_history_userId_idx" ON "vote_history"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_history_userId_pollId_key" ON "vote_history"("userId", "pollId");

-- AddForeignKey
ALTER TABLE "polls" ADD CONSTRAINT "polls_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_history" ADD CONSTRAINT "vote_history_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "poll_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

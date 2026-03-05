/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `vote_history` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "vote_history_txHash_key" ON "vote_history"("txHash");

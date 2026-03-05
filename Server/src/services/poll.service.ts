// Handle DB logic for polls
import { PrismaClient } from "@prisma/client";
import { PollStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const pollService = {

  async updateDeadline(pollId: number, newDeadline: Date) {
    return prisma.poll.update({
      where: { id: pollId },
      data: { deadline: newDeadline }
    });
  },

  async markEnded(pollId: number) {
    return prisma.poll.update({
      where: { id: pollId },
      data: { status: PollStatus.ENDED }
    });
  }
};
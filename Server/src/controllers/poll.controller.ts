import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPolls = async (req: Request, res: Response) => {
  const polls = await prisma.poll.findMany({
    include: { admin: true }
  });

  res.json(polls);
};

export const getActivePolls = async (req: Request, res: Response) => {
  const polls = await prisma.poll.findMany({
    where: { status: "ACTIVE" }
  });

  res.json(polls);
};

export const getPollById = async (req: Request, res: Response) => {
  const poll = await prisma.poll.findUnique({
    where: { id: Number(req.params.id) }
  });

  res.json(poll);
};
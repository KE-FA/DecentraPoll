// Listens to blockchain events and stores vote history (real-time)
import { PrismaClient } from "@prisma/client";
import { contract } from "./blockchain.service";
import { EventLog } from "ethers";


const prisma = new PrismaClient();

export const startEventIndexer = async () => {

    console.log("Starting blockchain indexer...");

    const provider = contract.runner?.provider;

    if (!provider) throw new Error("Provider missing");

    // Get last indexed block
    let state = await prisma.indexerState.findUnique({
        where: { id: 1 }
    });

    if (!state) {
        const latestBlock = await provider.getBlockNumber();

        state = await prisma.indexerState.create({
            data: {
                id: 1,
                lastBlock: latestBlock
            }
        });
    }

    const latestBlock = await provider.getBlockNumber();

    console.log(`Syncing blocks ${state.lastBlock} → ${latestBlock}`);

    const events = await contract.queryFilter(
        contract.filters.Voted(),
        state.lastBlock,
        latestBlock
    );

    for (const event of events) {
        if (!(event instanceof EventLog)) continue;
        const voter = event.args?.voter;
        const pollId = event.args?.pollId;
        const option = event.args?.option;

        const user = await prisma.user.findUnique({
            where: { walletAddress: voter }
        });

        if (!user) continue;

        const existing = await prisma.voteHistory.findUnique({
            where: { txHash: event.transactionHash! }
        });

        if (existing) continue;

        await prisma.voteHistory.create({
            data: {
                userId: user.id,
                pollId: Number(pollId),
                optionId: Number(option),
                txHash: event.transactionHash!
            }
        });

    }

    await prisma.indexerState.update({
        where: { id: 1 },
        data: { lastBlock: latestBlock }
    });

    console.log("Blockchain sync complete");

    startLiveListener();
};

const startLiveListener = () => {

    console.log("Listening for new votes...");

    contract.on("Voted", async (voter, pollId, option, event) => {

        const user = await prisma.user.findUnique({
            where: { walletAddress: voter }
        });

        if (!user) return;

        const txHash = event.log.transactionHash;

        const existing = await prisma.voteHistory.findUnique({
            where: { txHash }
        });

        if (existing) return;

        await prisma.voteHistory.create({
            data: {
                userId: user.id,
                pollId: Number(pollId),
                optionId: Number(option),
                txHash
            }
        });

        console.log("Vote indexed:", txHash);

    });

};
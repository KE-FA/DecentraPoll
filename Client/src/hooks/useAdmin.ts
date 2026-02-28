// Handles Admin Blockchain Actions

export function useAdmin(contract: any) {

  const createPoll = async (
    title: string,
    description: string,
    options: string[],
    duration: number
  ) => {

    const tx = await contract.createPoll(
      title,
      description,
      options,
      duration
    );

    await tx.wait();

    alert("Poll created ✅");
  };

  const extendDeadline = async (pollId: number, extraTime: number) => {

    const tx = await contract.extendDeadline(
      pollId,
      extraTime
    );

    await tx.wait();

    alert("Deadline extended ✅");
  };

  const whitelistStudent = async (walletAddress: string) => {

    const tx = await contract.whitelistStudent(walletAddress);
    await tx.wait();

    alert("Student Whitelisted ✅");
  };

  return {
    createPoll,
    extendDeadline,
    whitelistStudent
  };
}
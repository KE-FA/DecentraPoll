import PollCard from "./PollCard";

export default function PollList({ polls, votes }: any) {
  return (
    <>
      {polls.map((poll: any) => (
        <PollCard
          key={poll.id}
          poll={poll}
          votes={votes}
        />
      ))}
    </>
  );
}
import PollCard from "./PollCard";

export default function PollList({ polls, vote }: any) {

  return (
    <>
      {polls.map((poll: any) => (
        <PollCard
          key={poll.id}
          poll={poll}
          vote={vote}
        />
      ))}
    </>
  );
}
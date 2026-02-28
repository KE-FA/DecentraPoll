import { LinearProgress, Typography, Box } from "@mui/material";

export default function ProgressBar({
  optionVotes,
  totalVotes,
  label
}: any) {

  const percent =
    totalVotes === 0
      ? 0
      : (optionVotes / totalVotes) * 100;

  return (
    <Box mt={2}>
      <Typography variant="body2">
        {label} — {optionVotes} votes
      </Typography>

      <LinearProgress
        variant="determinate"
        value={percent}
        sx={{ height: 10, borderRadius: 5 }}
      />

      <Typography variant="caption">
        {percent.toFixed(1)}%
      </Typography>
    </Box>
  );
}
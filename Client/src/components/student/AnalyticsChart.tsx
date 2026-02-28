import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Box, Typography } from "@mui/material";

export default function AnalyticsChart({ voteHistory }: any) {

  // Count votes per poll
  const dataMap: any = {};

  voteHistory.forEach((vote: any) => {
    if (!dataMap[vote.pollId]) {
      dataMap[vote.pollId] = 0;
    }
    dataMap[vote.pollId]++;
  });

  const chartData = Object.keys(dataMap).map((pollId) => ({
    poll: `Poll ${pollId}`,
    votes: dataMap[pollId],
  }));

  return (
    <Box mt={6}>
      <Typography variant="h5" mb={3}>
        📊 Participation Analytics
      </Typography>

      {chartData.length === 0 ? (
        <Typography>No participation data yet</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="poll" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="votes" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
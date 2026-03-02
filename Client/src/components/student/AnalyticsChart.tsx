import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { Typography, Box } from "@mui/material";

interface AnalyticsChartProps {
  voteHistory: any[];
}

export default function AnalyticsChart({ voteHistory }: AnalyticsChartProps) {

  const grouped: any = {};

  voteHistory.forEach((item: any) => {
    grouped[item.poll_id] =
      (grouped[item.poll_id] || 0) + 1;
  });

  const data = Object.keys(grouped).map(key => ({
    poll: key,
    votes: grouped[key]
  }));

  return (
    <Box mt={5}>
      <Typography variant="h5">
        📊 Participation Analytics
      </Typography>

      {data.length === 0 ? (
        <Typography>No analytics yet.</Typography>
      ) : (
        <BarChart
          width={500}
          height={300}
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="poll" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" />
        </BarChart>
      )}
    </Box>
  );
}
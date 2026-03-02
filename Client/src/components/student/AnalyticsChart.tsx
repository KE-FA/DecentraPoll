import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";
import { getVoteHistoryAPI } from "../../api/studentApi";
import { Typography, Box } from "@mui/material";

export default function AnalyticsChart() {

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {

    getVoteHistoryAPI().then(res => {

      const grouped: any = {};

      res.data.forEach((item: any) => {
        grouped[item.poll_id] =
          (grouped[item.poll_id] || 0) + 1;
      });

      const formatted = Object.keys(grouped).map(key => ({
        poll: key,
        votes: grouped[key]
      }));

      setData(formatted);
    });

  }, []);

  return (
    <Box mt={5}>
      <Typography variant="h5">
        📊 Participation Analytics
      </Typography>

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
    </Box>
  );
}
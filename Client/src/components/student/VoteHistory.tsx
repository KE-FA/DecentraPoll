import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { getVoteHistoryAPI } from "../../api/studentApi";

export default function VoteHistory() {

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    getVoteHistoryAPI().then(res => {
      setHistory(res.data);
    });
  }, []);

  return (
    <Box mt={5}>
      <Typography variant="h5">
        🧾 My Vote History
      </Typography>

      {history.length === 0 ? (
        <Typography>No votes yet.</Typography>
      ) : (
        history.map((item) => (
          <Box
            key={item.id}
            p={2}
            mt={2}
            border="1px solid #ddd"
            borderRadius={2}
          >
            <Typography>
              Poll ID: {item.poll_id}
            </Typography>
            <Typography>
              Option Index: {item.option_index}
            </Typography>
            <Typography variant="caption">
              Tx: {item.tx_hash}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
}
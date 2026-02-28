import { Button, Typography, Box } from "@mui/material";

export default function WalletGate({ connectWallet }: any) {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h5">
        Connect Wallet to Vote
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={connectWallet}
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
import { Button, Container, Typography } from "@mui/material";
import { ethers } from "ethers";
import axios from "axios";

const Login = () => {

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 1️⃣ Get nonce from backend
    const { data } = await axios.post("http://localhost:4000/api/wallet/nonce", {
      address,
    });

    // 2️⃣ Sign nonce
    const signature = await signer.signMessage(data.nonce);

    // 3️⃣ Verify signature
    const res = await axios.post("http://localhost:5000/api/wallet/verify", {
      address,
      signature,
    });

    // 4️⃣ Store token
    localStorage.setItem("token", res.data.token);

    window.location.href = "/student"; // or based on role
  };

  return (
    <Container>
      <Typography variant="h4">DecentraPoll</Typography>
      <Button variant="contained" onClick={connectWallet}>
        Connect Wallet
      </Button>
    </Container>
  );
};

export default Login;
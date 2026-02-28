import axios from "axios";

const API = "http://localhost:4000/api/wallet";

// Get nonce from backend
export const getNonce = async () => {
  return await axios.get(`${API}/nonce`, {
    withCredentials: true,
  });
};

// Verify signature and bind wallet
export const verifyAndBindWallet = async (
  address: string,
  signature: string
) => {
  return await axios.post(
    `${API}/verify`,
    { address, signature },
    { withCredentials: true }
  );
};
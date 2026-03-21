import axiosInstance from "./axiosInstance";

// Get wallet binding status for logged-in student
export const getWalletStatus = async () => {
  return axiosInstance.get("/api/wallet/status"); 
};

// Get nonce from backend
export const getNonce = async () => {
  return await axiosInstance.get(`/api/wallet/nonce`, {
    withCredentials: true,
  });
};

// Verify signature and bind wallet
export const verifyAndBindWallet = async (
  address: string,
  signature: string
) => {
  return await axiosInstance.post(
    `/api/wallet/verify`,
    { address, signature },
    { withCredentials: true }
  );
};
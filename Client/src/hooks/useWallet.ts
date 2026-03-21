// Manages Wallet State
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getNonce, verifyAndBindWallet, getWalletStatus } from "../api/walletApi";
import { getContract } from "../web3/contract";
import toast from "react-hot-toast";

export function useWallet() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isBound, setIsBound] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  // Restore wallet on page load
  useEffect(() => {
    const restoreWallet = async () => {
      try {
        if (!(window as any).ethereum) return;

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts: string[] = await provider.send("eth_accounts", []);

        if (accounts.length > 0) {
          const signerInstance = await provider.getSigner();

          // Check with backend if this wallet is already bound
          try {
            const { data } = await getWalletStatus();
            const boundWallet = data.walletAddress?.toLowerCase();

            if (boundWallet && accounts.map(a => a.toLowerCase()).includes(boundWallet)) {
              // Backend confirms wallet is bound
              setWallet(boundWallet);
              setSigner(signerInstance);
              setContract(getContract(signerInstance));
              setIsBound(true);
            } else {
              setIsBound(false);
              setWallet(null);
              setSigner(null);
              setContract(null);
            }
          } catch {
            setIsBound(false);
          }
        }
      } catch (err) {
        console.error("Restore wallet error:", err);
      } finally {
        setIsCheckingWallet(false);
      }
    };

    restoreWallet();
  }, []);

  // Connect and bind wallet
  const connectAndBind = async () => {
    try {
      setIsConnecting(true);
      setIsBinding(true);

      if (!(window as any).ethereum) {
        toast.error("MetaMask not installed", { position: "top-center" });
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signerInstance = await provider.getSigner();
      const address = (await signerInstance.getAddress()).toLowerCase();

      // Request nonce from backend
      const { data } = await getNonce();
      const signature = await signerInstance.signMessage(data.nonce);

      // Call backend to verify and bind wallet
      const res = await verifyAndBindWallet(address, signature);

      // If backend responds with already connected same wallet, treat as success
      if (res?.data?.walletAddress?.toLowerCase() === address) {
        setWallet(address);
        setSigner(signerInstance);
        setContract(getContract(signerInstance));
        setIsBound(true);

        toast.success("Wallet connected & bound successfully", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      console.error(error);

      let message = "Something went wrong";

      // Handle MetaMask user rejected signature
      if (error.code === 4001) {
        // 4001 is EIP-1193 user rejected request error
        message = "Transaction/signature was cancelled by the user";
      } else if (error?.response?.data?.message) {
        // Backend error
        message = error.response.data.message;
      }

      toast.error(message, { position: "top-center" });

      // Reset state
      setIsBound(false);
      setWallet(null);
      setSigner(null);
      setContract(null);

    } finally {
      setIsConnecting(false);
      setIsBinding(false);
    }
  };

  // Optional: reset wallet (e.g., if admin resets it)
  const resetWallet = () => {
    setIsBound(false);
    setWallet(null);
    setSigner(null);
    setContract(null);
  };

  return {
    wallet,
    contract,
    signer,
    isBound,
    isConnecting,
    isBinding,
    isCheckingWallet,
    connectAndBind,
    resetWallet,
  };
}
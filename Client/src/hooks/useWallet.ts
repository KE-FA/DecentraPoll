// Manages Wallet State
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getNonce, verifyAndBindWallet } from "../api/walletApi";
import { getContract } from "../web3/contract";


export function useWallet() {

  const [wallet, setWallet] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [isCheckingWallet, setIsCheckingWallet] = useState(true);

  useEffect(() => {
  const restoreWallet = async () => {
    try {
      if (!(window as any).ethereum) return;

      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );

      const accounts = await provider.send("eth_accounts", []);

      if (accounts.length > 0) {
        const signerInstance = await provider.getSigner();

        setWallet(accounts[0]);
        setSigner(signerInstance);
        setContract(getContract(signerInstance));
      }
    } catch (err) {
      console.error("Restore wallet error:", err);
    } finally {
      setIsCheckingWallet(false);
    }
  };

  restoreWallet();
}, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      if (!(window as any).ethereum) {
        alert("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );

      const signerInstance = await provider.getSigner();
      const address = await signerInstance.getAddress();

      setWallet(address);
      setSigner(signerInstance);
      setContract(getContract(signerInstance));

    } catch (error) {
      console.error("Connect wallet error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const bindWallet = async () => {
    try {
      if (!signer || !wallet) {
        alert("Connect wallet first");
        return;
      }

      setIsBinding(true);

      const nonceRes = await getNonce();
      const nonce = nonceRes.data.nonce;

      const signature = await signer.signMessage(nonce);

      await verifyAndBindWallet(wallet, signature);

      alert("Wallet Bound Successfully");

    } catch (error) {
      console.error("Bind wallet error:", error);
      alert("Failed to bind wallet");
    } finally {
      setIsBinding(false);
    }
  };

  return {
    wallet,
    contract,
    signer,
    connectWallet,
    bindWallet,
    isConnecting,
    isBinding,
    isCheckingWallet
  };
}
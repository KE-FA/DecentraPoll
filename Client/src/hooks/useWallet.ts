// Manages Wallet State
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getNonce, verifyAndBindWallet } from "../api/walletApi";
import { getContract } from "../web3/contract";
import toast from "react-hot-toast";


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

  const connectAndBind = async () => {
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

      setIsBinding(true);

      // Bind immediately
      const { data } = await getNonce();
      const signature = await signerInstance.signMessage(data.nonce);


      await verifyAndBindWallet(address, signature);


      toast.success("Wallet connected & bound!");

    } catch (error) {
      console.error(error);
    } finally {
      setIsBinding(false);

      setIsConnecting(false);
    }
  };

  return {
    wallet,
    contract,
    signer,
    connectAndBind,
    isConnecting,
    isBinding,
    isCheckingWallet
  };
}
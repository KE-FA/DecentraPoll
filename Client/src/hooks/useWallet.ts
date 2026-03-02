// Manages Wallet State
import { useState } from "react";
import { ethers } from "ethers";
import { getNonce, verifyAndBindWallet } from "../api/walletApi";
import { getContract } from "../web3/contract";

export function useWallet() {

  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  const connectWallet = async () => {

    const provider = new ethers.BrowserProvider(
      (window as any).ethereum
    );

    const signerInstance = await provider.getSigner();
    const address = await signerInstance.getAddress();

    setWallet(address);
    setSigner(signerInstance);
    setContract(getContract(signerInstance));
  };

  const bindWallet = async () => {

    const nonceRes = await getNonce();
    const nonce = nonceRes.data.nonce;

    const signature = await signer.signMessage(nonce);

    await verifyAndBindWallet(wallet, signature);

    alert("Wallet Bound Successfully");
  };

  return {
    wallet,
    contract,
    connectWallet,
    bindWallet
  };
}
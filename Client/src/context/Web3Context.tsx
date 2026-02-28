import { createContext, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../web3/contract";

export const Web3Context = createContext<any>(null);

export const Web3Provider = ({ children }: any) => {

  const [wallet, setWallet] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);

  const connectWallet = async () => {

    if (!(window as any).ethereum) {
      alert("Install MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const signerInstance = await provider.getSigner();
    const address = await signerInstance.getAddress();

    setWallet(address);
    setSigner(signerInstance);
    setContract(getContract(signerInstance));
  };

  return (
    <Web3Context.Provider value={{
      wallet,
      contract,
      signer,
      connectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};
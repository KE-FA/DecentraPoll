// Manages Wallet State Globally

import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../../src/web3/contract";
import { getNonce, verifyAndBindWallet } from "../api/walletApi";

export function useWallet() {

    const [wallet, setWallet] = useState<string>("");
    const [contract, setContract] = useState<any>(null);
    const [signer, setSigner] = useState<any>(null);
    const [network, setNetwork] = useState<string>("");

    const connectWallet = async () => {

        if (!(window as any).ethereum) {
            alert("Install MetaMask");
            return;
        }

        const provider = new ethers.BrowserProvider(
            (window as any).ethereum
        );

        const signerInstance = await provider.getSigner();
        const address = await signerInstance.getAddress();

        const networkInfo = await provider.getNetwork();

        setWallet(address);
        setSigner(signerInstance);
        setNetwork(networkInfo.name);

        setContract(getContract(signerInstance));
    };
    const bindWallet = async () => {

        if (!signer || !wallet) return;

        // 1️⃣ Get nonce from backend
        const nonceResponse = await getNonce();
        const nonce = nonceResponse.data.nonce;

        // 2️⃣ Sign nonce with wallet
        const signature = await signer.signMessage(nonce);

        // 3️⃣ Send signature to backend for verification
        await verifyAndBindWallet(wallet, signature);

        alert("Wallet successfully bound to student account ✅");
    };

    return {
        wallet,
        contract,
        signer,
        network,
        connectWallet,
        bindWallet
    };
}
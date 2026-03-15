import { ethers } from "ethers";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0x588758d8a0Ad1162A6294f3C274753137E664aE0";

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
};
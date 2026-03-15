import { ethers } from "ethers";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0x55548609a728DB2953Aed74E1d470e56433F02D1";

export const getContract = (signer: ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
};
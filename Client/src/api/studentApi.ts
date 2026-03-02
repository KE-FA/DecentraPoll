import axiosInstance from "./axiosInstance";

export const getVoteHistoryAPI = async () => {
  return axiosInstance.get("/user/history");
};
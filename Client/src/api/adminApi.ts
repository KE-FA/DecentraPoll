import axiosInstance from "./axiosInstance";

export const createPollAPI = async (data: any) => {
  return axiosInstance.post("/admin/polls", data);
};

export const getPollsAPI = async () => {
  return axiosInstance.get("/polls");
};

// export const getVoteHistoryAPI = async () => {
//   return axiosInstance.get("/student/history");
// };
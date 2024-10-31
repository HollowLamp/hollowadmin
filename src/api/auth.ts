import { axiosInstance } from "./config";

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await axiosInstance.post("/login", {
    username,
    password,
  });
  return response.data.token;
};

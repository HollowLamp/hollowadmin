import axios from "axios";

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    username,
    password,
  });
  return response.data.token;
};

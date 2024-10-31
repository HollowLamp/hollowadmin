import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 3000,
});

export async function login(username: string, password: string) {
  const response = await axiosInstance.post("/user/login", {
    username,
    password,
  });
  return response.data.token;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return error.response;
  }
);

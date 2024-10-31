import axios from "axios";
import { API_BASE_URL } from './config';
import { getUser } from "./user";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    const { data } = response;
    
    console.log(data);

    if (data && data.access_token) {
      sessionStorage.setItem('token', data.access_token);
      const user = await  getUser();
      console.log(user);
      sessionStorage.setItem('user', JSON.stringify(user));
      return data;
    }

    throw new Error("Invalid response data");
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post("/logout", {}, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Failed to logout.");
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/user", { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    return response;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return null;
    } else {
      console.error("Auth check failed:", error);
      throw new Error("Failed to check authentication status.");
    }
  }
};

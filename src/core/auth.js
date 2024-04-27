import axios from "axios";
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        if (response.data) {
            sessionStorage.setItem('token', response.data.access_token);
            return response.data;
        }
    } catch (error) {
        return error;
    }
};

export const logout = async () => {
    const response = await api.post("/logout", {}, { headers: { Authorization: `Bearer ${ sessionStorage.getItem('token') }` } })
        .then((response) => {
            sessionStorage.removeItem('token');
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
};
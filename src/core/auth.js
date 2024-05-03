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
        return false;
    }
};

export const logout = async () => {
    try {
        await api.post("/logout", {}, { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
        sessionStorage.removeItem('token');
    } catch (error) {
        throw new Error("Failed to logout.");
    }
};

export const checkAuth = async () => {
    // try {
    //     const response = api.get("/user", { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } });
    //     return response;
    // } catch (error) {
    //     const status = error.response.status;
    //     console.log(status);
    //     if (status === 401) {
    //         console.log(401);
    //         sessionStorage.removeItem('token');
    //         return false;
    //     } else {
    //         throw new Error("Failed to check authentication status.");
    //     }
    // }
    api.get("/user", { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }).then(function(response) {
        return response;
    }).catch(function (error) {
        const status = error.response.status;
        if (status === 401) {
            sessionStorage.removeItem('token');
            return false;
        } else {
            throw new Error("Failed to check authentication status.");
        }
    });
};

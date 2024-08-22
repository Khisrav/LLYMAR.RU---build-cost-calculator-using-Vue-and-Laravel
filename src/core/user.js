import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL
});

export const getUser = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) return user;
    
    try {
        const response = await api.get('/user', {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}});
        sessionStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return error;
    }
};
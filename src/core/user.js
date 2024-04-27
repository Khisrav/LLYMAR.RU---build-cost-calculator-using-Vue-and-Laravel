import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL
});

export const getUser = async () => {
    try {
        const response = await api.get('/user', {headers: {Authorization: `Bearer ${sessionStorage.getItem('token')}`}});
        return response.data;
    } catch (error) {
        return error;
    }
};
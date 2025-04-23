import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8002', // Adjust based on your backend URL
});

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/convert/', formData);
    return response.data;
};
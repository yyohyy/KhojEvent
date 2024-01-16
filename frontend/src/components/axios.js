import axios from 'axios';

const baseurl ='https://127.0.0.1:8000/'
const AxiosInstance = axios.create({
    baseURL: baseurl,
    timeout:50000,
    headers: {
        "Content-Type": "application/json",
        accept:"application/json"
    }
})
export default AxiosInstance;
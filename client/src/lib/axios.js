import axios from "axios"

const axiosInstanace = axios.create({
    baseURL : "http://localhost:3000/api",
    withCredentials : true
});

export default axiosInstanace;
// import axios from 'axios'
// export const api = axios.create({
//     baseURL: import.meta.env.API_URL || 'http://localhost:1111/api',
//     withCredentials: true,
//     headers: { "Content-Type": "application/json" }
// })
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:1111/api',
    withCredentials: true

})

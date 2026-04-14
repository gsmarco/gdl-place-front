// src/api.ts
import axios from "axios";
import { getEndPoint, getVars } from "../app/components/global";
import { Variable } from "lucide-react";
var api = axios.create();
const baseURL = getEndPoint("");
alert(baseURL);
try {
  const Variables = getVars("");
  api = axios.create({
    baseURL: baseURL, // tu servidor Express
    headers: {
      Authorization: `Bearer ${Variables.token}`,
      "Content-Type": "application/json",
    },
  });
} catch (error) {
  console.log("Error: ", error);
}

export default api;

// import axios from 'axios';

// const api = axios.create({
//     baseURL: 'http://localhost:3000', // tu backend Nest
// });

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('access_token');

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });

// export default api;

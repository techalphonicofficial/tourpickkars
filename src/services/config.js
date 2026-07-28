// import axios from "axios";

// export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // ✅ axios instance
// export const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// }); 


import axios from "axios";

const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const API_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || "https://dashboard.tourpickkars.in/api"
);
export const MEDIA_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_MEDIA_PATH || "https://dashboard.tourpickkars.in/storage"
);

export const apiEndpoint = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${normalizedPath}`;
};

export const mediaUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${MEDIA_URL}${normalizedPath}`;
};

// ✅ axios instance with timeout
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 second timeout
});

// ✅ Add request interceptor for better error handling
api.interceptors.request.use( 
  (config) => {
    // Add timeout to every request
    config.timeout = config.timeout || 60000;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
    }
    return Promise.reject(error);
  }
);

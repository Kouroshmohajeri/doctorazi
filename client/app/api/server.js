import axios from "axios";

const API = axios.create({
  baseURL: "https://doctorazi.com/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Example of using an interceptor for response error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    console.error("An API error occurred", error);
    return Promise.reject(error);
  }
);

export default API;

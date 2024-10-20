import axios from "axios";

const API = axios.create({
  baseURL: "http://62.60.204.118:8800/api",
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
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

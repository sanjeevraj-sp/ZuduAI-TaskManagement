// src/httpService.js
import axios from "axios";

const host = "/api";

const http = axios.create({
  baseURL: host,
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility to inject token manually per request
const setAuthToken = (token) => {
  if (token) {
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
};

export default http;
export { setAuthToken };

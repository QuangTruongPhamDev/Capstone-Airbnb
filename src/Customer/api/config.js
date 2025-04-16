import axios from "axios";

export const BASE_URL = "https://airbnbnew.cybersoft.edu.vn";

export const CYBER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjAzLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Njg1NzYwMDAwMCIsIm5iZiI6MTcyOTcwMjgwMCwiZXhwIjoxNzU3MDA1MjAwfQ.nPo29RkxTkE_C16RhJnxw90M3v3cu3Ur91a47F5epxA";

let userInfo = null;
try {
  const userJson = localStorage.getItem("USER");
  if (userJson) {
    userInfo = JSON.parse(userJson);
  }
} catch (err) {
  console.error("Lỗi parse USER:", err);
}

export const https = axios.create({
  baseURL: BASE_URL,
  headers: {
    tokenCybersoft: CYBER_TOKEN,
    token: userInfo ? `${userInfo.token}` : "",
  },
});

export const updateAuthToken = (token) => {
  https.defaults.headers["token"] = `${token}`;
};

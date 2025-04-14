import axios from "axios";

export const CYBER_TOKERN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjAzLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Njg1NzYwMDAwMCIsIm5iZiI6MTcyOTcwMjgwMCwiZXhwIjoxNzU3MDA1MjAwfQ.nPo29RkxTkE_C16RhJnxw90M3v3cu3Ur91a47F5epxA";

export const https = axios.create({
    baseURL: "https://airbnbnew.cybersoft.edu.vn",
    headers: {
      TokenCybersoft: CYBER_TOKERN,
    },
  });

  https.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // hoặc từ redux
    if (token) {
      config.headers.token = `${token}`;
    }
    return config;
  });
  
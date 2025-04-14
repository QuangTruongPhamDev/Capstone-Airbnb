import axios from "axios";

export const CYBER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjAzLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Njg1NzYwMDAwMCIsIm5iZiI6MTcyOTcwMjgwMCwiZXhwIjoxNzU3MDA1MjAwfQ.nPo29RkxTkE_C16RhJnxw90M3v3cu3Ur91a47F5epxA";

const userJson = localStorage.getItem("USER");
const userInfo = JSON.parse(userJson);

export const https = axios.create({
  baseURL: "https://airbnbnew.cybersoft.edu.vn",
  headers: {
    tokenCybersoft: CYBER_TOKEN,
    token: userInfo ? `Bearer ${userInfo.accessToken}` : "",
  },
});

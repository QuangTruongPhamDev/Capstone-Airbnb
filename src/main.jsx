import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App.jsx";
import userSlice from "./Customer/redux/userSlice.js";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./Customer/redux/loadingSlice.js";

// --- Cấu hình cho React Leaflet ---
import "leaflet/dist/leaflet.css"; // Import CSS của Leaflet
import L from "leaflet";
// Import các ảnh marker từ node_modules của leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Xóa cách lấy icon URL mặc định cũ có thể gây lỗi với bundler
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// --- Kết thúc cấu hình React Leaflet ---

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    loadingSlice: loadingSlice,
  },
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </StrictMode>,
);

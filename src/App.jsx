import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "./Admin/pages/AdminPage/AdminPage";
import Template_admin from "./Admin/template_admin/template_admin";
import LocationPage from "./Admin/pages/LocationPage/LocationPage";
import ReservationPage from "./Admin/pages/ReservationPage/ReservationPage";
import UserPage from "./Admin/pages/UserPage/UserPage";
import { Toaster } from "react-hot-toast";
import Template from "./Customer/template/Template";
import HomePage from "./Customer/pages/HomePage/HomePage";
import LoginPage from "./Customer/pages/LoginPage/LoginPage";
import RegisterPage from "./Customer/pages/RegisterPage/RegisterPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Template content={<HomePage />} />} />
          <Route
            path="/dangnhap"
            element={<Template content={<LoginPage />} />}
          />
          <Route
            path="/dangky"
            element={<Template content={<RegisterPage />} />}
          />
          <Route
            path="/UserPage"
            element={<Template_admin content={<UserPage />} />}
          />
          <Route
            path="/LocationPage"
            element={<Template_admin content={<LocationPage />} />}
          />
          <Route
            path="/AdminPage"
            element={<Template_admin content={<AdminPage />} />}
          />
          <Route
            path="/ReservationPage"
            element={<Template_admin content={<ReservationPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

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


function App() {
  return (
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/UserPage" element={<Template_admin content={<UserPage/>} />}/>
        <Route path="/LocationPage" element={<Template_admin content={<LocationPage />}/>}/>
        <Route path="/AdminPage" element={<Template_admin content ={<AdminPage/>}/>}/>
        <Route path="/ReservationPage" element={<Template_admin content={<ReservationPage/>}/>}/>
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;

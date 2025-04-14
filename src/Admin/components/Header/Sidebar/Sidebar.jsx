import React from "react";
import "./index.css";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar-body">
        <div className="sidebar-sidebar">
        <h2 className="sidebar-h2">CYBERLEARN</h2>
        <ul className="sidebar-ul">
            <Link to="/UserPage">
            <li className="sidebar-li">
                <span className="sidebar-span" href="#">Quản lý người dùng</span>
            </li>
            </Link>
            <Link to="/LocationPage">
            <li className="sidebar-li">
                <span href="#" className="sidebar-span">Quản lý thông tin vị trí</span>
            </li>
            </Link>
            <Link to="/AdminPage">
            <li className="active sidebar-li">
                <span href="#" className="sidebar-span">Quản lý thông tin phòng</span>
            </li>
            </Link>
            <Link to="/ReservationPage">
            <li className="sidebar-li">
                <span href="#" className="sidebar-span">Quản lý đặt phòng</span>
            </li>
            </Link>
        </ul>
        </div>
    </div>
  );
}

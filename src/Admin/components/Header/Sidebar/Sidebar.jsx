import React from "react";
import "./index.css";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOutAction } from "../../../../Customer/redux/userSlice";

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOutAction());
    navigate("/");
  };

  return (
    <div className="sidebar-body">
      <div className="sidebar-sidebar">
        <div className="sidebar-logo">
          <i className="sidebar-icon fab fa-airbnb"></i>
          <h2 className="sidebar-h2">airbnb</h2>
        </div>
        <ul className="sidebar-ul">
          <Link to="/UserPage">
            <li
              className={`sidebar-li ${
                pathname === "/UserPage" ? "active" : ""
              }`}
            >
              <span className="sidebar-span">Quản lý người dùng</span>
            </li>
          </Link>
          <Link to="/LocationPage">
            <li
              className={`sidebar-li ${
                pathname === "/LocationPage" ? "active" : ""
              }`}
            >
              <span className="sidebar-span">Quản lý thông tin vị trí</span>
            </li>
          </Link>
          <Link to="/AdminPage">
            <li
              className={`sidebar-li ${
                pathname === "/AdminPage" ? "active" : ""
              }`}
            >
              <span className="sidebar-span">Quản lý phòng</span>
            </li>
          </Link>
          <Link to="/ReservationPage">
            <li
              className={`sidebar-li ${
                pathname === "/ReservationPage" ? "active" : ""
              }`}
            >
              <span className="sidebar-span">Quản lý đặt phòng</span>
            </li>
          </Link>
          <div className="sidebar-logout">
            <div className="sidebar-avatar">A</div>
            <button onClick={handleLogout} className="btn btn-danger">
              <span className="sidebar-span-1">Đăng xuất</span>
            </button>
          </div>
        </ul>
      </div>
    </div>
  );
}

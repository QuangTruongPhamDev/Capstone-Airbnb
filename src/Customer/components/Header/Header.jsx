import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOutAction } from "../../redux/userSlice";

export default function Header() {
  const { user } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    setTimeout(() => {
      dispatch(logOutAction());
      navigate("/dangnhap");
    }, 500);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`px-5 sm:px-20 flex justify-between items-center h-20 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow text-black" : "bg-transparent text-white"
      }`}
    >
      {/* Logo Text */}
      <Link to="/" className="flex items-center">
        <span
          className={`text-4xl font-bold transition-all duration-300 ${
            isScrolled
              ? "text-red-600 transform scale-105"
              : "text-white transform scale-100"
          }`}
          style={{
            textShadow: isScrolled ? "2px 2px 4px rgba(0, 0, 0, 0.3)" : "none",
          }}
        >
          MyMovie
        </span>
      </Link>

      {/* Avatar & Dropdown */}
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 cursor-pointer"
          onClick={toggleDropdown}
        >
          <img
            src={user?.avatar || "https://i.pravatar.cc/150?img=47"} // Avatar mặc định
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {isDropdownOpen && (
          <div
            className={`absolute top-14 right-0 rounded-lg shadow-lg w-48 p-4 transition-all duration-300 ${
              isScrolled ? "bg-white text-black" : "bg-black/70 text-white"
            }`}
          >
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 px-4 rounded hover:bg-gray-200"
                >
                  Thông tin cá nhân
                </Link>
                <span
                  onClick={handleLogout}
                  className="block py-2 px-4 rounded cursor-pointer hover:bg-red-200 text-red-600"
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link
                  to="/dangnhap"
                  className="block py-2 px-4 rounded hover:bg-gray-200"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/dangky"
                  className="block py-2 px-4 rounded hover:bg-gray-200"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logOutAction } from "../../redux/userSlice";
import { Menu, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons";

const menuItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Services", id: "services" },
  { label: "Pricing", id: "pricing" },
  { label: "Contact", id: "contact" },
];

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userSlice);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    // Gọi handleScroll một lần khi mount để set trạng thái ban đầu nếu trang đã cuộn
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      console.warn(`Section with id "${id}" not found for scrolling.`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logOutAction());
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  // Màu sắc động cho logo và text menu
  const currentLogoColor = isScrolled ? "#FF385C" : "#FFFFFF"; // Đỏ hồng Airbnb / Trắng
  const currentMenuTextColor = isScrolled ? "text-gray-700" : "text-gray-100";
  const currentMenuHoverColor = isScrolled
    ? "hover:text-red-500"
    : "hover:text-white hover:bg-white hover:bg-opacity-10";

  const siteName = "airbnb"; // THAY THẾ TÊN TRANG WEB CỦA BẠN
  const logoIconSizeHeader = isScrolled ? "lg" : "xl";
  const logoTextSizeHeader = isScrolled ? "text-xl" : "text-2xl";
  const avatarSrc = user?.avatar || "/images/default-avatar.png"; // THAY THẾ AVATAR MẶC ĐỊNH

  const renderUserDropdownItems = () => {
    if (user) {
      return (
        <>
          <p
            className={`font-medium mb-1 px-3 pt-2 text-sm ${
              isScrolled ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Xin chào, {user.name || user.taiKhoan || "User"}
          </p>
          <Link
            to="/profile"
            className={`block w-full text-left py-2 px-3 rounded text-sm transition-colors duration-150 ${
              isScrolled
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-600 text-gray-100"
            }`}
            onClick={() => setIsUserDropdownOpen(false)}
          >
            Thông tin cá nhân
          </Link>
          <button
            onClick={handleLogout}
            className={`block text-left w-full py-2 px-3 rounded text-sm transition-colors duration-150 ${
              isScrolled
                ? "text-red-600 hover:bg-red-100"
                : "text-red-400 hover:bg-red-700 hover:text-red-200"
            }`}
          >
            Đăng xuất
          </button>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={() => {
              navigate("/dangnhap");
              setIsUserDropdownOpen(false);
            }}
            className={`block text-left w-full py-2 px-3 rounded text-sm transition-colors duration-150 ${
              isScrolled
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-600 text-gray-100"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              navigate("/dangky");
              setIsUserDropdownOpen(false);
            }}
            className={`block text-left w-full py-2 px-3 rounded text-sm transition-colors duration-150 ${
              isScrolled
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-600 text-gray-100"
            }`}
          >
            Đăng ký
          </button>
        </>
      );
    }
  };

  // Ngay trước khi return trong component Header
  console.log("Header RENDER - isScrolled:", isScrolled);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`} // text-color chung sẽ được các phần tử con tự quản lý
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer animate__animated animate__fadeIn"
          onClick={() => (user ? navigate("/") : scrollToSection("home"))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              user ? navigate("/") : scrollToSection("home");
            }
          }}
          aria-label={`Logo ${siteName}`}
        >
          <FontAwesomeIcon
            icon={faAirbnb}
            style={{ color: currentLogoColor }}
            size={logoIconSizeHeader}
          />
          <span
            className={`${logoTextSizeHeader} font-bold`}
            style={{
              color: currentLogoColor,
              fontFamily:
                "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}
          >
            {siteName}
          </span>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${currentMenuTextColor} ${currentMenuHoverColor}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Avatar (luôn hiển thị) + Dropdown */}
        <div className="flex items-center">
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setIsUserDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 rounded-full p-0.5 sm:p-1 transition-colors duration-150 hover:bg-gray-500 hover:bg-opacity-20 focus:outline-none"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={isUserDropdownOpen}
            >
              <Menu
                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                  isScrolled ? "text-gray-600" : "text-white"
                } md:hidden`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMenuOpen(true);
                }}
              />
              <img
                src={avatarSrc}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 object-cover"
                style={{
                  borderColor: isScrolled
                    ? user
                      ? "#F97316"
                      : "#D1D5DB"
                    : user
                    ? "#FDBA74"
                    : "#9CA3AF",
                }}
                alt="User Avatar"
              />
            </button>
            {isUserDropdownOpen && (
              <div
                ref={dropdownRef}
                className={`absolute right-0 top-full mt-2 w-56 rounded-md shadow-lg p-1 z-20 text-sm
                  ${
                    isScrolled
                      ? "bg-white ring-1 ring-black ring-opacity-5 text-gray-700"
                      : "bg-gray-800 bg-opacity-95 text-white"
                  }`}
              >
                {renderUserDropdownItems()}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu (panel) */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-full max-w-xs bg-white text-black z-[60] transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } shadow-2xl`}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 border-b border-gray-200">
            {/* Logo trong mobile menu */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => {
                scrollToSection("home");
                setIsMobileMenuOpen(false);
              }}
            >
              <FontAwesomeIcon
                icon={faAirbnb}
                style={{ color: "#FF385C" }}
                size="lg"
              />
              <span
                className="text-xl font-semibold"
                style={{
                  color: "#FF385C",
                  fontFamily:
                    "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}
              >
                {siteName}
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-red-500 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <hr className="my-3 border-gray-200" />
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="font-medium text-gray-700">
                    Xin chào, {user.name || user.taiKhoan}
                  </p>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block mt-1 text-sm text-blue-600 hover:underline"
                  >
                    Xem hồ sơ
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <div className="px-3 pt-3 space-y-3">
                <button
                  onClick={() => {
                    navigate("/dangnhap");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-red-500 text-white px-4 py-2.5 rounded-md hover:bg-red-600 transition-colors text-base font-medium"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    navigate("/dangky");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center border border-gray-300 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-50 transition-colors text-base font-medium"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-[55]"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}
      </div>
    </header>
  );
}

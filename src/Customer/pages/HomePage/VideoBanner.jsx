import React from "react";
import BannerVideo from "../../../assets/video-banner.mp4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAirbnb } from "@fortawesome/free-brands-svg-icons/faAirbnb";

export default function VideoBanner() {
  // --- Cấu hình cho logo và text trên banner ---
  const siteNameForBanner = "airbnb"; // THAY THẾ TÊN TRANG WEB CỦA BẠN
  const primaryRedColor = "#FF385C"; // Màu đỏ hồng Airbnb cho logo và viền SVG
  // Hoặc một màu đỏ khác từ Tailwind ví dụ: "#EF4444" (red-500)

  // Kích thước cho logo trên Banner (to hơn)
  const logoIconSizeBanner = "4x"; // Kích thước FontAwesome (ví dụ: 3x, 4x, 5x)
  const logoTextSizeBanner = "text-5xl sm:text-6xl md:text-7xl"; // Tailwind class

  // --- Cấu hình cho đường cong SVG và đường viền ---
  // const gradientStartColor = "#D4AF37"; // Không dùng gradient nữa nếu viền đồng màu đỏ
  // const gradientEndColor = "#EF4444";   // Không dùng gradient nữa
  const mainCurveFillColor = "#ffffff"; // Màu nền của khối cong chính (trắng)
  const strokeColorForCurve = primaryRedColor; // Màu đỏ đồng nhất cho viền
  const strokeWidth = 5; // Độ dày của đường viền

  // --- Path data cho SVG ---
  const curveTopLinePathData =
    "M0,224L48,208C96,192,192,160,288,160C384,160,480,192,576,218.7C672,245,768,267,864,250.7C960,235,1056,181,1152,154.7C1248,128,1344,128,1392,128L1440,128";
  const whiteCurveFillPathData = `${curveTopLinePathData}L1440,320L0,320Z`;

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
      {/* 1. Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        poster="/images/poster-video.jpg" // THAY THẾ ảnh poster
      >
        {/* THAY THẾ bằng đường dẫn đến video của bạn trong thư mục public */}
        {/* Nếu BannerVideo là biến import: src={BannerVideo} */}
        <source src={BannerVideo} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>

      {/* 2. Lớp phủ màu (Overlay) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 z-10"></div>

      {/* 3. Nội dung trên Banner (Logo và Tagline, căn trái) */}
      <div className="relative z-30 flex flex-col items-start justify-center h-full text-white p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24">
        {/* Logo (Sử dụng Font Awesome icon) */}
        <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6 animate__animated animate__fadeInUp animate__delay-0.5s">
          <FontAwesomeIcon
            icon={faAirbnb}
            style={{ color: primaryRedColor }} // Sử dụng màu đỏ đồng nhất
            size={logoIconSizeBanner}
          />
          <span
            className={`${logoTextSizeBanner} font-bold`}
            style={{
              color: primaryRedColor, // Sử dụng màu đỏ đồng nhất
              fontFamily:
                "'Circular', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              // Bạn có thể thay đổi font nếu muốn
            }}
          >
            {siteNameForBanner}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 animate__animated animate__fadeInUp animate__delay-1s">
          Mọi thứ bạn cần cho một chuyến đi hoàn hảo {/* THAY THẾ tagline */}
        </p>
      </div>

      {/* 4. Đường cong SVG với đường viền màu đỏ đồng nhất */}
      <div className="absolute bottom-0 left-0 w-full z-20 leading-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="block w-full h-auto"
        >
          {/* Không cần <defs> và <linearGradient> nữa */}

          {/* Lớp nền trắng của đường cong */}
          <path fill={mainCurveFillColor} d={whiteCurveFillPathData} />

          {/* Lớp đường viền màu đỏ đồng nhất */}
          <path
            d={curveTopLinePathData}
            fill="none"
            stroke={strokeColorForCurve} // Sử dụng màu đỏ đồng nhất cho stroke
            strokeWidth={strokeWidth}
          />
        </svg>
      </div>
    </div>
  );
}

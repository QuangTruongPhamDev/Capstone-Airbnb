import React from "react";

export default function LocationHeroBanner({
  locationName,
  backgroundImageUrl,
}) {
  const defaultBgImage = "/images/banners/default-location-page-banner.jpg";
  return (
    <div
      className="relative w-full h-[35vh] sm:h-[40vh] md:h-[45vh] bg-cover bg-center group" // Điều chỉnh chiều cao nếu cần
      style={{
        backgroundImage: `url(${backgroundImageUrl || defaultBgImage})`,
      }}
      aria-label={`Banner cho ${locationName || "khu vực"}`}
    >
      <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-50 transition-opacity duration-300"></div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-shadow-lg">
          {locationName || "Khám Phá Điểm Đến"}
        </h1>
      </div>
    </div>
  );
}

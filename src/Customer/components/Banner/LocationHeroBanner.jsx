import React from "react";

export default function LocationHeroBanner({
  locationName,
  backgroundImageUrl,
}) {
  const defaultBgImage = "/images/banners/default-location-page-banner.jpg";
  return (
    <div
      className="relative w-full h-[35vh] sm:h-[40vh] md:h-[45vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImageUrl || defaultBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        imageRendering: "auto",
      }}
      aria-label={`Banner cho ${locationName || "khu vực"}`}
    >
      {/* Lớp phủ đen mờ */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30"></div>

      {/* Nội dung */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-xl text-center px-4">
          {locationName || "Khám Phá Điểm Đến"}
        </h1>
      </div>
    </div>
  );
}

import { HeartFilled, HeartOutlined, StarFilled } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

// Component ImageSlider
// Component ImageSlider (giữ nguyên như phiên bản bạn đã có hoặc phiên bản tôi cung cấp trước đó)
const ImageSlider = ({
  images,
  altText = "Hình ảnh phòng",
  isFavorite,
  onToggleFavorite,
  roomId,
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // Lọc bỏ các URL ảnh không hợp lệ (null, undefined, chuỗi rỗng)
  const validImages = Array.isArray(images)
    ? images.filter((img) => typeof img === "string" && img.trim() !== "")
    : [];
  const displayImages =
    validImages.length > 0 ? validImages : ["/images/placeholder-room.png"]; // THAY THẾ ảnh placeholder

  const goToPrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? displayImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isLastSlide = currentIndex === displayImages.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(roomId);
  };

  return (
    <div className="relative w-full h-48 sm:h-56 group">
      <img
        src={displayImages[currentIndex]}
        alt={`${altText} ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded-t-xl" // Đổi bo góc cho phù hợp với card
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/image-error-placeholder.png";
        }} // THAY THẾ ảnh lỗi
      />
      {displayImages.length > 1 && (
        <>
          <button
            aria-label="Ảnh trước"
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1.5 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            aria-label="Ảnh kế tiếp"
            onClick={goToNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-1.5 text-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 z-10 p-1 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
      >
        {isFavorite ? (
          <HeartFilled className="text-red-500 text-lg sm:text-xl" />
        ) : (
          <HeartOutlined className="text-lg sm:text-xl hover:text-red-300" />
        )}
      </button>
    </div>
  );
};

export default function RoomCard({ room, isFavorite, onToggleFavorite }) {
  if (!room || !room.id) {
    console.warn("RoomCard: Dữ liệu phòng không hợp lệ hoặc thiếu ID.", room);
    return null;
  }

  const imagesArray = room.hinhAnh ? [room.hinhAnh] : [];
  const commonNonAmenityKeys = [
    "id",
    "tenPhong",
    "khach",
    "phongNgu",
    "giuong",
    "phongTam",
    "moTa",
    "giaTien",
    "maViTri",
    "hinhAnh",
  ];
  const amenities = Object.entries(room)
    .filter(
      ([key, value]) => value === true && !commonNonAmenityKeys.includes(key)
    )
    .map(([key]) => {
      let label = key.replace(/([A-Z])/g, " $1");
      label = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
      if (label.toLowerCase() === "tivi") return "TV";
      if (label.toLowerCase() === "dieu hoa") return "Điều hòa";
      if (label.toLowerCase() === "may giat") return "Máy giặt";
      if (label.toLowerCase() === "ban la" || label.toLowerCase() === "ban ui")
        return "Bàn là";
      return label;
    })
    .slice(0, 3);

  return (
    <Link
      to={`/room-detail/${room.id}`}
      className="block group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded-xl"
      aria-label={`Xem chi tiết ${room.tenPhong || "phòng"}`}
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
        <ImageSlider
          images={imagesArray}
          altText={room.tenPhong}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          roomId={room.id}
        />
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Bạn có thể thêm phần đánh giá (StarFilled) ở đây nếu API có dữ liệu */}
          <h3
            className="text-sm sm:text-base font-semibold text-gray-800 group-hover:text-red-500 transition-colors truncate mt-1"
            title={room.tenPhong}
          >
            {room.tenPhong || "Phòng cho thuê"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">
            {room.khach || "N/A"} khách · {room.phongNgu || "N/A"} P.ngủ ·{" "}
            {room.giuong || "N/A"} giường · {room.phongTam || "N/A"} P.tắm
          </p>
          {amenities.length > 0 && (
            <p className="text-xs text-gray-500 mt-1.5 truncate">
              {amenities.join(" \u00B7 ")}
            </p>
          )}
          <div className="mt-auto pt-2">
            <p className="text-sm sm:text-base font-bold text-gray-900">
              {typeof room.giaTien === "number"
                ? `${room.giaTien.toLocaleString()} VNĐ`
                : room.giaTien || "Liên hệ giá"}
              <span className="text-xs font-normal text-gray-600"> / đêm</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

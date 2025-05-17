import React from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../../utils/slugify";
import { accommodationTypesData } from "../../../data/accommodationTypesData";

export default function AccommodationTypes() {
  const navigate = useNavigate();

  const handleTypeClick = (type) => {
    if (
      type.targetLocation &&
      type.targetLocation.id &&
      type.targetLocation.tenViTri
    ) {
      const locationId = type.targetLocation.id;
      const locationSlug = slugify(
        type.targetLocation.tenViTri || `vi-tri-${locationId}`
      );

      // Tạo query string, chỉ cần 'id' vì các thông tin khác (ngày, khách) chưa được chọn ở bước này
      const queryParams = new URLSearchParams({
        id: locationId,
      }).toString();

      navigate(`/rooms/${locationSlug}?${queryParams}`);
    } else {
      console.warn("Thông tin targetLocation không đầy đủ cho:", type.name);
      // Hoặc bạn có thể điều hướng đến một trang tìm kiếm chung với type.name làm từ khóa
      // navigate(`/search?query=${encodeURIComponent(type.name)}`);
    }
  };

  if (!accommodationTypesData || accommodationTypesData.length === 0) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        Ở bất cứ đâu
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {accommodationTypesData.map((type) => (
          <div
            key={type.typeId} // Sử dụng typeId nếu nó là duy nhất cho loại hình
            className="cursor-pointer group overflow-hidden rounded-xl transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl animate__animated animate__flipInY animate__delay-0.5s"
            onClick={() => handleTypeClick(type)} // Truyền cả object 'type'
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleTypeClick(type);
              }
            }}
          >
            <div className="w-full aspect-w-4 aspect-h-3 sm:aspect-w-1 sm:aspect-h-1 md:aspect-w-4 md:aspect-h-3">
              <img
                src={type.image || "/images/default-placeholder.jpg"}
                alt={type.name}
                className="w-full h-full object-cover rounded-t-xl group-hover:opacity-90 transition-opacity duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default-placeholder.jpg";
                }}
              />
            </div>
            <div className="p-4 bg-white rounded-b-xl">
              <h3 className="text-md sm:text-lg font-semibold text-gray-800 group-hover:text-red-500 transition-colors duration-300">
                {type.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { locationService } from "../../api/locationService";
import { slugify } from "../../../utils/slugify";

export default function NearByLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    locationService
      .getNearbyOrFeaturedLocations(1, 8)
      .then((res) => {
        // console.log("NearByLocations - API Response Data (res.data):", res.data);

        // Cập nhật cách lấy dữ liệu dựa trên cấu trúc response mới
        const contentObject = res.data?.content;
        const fetchedLocations = contentObject?.data || [];

        // console.log("NearByLocations - Processed fetchedLocations:", fetchedLocations);

        setLocations(Array.isArray(fetchedLocations) ? fetchedLocations : []);
        if (!Array.isArray(fetchedLocations) && contentObject) {
          // Kiểm tra thêm contentObject tồn tại
          console.warn(
            "NearByLocations: API did not return an array in 'content.data'. Received:",
            fetchedLocations
          );
        } else if (!contentObject) {
          console.warn(
            "NearByLocations: API response did not have a 'content' object. Received res.data:",
            res.data
          );
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải địa điểm gần đây:", err);
        setError(
          "Không thể tải được danh sách địa điểm. Vui lòng thử lại sau."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLocationClick = (location) => {
    // Nhận cả object location
    if (!location || !location.id || !location.tenViTri) {
      console.warn(
        "NearByLocations: Thông tin vị trí không đầy đủ, không thể điều hướng.",
        location
      );
      return;
    }

    const locationId = location.id;
    const locationName = location.tenViTri;
    const locationSlug = slugify(locationName || `vi-tri-${locationId}`);

    const queryParams = new URLSearchParams({
      id: locationId,
    }).toString();

    navigate(`/rooms/${locationSlug}?${queryParams}`);
  };

  const getTravelTime = (location, index) => {
    const times = [
      "15 phút lái xe",
      "3 giờ lái xe",
      "6.5 giờ lái xe",
      "45 phút lái xe",
      "30 phút lái xe",
      "5 giờ lái xe",
      "2 giờ lái xe",
      "1.5 giờ lái xe",
    ];
    return times[index % times.length];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p className="text-gray-500 animate-pulse">Đang tải các điểm đến...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <p className="text-gray-500">Hiện chưa có địa điểm nào gần đây.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        Khám phá những điểm đến gần đây
      </h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5 md:gap-x-6 md:gap-y-6">
        {locations.map((location, index) => (
          <div
            key={location.id}
            className="bg-white rounded-xl border border-gray-200 flex items-center p-3 sm:p-4 space-x-3 sm:space-x-4 hover:shadow-md cursor-pointer transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
            onClick={() => handleLocationClick(location)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleLocationClick(location.id);
              }
            }}
          >
            {/* Kích thước ảnh nhỏ hơn, ví dụ w-12 h-12 hoặc w-14 h-14 */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              <img
                src={location.hinhAnh || "/images/default-location.png"}
                alt={location.tenViTri || "Địa điểm"}
                className="w-full h-full object-cover rounded-lg shadow-sm" // Giữ bo góc cho ảnh
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default-location.png";
                }}
              />
            </div>
            <div className="overflow-hidden flex-grow">
              {" "}
              {/* Thêm flex-grow để text chiếm không gian còn lại */}
              <h3
                className="text-sm font-semibold text-gray-900 truncate"
                title={location.tenViTri}
              >
                {location.tenViTri || "Chưa có tên"}
              </h3>
              {/* Hiển thị tỉnh thành và/hoặc thời gian lái xe */}
              {location.tinhThanh && (
                <p
                  className="text-xs text-gray-500 truncate"
                  title={location.tinhThanh}
                >
                  {location.tinhThanh}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {getTravelTime(location, index)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

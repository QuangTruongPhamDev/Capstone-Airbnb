import React, { useEffect, useRef, useState } from "react";
import { locationService } from "../../api/locationService";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";

export default function LocationSelectionPanel({
  onLocationSelect,
  onClosePanel,
  isVisible,
}) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null); // Ref cho panel để xử lý click outside nếu cần (MainSearchForm đã xử lý)

  const fetchData = (searchTerm = "") => {
    setLoading(true);
    locationService
      .getLocationsByKeyword(searchTerm)
      .then((res) => {
        const data = res.data?.content || res.data || [];
        setResults(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách vị trí:", err);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isVisible) {
      // Fetch dữ liệu khi panel được hiển thị, dựa trên internalSearchTerm hiện tại
      // Nếu internalSearchTerm rỗng, nó sẽ fetch danh sách nổi bật/ban đầu
      fetchData(internalSearchTerm);
    }
  }, [isVisible]); // Re-fetch khi panel được mở (nếu logic này cần thiết)

  useEffect(() => {
    if (!isVisible) return; // Chỉ xử lý khi panel hiển thị

    // Debounce cho việc search khi người dùng gõ trong panel
    const timerId = setTimeout(() => {
      fetchData(internalSearchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [internalSearchTerm, isVisible]); // Re-fetch khi search term thay đổi và panel đang mở

  const handleLocationClick = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    if (onClosePanel) {
      onClosePanel();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className="absolute z-50 mt-2 top-full left-0 md:left-auto md:right-auto bg-white border border-gray-200 rounded-xl shadow-xl p-4 md:p-6 overflow-y-auto max-h-[80vh]"
      style={{
        width: "max(380px, 100%)", // Chiều rộng panel, bạn có thể điều chỉnh
        minWidth: "320px", // Đảm bảo không quá hẹp trên mobile bên trong form
        // Ví dụ căn panel theo bên trái của khu vực địa điểm trong form
        // Nếu form không phải full width, bạn cần tính toán vị trí kỹ hơn
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Tìm kiếm địa điểm
      </h3>
      <Input
        type="text"
        value={internalSearchTerm}
        onChange={(e) => setInternalSearchTerm(e.target.value)}
        placeholder="Nhập tên thành phố, địa điểm..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-md"
        prefix={
          <SearchOutlined className="site-form-item-icon opacity-50 mr-2" />
        }
        allowClear
        onClear={() => setInternalSearchTerm("")}
      />

      {loading && results.length === 0 && (
        <p className="text-sm text-gray-500 p-2 text-center">Đang tải...</p>
      )}

      {!loading && results.length === 0 && internalSearchTerm.trim() !== "" && (
        <div className="p-3 text-sm text-gray-500 text-center">
          Không tìm thấy kết quả nào cho "{internalSearchTerm}".
        </div>
      )}
      {!loading && results.length === 0 && internalSearchTerm.trim() === "" && (
        <div className="p-3 text-sm text-gray-500 text-center">
          Không có địa điểm nổi bật nào hoặc hãy thử tìm kiếm.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {" "}
          {/* Điều chỉnh số cột */}
          {results.map((location) => (
            <div
              key={location.id}
              onClick={() => handleLocationClick(location)}
              className="cursor-pointer group rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            >
              <img
                src={location.hinhAnh || "/images/default-location.png"} // THAY THẾ ảnh mặc định
                alt={location.tenViTri}
                className="w-full h-24 sm:h-28 object-cover group-hover:scale-105 transition-transform duration-200 rounded-t-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default-location.png";
                }}
              />
              <p className="p-2 text-xs sm:text-sm font-medium text-center text-gray-700 group-hover:text-red-500 truncate">
                {location.tenViTri}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

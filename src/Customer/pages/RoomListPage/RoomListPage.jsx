import { Alert, Empty, Pagination, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import RoomCard from "./RoomCard";
import dayjs from "dayjs";
import { locationService } from "../../api/locationService";
import MapDisplayLeaflet from "../../components/Map/MapDisplayLeaflet";
import MainSearchForm from "../../components/MainSearchForm/MainSearchForm";
import FilterButtons from "../../components/FilterButtons/FilterButtons";
import LocationHeroBanner from "../../components/Banner/LocationHeroBanner";

const unslugify = (slug) => {
  if (!slug) return "Địa điểm không xác định";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function RoomListPage() {
  const { locationSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // locationInfo chỉ cần: id, tenViTri, tinhThanh, quocGia
  const [locationInfo, setLocationInfo] = useState(null);
  const [roomsData, setRoomsData] = useState({
    list: [],
    total: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true); // Loading chung
  const [error, setError] = useState(null);

  const [favoriteRoomIds, setFavoriteRoomIds] = useState(() => {
    try {
      const saved = localStorage.getItem("favoriteRooms");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Lỗi đọc localStorage (favorites):", e);
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("favoriteRooms", JSON.stringify(favoriteRoomIds));
    } catch (e) {
      console.error("Lỗi lưu localStorage (favorites):", e);
    }
  }, [favoriteRoomIds]);
  const handleToggleFavorite = (roomId) =>
    setFavoriteRoomIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );

  const locationId = useMemo(() => searchParams.get("id"), [searchParams]);
  const checkIn = useMemo(() => searchParams.get("checkIn"), [searchParams]);
  const checkOut = useMemo(() => searchParams.get("checkOut"), [searchParams]);
  const guests = useMemo(() => searchParams.get("guests"), [searchParams]);
  const currentPageFromUrl = useMemo(
    () => parseInt(searchParams.get("page") || "1", 10),
    [searchParams]
  );
  const pageSize = 12;

  useEffect(() => {
    let isMounted = true;
    if (!locationId) {
      if (isMounted) {
        setError("Không có ID vị trí trong URL.");
        setLoading(false);
        if (locationSlug)
          setLocationInfo({ tenViTri: unslugify(locationSlug) });
      }
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      locationService.getLocationDetails(locationId),
      locationService.getRoomsByLocationId(locationId, {
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests: guests || undefined,
        pageIndex: currentPageFromUrl,
        pageSize: pageSize,
      }),
    ])
      .then(([resLocationDetails, resRooms]) => {
        if (!isMounted) return;

        const locData =
          resLocationDetails.data?.content || resLocationDetails.data;
        if (locData && locData.tenViTri) {
          setLocationInfo(locData);
        } else {
          setLocationInfo({
            tenViTri: locationSlug
              ? unslugify(locationSlug)
              : "Vị trí không rõ",
          });
        }

        const roomsApiResponse = resRooms.data;
        // **QUAN TRỌNG**: Điều chỉnh logic này cho khớp với cấu trúc API phòng của bạn
        if (
          roomsApiResponse?.content &&
          Array.isArray(roomsApiResponse.content.data)
        ) {
          // Ví dụ: { content: { data: [], totalRow, pageIndex } }
          setRoomsData({
            list: roomsApiResponse.content.data,
            total: roomsApiResponse.content.totalRow || 0,
            currentPage:
              roomsApiResponse.content.pageIndex || currentPageFromUrl,
          });
        } else if (Array.isArray(roomsApiResponse?.content)) {
          // Ví dụ: { content: [] }
          setRoomsData({
            list: roomsApiResponse.content,
            total: roomsApiResponse.content.length,
            currentPage: currentPageFromUrl,
          });
        } else if (Array.isArray(roomsApiResponse)) {
          // Ví dụ: API trả về mảng trực tiếp
          setRoomsData({
            list: roomsApiResponse,
            total: roomsApiResponse.length,
            currentPage: 1,
          });
        } else {
          setRoomsData({ list: [], total: 0, currentPage: 1 });
          console.warn(
            "[RoomListPage] API phòng không trả về dữ liệu mảng như mong đợi:",
            roomsApiResponse
          );
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Lỗi khi tải dữ liệu trang phòng:", err);
        setError(err.message || "Lỗi tải dữ liệu.");
        setRoomsData({ list: [], total: 0, currentPage: 1 });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [
    locationId,
    locationSlug,
    checkIn,
    checkOut,
    guests,
    currentPageFromUrl,
    searchParams,
  ]); // Thêm isApiKeyEffectivelySet

  const handlePageChange = (page, newPageSize) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("page", page.toString());
    // Nếu bạn cho phép thay đổi pageSize từ Pagination component
    // if (newPageSize && newPageSize !== pageSize) {
    //   currentParams.set('pageSize', newPageSize.toString());
    // }
    setSearchParams(currentParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageTitle = locationInfo?.tenViTri || "Địa điểm";

  // ----- RENDER -----
  if (loading && roomsData.list.length === 0 && !error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-lg flex flex-col justify-center items-center min-h-[calc(100vh-160px)]">
        <Spin tip="Đang tìm kiếm chỗ ở cho bạn..." size="large" />
        <p className="mt-4 text-gray-500 text-sm">
          Vui lòng chờ trong giây lát...
        </p>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-160px)] flex flex-col justify-center items-center">
        <Alert
          message="Lỗi Tải Dữ Liệu"
          description={error}
          type="error"
          showIcon
          className="text-left mb-4 max-w-md"
        />
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Quay về Trang chủ
        </Link>
      </div>
    );
  }
  return (
    <div>
      {/* Banner ở đầu trang */}
      {locationInfo && ( // Chỉ hiển thị banner nếu có locationInfo
        <LocationHeroBanner
          locationName={locationInfo.tenViTri}
          // API của bạn cần trả về trường 'hinhAnh' hoặc tên tương tự cho ảnh banner của vị trí
          backgroundImageUrl={
            locationInfo.hinhAnh ||
            "/images/banners/default-location-page-banner.jpg"
          }
        />
      )}

      {/* Thanh tìm kiếm phụ và các bộ lọc có thể đặt ở đây, bên trong một container */}
      <div className="container mx-auto px-4 -mt-8 sm:-mt-10 md:-mt-12 relative z-10">
        <MainSearchForm />
        <div className="mt-4">
          {" "}
          <FilterButtons />{" "}
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="mb-6 pt-20 md:pt-24">
          <p className="text-sm text-gray-600">
            {roomsData.total > 0
              ? `Tìm thấy ${roomsData.total} chỗ ở`
              : loading
              ? ""
              : "0 chỗ ở"}
            {checkIn && checkOut
              ? ` • ${dayjs(checkIn).format("DD/MM")} – ${dayjs(
                  checkOut
                ).format("DD/MM")}`
              : ""}
            {guests ? ` • ${guests} khách` : ""}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
            Chỗ ở tại khu vực {pageTitle}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
          <div className="w-full lg:w-7/12 xl:w-2/3 order-2 lg:order-1">
            {loading && roomsData.list.length > 0 && (
              <div className="text-center py-10">
                <Spin tip="Đang tải thêm..." />
              </div>
            )}
            {!loading && roomsData.list.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8">
                  {roomsData.list.map((room) => (
                    <RoomCard
                      key={room.id || room.maPhong}
                      room={room}
                      isFavorite={favoriteRoomIds.includes(
                        room.id || room.maPhong
                      )}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
                {roomsData.total > pageSize && (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      current={roomsData.currentPage}
                      total={roomsData.total}
                      pageSize={pageSize}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showLessItems
                    />
                  </div>
                )}
              </>
            ) : (
              !loading && (
                <div className="py-20 text-center">
                  <Empty
                    description="Không tìm thấy chỗ ở nào phù hợp với các tiêu chí của bạn."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              )
            )}
          </div>

          <div className="w-full lg:w-5/12 xl:w-1/3 h-[50vh] md:h-[60vh] lg:h-[calc(100vh-120px)] lg:sticky lg:top-[90px] rounded-xl overflow-hidden shadow-sm order-1 lg:order-2 bg-gray-200">
            {/* Truyền locationInfo vào MapDisplayLeaflet */}
            <MapDisplayLeaflet locationInfo={locationInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

// Component để cập nhật view bản đồ khi center hoặc zoom thay đổi
const MapViewUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (
      center &&
      center.length === 2 &&
      !isNaN(center[0]) &&
      !isNaN(center[1])
    ) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const FALLBACK_CENTER = [16.047079, 108.220825]; // Ví dụ: Đà Nẵng
const FALLBACK_ZOOM = 16;
const FALLBACK_LOCATION_NAME = "Khu vực mặc định";

export default function MapDisplayLeaflet({ locationInfo }) {
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(FALLBACK_ZOOM);
  const [markerPosition, setMarkerPosition] = useState(null);
  // KHAI BÁO STATE CHO locationNameForMarker
  const [locationNameForMarker, setLocationNameForMarker] = useState(
    FALLBACK_LOCATION_NAME
  );
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setMapError(null);

    if (locationInfo && locationInfo.tenViTri) {
      setIsLoadingMap(true);
      // Ưu tiên tên từ locationInfo để hiển thị ngay cả khi geocoding đang chạy
      if (isMounted) setLocationNameForMarker(locationInfo.tenViTri);

      const addressString = `${locationInfo.tenViTri}${
        locationInfo.tinhThanh ? `, ${locationInfo.tinhThanh}` : ""
      }${
        locationInfo.quocGia && locationInfo.quocGia !== locationInfo.tinhThanh
          ? `, ${locationInfo.quocGia}`
          : ", Việt Nam"
      }`;

      console.log("[MapDisplayLeaflet] Geocoding address:", addressString);

      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          addressString
        )}&format=json&limit=1&countrycodes=VN&accept-language=vi`
      )
        .then((response) => {
          if (!response.ok)
            throw new Error(`Nominatim API lỗi: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if (!isMounted) return;
          if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setMapCenter([lat, lon]);
            setMarkerPosition([lat, lon]);
            // Cập nhật lại locationNameForMarker từ kết quả geocoding nếu cần (thường là giống)
            // setLocationNameForMarker(data[0].display_name); // Hoặc giữ nguyên từ locationInfo.tenViTri
            setMapZoom(16);
          } else {
            console.warn(
              "[MapDisplayLeaflet] Geocoding không tìm thấy kết quả cho:",
              addressString,
              ". Sử dụng fallback center."
            );
            setMapCenter(FALLBACK_CENTER);
            setMarkerPosition(FALLBACK_CENTER);
            setLocationNameForMarker(
              locationInfo.tenViTri || FALLBACK_LOCATION_NAME
            ); // Vẫn dùng tên từ locationInfo nếu có
            setMapZoom(FALLBACK_ZOOM);
            setGeocodingError(true);
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          console.error(
            "[MapDisplayLeaflet] Lỗi Geocoding với Nominatim:",
            error
          );
          setMapCenter(FALLBACK_CENTER);
          setMarkerPosition(null);
          setLocationNameForMarker(
            locationInfo.tenViTri || FALLBACK_LOCATION_NAME
          );
          setMapZoom(FALLBACK_ZOOM);
          setMapError("Không thể tải dữ liệu vị trí bản đồ.");
        })
        .finally(() => {
          if (isMounted) setIsLoadingMap(false);
        });
    } else {
      console.log(
        "[MapDisplayLeaflet] Không có locationInfo, dùng fallback center."
      );
      setMapCenter(FALLBACK_CENTER);
      setMapZoom(FALLBACK_ZOOM);
      setMarkerPosition(null); // Không có marker nếu không có thông tin vị trí cụ thể
      setLocationNameForMarker(FALLBACK_LOCATION_NAME);
      setIsLoadingMap(false);
    }
    return () => {
      isMounted = false;
    };
  }, [locationInfo]);

  if (isLoadingMap || !mapCenter) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 p-4 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3 opacity-40 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <p className="font-semibold">Đang tải bản đồ...</p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 p-4 text-center">
        <p className="font-semibold">Không thể hiển thị bản đồ</p>
        <p className="text-xs mt-1">{mapError}</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      className="w-full h-full rounded-xl"
      key={mapCenter.join(",")}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* SỬ DỤNG locationNameForMarker ĐÃ ĐƯỢC KHAI BÁO VÀ SET GIÁ TRỊ */}
      {markerPosition && locationNameForMarker && (
        <Marker position={markerPosition}>
          <Popup>{locationNameForMarker}</Popup>
        </Marker>
      )}

      {/* MapViewUpdater không còn thực sự cần thiết nếu MapContainer có key thay đổi */}
      {/* <MapViewUpdater center={mapCenter} zoom={mapZoom} /> */}
    </MapContainer>
  );
}

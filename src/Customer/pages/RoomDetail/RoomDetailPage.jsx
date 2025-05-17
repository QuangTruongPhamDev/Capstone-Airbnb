import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { roomService } from "../../api/roomService";
import { Alert, Spin } from "antd";
import {
  AirVentIcon,
  CoffeeIcon,
  CookingPotIcon,
  HammerIcon,
  Heart,
  Heater,
  HeaterIcon,
  ParkingCircleIcon,
  Share2,
  ShieldCheck,
  Star,
  TruckIcon,
  TvIcon,
  WashingMachine,
  WavesLadderIcon,
} from "lucide-react";
import BookingBox from "./BookingBox";
import { commentService } from "../../api/commentService";
import ReviewSection from "./ReviewSection";
import { Wifi, Tv, Coffee, Droplet, Truck } from "lucide-react";

const getAmenityLabel = (key) => {
  const labels = {
    mayGiat: "Máy giặt",
    banLa: "Bàn là",
    tivi: "TV",
    dieuHoa: "Điều hòa",
    wifi: "Wi-Fi",
    bep: "Bếp",
    doXe: "Chỗ đỗ xe",
    hoBoi: "Hồ bơi",
    banUi: "Bàn ủi",
  };
  return labels[key] || key;
};

const getAmenityIcon = (key) => {
  switch (key) {
    case "wifi":
      return <Wifi className="w-6 h-6 text-gray-600" />;
    case "tivi":
      return <TvIcon className="w-6 h-6 text-gray-600" />;
    case "bep":
      return <CookingPotIcon className="w-6 h-6 text-gray-600" />;
    case "mayGiat": // chú ý: key chuyển thành lowercase
      return <WashingMachine className="w-6 h-6 text-gray-600" />;
    case "doXe":
      return <ParkingCircleIcon className="w-6 h-6 text-gray-600" />;
    case "hoBoi":
      return <WavesLadderIcon className="w-6 h-6 text-gray-600" />;
    case "banLa":
      return <HammerIcon className="w-6 h-6 text-gray-600" />;
    case "banUi":
      return <HeaterIcon className="w-6 h-6 text-gray-600" />;
    case "dieuHoa":
      return <AirVentIcon className="w-6 h-6 text-gray-600" />;
    default:
      return null;
  }
};
export default function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [commentsData, setCommentsData] = useState({ list: [], total: 0 });
  const [hostInfo, setHostInfo] = useState({
    name: "Chủ nhà",
    avatarUrl: "/images/default-avatar.png",
    isSuperhost: false,
  });
  const [reviewSummary, setReviewSummary] = useState({ score: 0, count: 0 });

  useEffect(() => {
    let isMounted = true;
    if (!roomId) {
      if (isMounted) {
        setError("Không tìm thấy ID phòng.");
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([
      roomService.getRoomDetails(roomId),
      commentService.getCommentsByRoomId(roomId),
    ])
      .then(([resRoomDetails, resComments]) => {
        if (!isMounted) return;

        if (resRoomDetails.data && resRoomDetails.data.content) {
          const details = resRoomDetails.data.content;
          setRoomDetails(details);

          // Gán đánh giá tổng thể nếu API trả về
          if (details.danhGia && typeof details.danhGia.score === "number") {
            setReviewSummary({
              score: details.danhGia.score,
              count: details.danhGia.count || 0,
            });
          }

          // Nếu có thông tin host trong chi tiết phòng
          if (details.chuNha) {
            setHostInfo(details.chuNha);
          }
        } else {
          setError("Không tìm thấy thông tin chi tiết cho phòng này.");
        }

        if (resComments.data && resComments.data.content) {
          const content = resComments.data.content;
          const commentList = Array.isArray(content.data)
            ? content.data
            : Array.isArray(content)
            ? content
            : [];
          const totalComments = content.totalRow || commentList.length || 0;

          // ✅ Tính trung bình sao
          const avgScore =
            commentList.length > 0
              ? commentList.reduce((sum, c) => sum + (c.saoBinhLuan || 0), 0) /
                commentList.length
              : 0;

          setCommentsData({ list: commentList, total: totalComments });

          // ✅ Nếu không có score từ chi tiết phòng thì dùng cái này
          setReviewSummary((prev) => ({
            score: prev.score || avgScore,
            count: totalComments,
          }));
        } else {
          setCommentsData({ list: [], total: 0 });
          setReviewSummary((prev) => ({ ...prev, count: 0 }));
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Lỗi khi tải dữ liệu chi tiết phòng:", err);
        setError(
          err.response?.data?.message || err.message || "Lỗi tải dữ liệu."
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [roomId]);

  if (loading)
    return (
      <div className="container mx-auto min-h-screen flex justify-center items-center pt-20">
        <Spin tip="Đang tải..." size="large" />
      </div>
    );

  if (error)
    return (
      <div className="container mx-auto min-h-screen flex flex-col justify-center items-center pt-20 px-4">
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="max-w-md text-left"
        />
        <Link
          to="/"
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Về Trang Chủ
        </Link>
      </div>
    );

  if (!roomDetails)
    return (
      <div className="container mx-auto min-h-screen flex justify-center items-center pt-20">
        <p className="text-xl text-gray-600">Không có thông tin phòng.</p>
      </div>
    );

  const amenityKeys = [
    "mayGiat",
    "banLa",
    "tivi",
    "dieuHoa",
    "wifi",
    "bep",
    "doXe",
    "hoBoi",
    "banUi",
  ];

  const enabledAmenities = amenityKeys.filter((key) => roomDetails[key]);

  return (
    <div className="w-full pt-20">
      {/* Ảnh phòng - trên cùng toàn trang */}
      <section className="w-full mb-8">
        {roomDetails.hinhAnh ? (
          <img
            src={roomDetails.hinhAnh}
            alt={`Ảnh của ${roomDetails.tenPhong}`}
            className="w-full h-[60vh] object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/image-error-placeholder.png";
            }}
          />
        ) : (
          <div className="w-full h-[40vh] bg-gray-200 flex items-center justify-center text-gray-500">
            Không có hình ảnh.
          </div>
        )}
      </section>

      {/* Container nội dung */}
      <div className="px-4 sm:px-6 lg:px-20 xl:px-32 py-8">
        {/* Tên phòng và thông tin cơ bản */}
        <section className="mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
            {roomDetails.tenPhong}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-2 mb-4">
            {reviewSummary.count > 0 && (
              <>
                <Star className="text-red-500 w-4 h-4 fill-current" />
                <span className="font-semibold text-gray-800">
                  {reviewSummary.score.toFixed(1)}
                </span>
                <span className="hover:underline cursor-pointer">
                  ({reviewSummary.count} đánh giá)
                </span>
                <span>·</span>
              </>
            )}

            <span className="font-medium text-gray-700 hover:underline cursor-pointer">
              Khu vực ID: {roomDetails.maViTri}
            </span>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex space-x-3">
              <button className="flex items-center text-sm hover:bg-gray-100 p-2 rounded-lg">
                <Share2 className="w-4 h-4 mr-1.5" /> Chia sẻ
              </button>
              <button className="flex items-center text-sm hover:bg-gray-100 p-2 rounded-lg">
                <Heart className="w-4 h-4 mr-1.5" /> Lưu
              </button>
            </div>
          </div>
        </section>

        {/* Mô tả và BookingBox */}
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 mt-8">
          <div className="w-full lg:w-[58%]">
            {/* Host Section */}
            <section className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Toàn bộ căn hộ. Chủ nhà{" "}
                  <span className="underline">THANH NAM</span>
                </h2>
                <div className="relative">
                  <img
                    src={hostInfo.avatarUrl || "/images/default-avatar.png"}
                    alt="Chủ nhà"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-avatar.png";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <p className="text-base text-gray-800">
                {`${roomDetails.khach} Khách • ${
                  roomDetails.phongNgu > 0
                    ? `${roomDetails.phongNgu} Phòng ngủ`
                    : "Phòng Studio"
                } • ${roomDetails.giuong} giường • ${
                  roomDetails.phongTam
                } Phòng tắm`}
              </p>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-home"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Toàn bộ nhà</h3>
                    <p className="text-gray-600 text-sm">
                      Bạn sẽ có chung cư cao cấp cho riêng mình.
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-refresh-cw"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M3 21v-5h5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Vệ sinh tăng cường
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Chủ nhà này đã cam kết thực hiện quy trình vệ sinh tăng
                      cường 5 bước của Airbnb.{" "}
                      <span className="underline font-medium">
                        Hiển thị thêm
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-medal"
                    >
                      <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"></path>
                      <path d="M11 12 5.12 2.2"></path>
                      <path d="m13 12 5.88-9.8"></path>
                      <path d="M12 8V2"></path>
                      <circle cx="12" cy="17" r="5"></circle>
                      <path d="M12 18v-2h-.5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Phong là Chủ nhà siêu cấp
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Chủ nhà siêu cấp là những chủ nhà có kinh nghiệm, được
                      đánh giá cao và là những người cam kết mang lại quãng thời
                      gian ở tuyệt vời với cho khách.
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar-clock"
                    >
                      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.5"></path>
                      <path d="M16 2v4"></path>
                      <path d="M8 2v4"></path>
                      <path d="M3 10h18"></path>
                      <circle cx="17" cy="16" r="3"></circle>
                      <path d="M17 14.5v1.5h1.5"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      Miễn phí hủy trong 48 giờ
                    </h3>
                  </div>
                </div>
              </div>
            </section>
            <p className="text-base text-gray-700 whitespace-pre-line mb-6">
              {roomDetails.moTa}
            </p>

            <hr className="my-6 border-gray-300" />

            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tiện ích đi kèm
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {enabledAmenities.map((key) => (
                <div
                  key={key}
                  className="flex items-center space-x-2 text-gray-800"
                >
                  {getAmenityIcon(key)}
                  <span>{getAmenityLabel(key)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[42%]">
            <div className="lg:sticky lg:top-28 self-start">
              <BookingBox
                roomId={roomDetails.id}
                pricePerNight={roomDetails.giaTien}
                reviewInfo={reviewSummary}
              />
            </div>
          </div>
        </div>

        {/* Bình luận */}
        <ReviewSection
          comments={commentsData.list}
          reviewInfo={reviewSummary}
          roomId={roomId}
        />
      </div>
    </div>
  );
}

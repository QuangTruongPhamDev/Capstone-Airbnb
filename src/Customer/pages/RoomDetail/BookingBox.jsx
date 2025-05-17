import {
  Alert,
  Button,
  DatePicker,
  Divider,
  Form,
  InputNumber,
  Popover,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { roomService } from "../../api/roomService";
import dayjs from "dayjs";
import { StarFilled, UserOutlined } from "@ant-design/icons";
import { ChevronDown } from "lucide-react";
import { bookingService } from "../../api/bookingService";
import "./BookingBox.css"; // Import CSS file for custom styles
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
const { RangePicker } = DatePicker;

export default function BookingBox({
  roomId,
  pricePerNight,
  reviewInfo,
  initialGuests = 1,
}) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const { user: currentUser } = useSelector((state) => state.userSlice);

  const [dates, setDates] = useState(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [guests, setGuests] = useState(initialGuests);
  const [isGuestsPopoverVisible, setIsGuestsPopoverVisible] = useState(false);
  const [bookedDateRanges, setBookedDateRanges] = useState([]);
  const [loadingBookedDates, setLoadingBookedDates] = useState(true);
  const [bookingError, setBookingError] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    let isMounted = true;
    setLoadingBookedDates(true);
    roomService
      .getAllBookings()
      .then((res) => {
        if (!isMounted) return;
        const allBookings = res.data?.content || [];
        // Lọc booking theo phòng hiện tại
        const roomBookings = allBookings.filter(
          (booking) => booking.maPhong === parseInt(roomId)
        );

        const formattedRanges = roomBookings.map((booking) => ({
          start: dayjs(booking.ngayDen),
          end: dayjs(booking.ngayDi).subtract(1, "second"),
        }));

        setBookedDateRanges(formattedRanges);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Lỗi tải ngày đã đặt:", err);
      })
      .finally(() => {
        if (isMounted) setLoadingBookedDates(false);
      });
    return () => {
      isMounted = false;
    };
  }, [roomId]);

  const disabledDate = (current) => {
    if (!current) return false;
    if (current && current < dayjs().startOf("day")) {
      return true;
    }
    for (const range of bookedDateRanges) {
      if (current.isBetween(range.start, range.end, "day", "[]")) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (dates && dates[0] && dates[1]) {
      const nights = dates[1].diff(dates[0], "day");
      setNumberOfNights(nights > 0 ? nights : 0);
    } else {
      setNumberOfNights(0);
    }
  }, [dates]);

  const handleGuestsChange = (value) => setGuests(Math.max(1, value));
  const applyGuestsAndClosePopover = () => {
    form.setFieldsValue({ guestsInput: guests });
    setIsGuestsPopoverVisible(false);
  };

  const guestsPopoverContent = (
    <div className="p-3" style={{ width: "250px" }}>
      <div className="flex justify-between items-center">
        <span className="text-base text-gray-700">Guests</span>
        <div className="flex items-center">
          <Button
            shape="circle"
            icon={<span className="text-lg">-</span>}
            onClick={() => handleGuestsChange(guests - 1)}
            disabled={guests <= 1}
            className="border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
          />
          <span className="mx-3 text-base font-medium text-gray-800 w-8 text-center">
            {guests}
          </span>
          <Button
            shape="circle"
            icon={<span className="text-lg">+</span>}
            onClick={() => handleGuestsChange(guests + 1)}
            className="border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
          />
        </div>
      </div>
      <Button
        type="primary"
        onClick={applyGuestsAndClosePopover}
        className="w-full mt-4 bg-red-500 hover:bg-red-600 border-red-500"
      >
        Done
      </Button>
    </div>
  );

  const handleDateChange = (newDates) => {
    setDates(newDates);
  };

  const handleBooking = async () => {
    if (!currentUser) {
      setBookingError("Đăng nhập để đặt phòng");
      navigate("/dangnhap", { state: { from: `/room-detail/${roomId}` } });
      return;
    }
    if (!dates || !dates[0] || !dates[1] || numberOfNights <= 0) {
      setBookingError("Chọn ngày nhận phòng và trả phòng.");
      form.validateFields(["datesInput"]);
      return;
    }
    if (guests <= 0) {
      setBookingError("Chọn số lượng khách");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    const bookingData = {
      id: 0,
      maPhong: parseInt(roomId),
      ngayDen: dates[0].format("YYYY-MM-DDTHH:mm:ss"),
      ngayDi: dates[1].format("YYYY-MM-DDTHH:mm:ss"),
      soLuongKhach: guests,
      maNguoiDung: currentUser.id,
    };

    try {
      const response = await bookingService.createBooking(bookingData);
      alert("Booking successful!");
      navigate("/profile?refresh=1");
      roomService.getAllBookings().then((res) => {
        const allBookings = res.data?.content || [];
        const filteredBookings = allBookings.filter(
          (b) => b.maPhong === parseInt(roomId)
        );
        const newBookedRanges = filteredBookings.map((b) => ({
          start: dayjs(b.ngayDen),
          end: dayjs(b.ngayDi).subtract(1, "second"),
        }));
        setBookedDateRanges(newBookedRanges);
      });
      setDates(null);
      form.resetFields(["datesInput"]);
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(
        err.response?.data?.message ||
          err.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const totalPrice = pricePerNight * numberOfNights;
  const serviceFee = totalPrice * 0.1;
  const totalWithFees = totalPrice + serviceFee;

  return (
    <div className="border border-gray-300 rounded-xl shadow-xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-gray-900">
            ${pricePerNight?.toLocaleString() || "N/A"}
          </span>
          <span className="text-gray-600 ml-1 text-base">/ đêm</span>
        </div>
        {reviewInfo && reviewInfo.score != null && (
          <div className="flex items-center text-sm">
            <StarFilled className="text-red-500 mr-1" />
            <span className="font-semibold text-gray-800">
              {reviewInfo.score.toFixed(1)}
            </span>
            <span className="text-gray-500 ml-1 hover:underline cursor-pointer">
              ({reviewInfo.count} đánh giá)
            </span>
          </div>
        )}
      </div>

      <Form form={form} layout="vertical">
        <Form.Item name="datesInput" className="mb-0">
          <div className="border rounded-t-lg overflow-hidden">
            <RangePicker
              value={dates}
              onChange={handleDateChange}
              disabledDate={disabledDate}
              format="DD/MM/YYYY"
              className="w-full custom-detail-rangepicker"
              placeholder={["Nhận phòng", "Trả phòng"]}
              suffixIcon={null}
              inputReadOnly
              separator={<span className="px-2 text-gray-400">–</span>}
              open={isDatePickerOpen}
              onOpenChange={(open) => setIsDatePickerOpen(open)}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode.parentNode
              }
            />
          </div>
        </Form.Item>

        <Popover
          content={guestsPopoverContent}
          title={<span className="font-semibold text-gray-800">Guests</span>}
          trigger="click"
          open={isGuestsPopoverVisible}
          onOpenChange={setIsGuestsPopoverVisible}
          placement="bottom"
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <div className="border-x border-b border-gray-300 rounded-b-lg p-3 cursor-pointer flex justify-between items-center hover:border-gray-400">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700">
                Khách
              </label>
              <span className="text-sm text-gray-800">{guests} khách</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform ${
                isGuestsPopoverVisible ? "rotate-180" : ""
              }`}
            />
          </div>
        </Popover>

        <Form.Item name="guests" initialValue={initialGuests} noStyle>
          <InputNumber className="!hidden" />
        </Form.Item>

        <Button
          type="primary"
          danger
          size="large"
          className="w-full mt-6 !bg-red-500 hover:!bg-red-600 !border-red-500 text-base font-semibold"
          onClick={handleBooking}
          loading={bookingLoading || loadingBookedDates}
          disabled={!dates || numberOfNights === 0 || loadingBookedDates}
        >
          {loadingBookedDates
            ? "Đang kiểm tra phòng trống..."
            : numberOfNights > 0
            ? "Đặt phòng"
            : "Chọn ngày"}
        </Button>
      </Form>

      {numberOfNights > 0 && (
        <p className="text-xs text-gray-500 text-center mt-3">
          Bạn vẫn chưa bị trừ tiền
        </p>
      )}
      {bookingError && (
        <Alert message={bookingError} type="error" showIcon className="mt-4" />
      )}

      {numberOfNights > 0 && (
        <div className="mt-6 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>
              ${pricePerNight?.toLocaleString()} x {numberOfNights} đêm
            </span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí dịch vụ</span>
            <span>${serviceFee.toLocaleString()}</span>
          </div>
          <Divider className="!my-3" />
          <div className="flex justify-between font-bold text-base text-gray-900">
            <span>Tổng cộng</span>
            <span>${totalWithFees.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

import { Button, DatePicker, Form, InputNumber, Popover } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DateQuickOptions from "./DateQuickOptions";
import {
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import LocationSelectionPanel from "./LocationSelectionPanel";
import "./MainSearchForm.css"; // Import CSS file for custom styles
import { slugify } from "../../../utils/slugify";

const { RangePicker } = DatePicker;
export default function MainSearchForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [guests, setGuests] = useState(1);
  const [isGuestsPopoverVisible, setIsGuestsPopoverVisible] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false);

  const locationAreaRef = useRef(null);
  const dateAreaRef = useRef(null); // Ref cho khu vực ngày
  const guestAreaRef = useRef(null); // Ref cho khu vực khách
  const rangePickerRef = useRef(null);

  const handleGuestsChange = (value) => setGuests(Math.max(1, value));
  const applyGuestsAndClosePopover = () => {
    form.setFieldsValue({ guests });
    setIsGuestsPopoverVisible(false);
  };

  const guestsPopoverContent = (
    <div className="p-3" style={{ width: "250px" }}>
      <div className="flex justify-between items-center">
        <span className="text-base text-gray-700">Khách</span>
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
        Xong
      </Button>
    </div>
  );

  const onFinish = (values) => {
    const { location_object, dates } = values;

    if (!location_object || !location_object.id) {
      alert("Vui lòng chọn một địa điểm!");
      setIsLocationPanelOpen(true);
      return;
    }
    if (!dates || dates.length < 2) {
      alert("Vui lòng chọn ngày nhận và trả phòng!");
      setIsDatePickerOpen(true);
      return;
    }

    const locationId = location_object.id;
    const locationName = location_object.tenViTri; // Lấy tên vị trí gốc
    const locationSlug = slugify(locationName || `vi-tri-${locationId}`); // Tạo slug, có fallback nếu tên rỗng

    const checkIn = dates[0].format("YYYY-MM-DD");
    const checkOut = dates[1].format("YYYY-MM-DD");
    const finalGuests = form.getFieldValue("guests") || 1;

    console.log("Tìm kiếm:", {
      locationId,
      checkIn,
      checkOut,
      guests: finalGuests,
    });

    // Tạo query string, bao gồm locationId và các thông tin khác
    const queryParams = new URLSearchParams({
      id: locationId, // Quan trọng: truyền ID qua query param
      // Tùy chọn: bạn có thể truyền tên gốc nếu muốn hiển thị chính xác hơn trên trang kết quả mà không cần gọi API chi tiết vị trí
      // name: locationName,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: finalGuests,
    }).toString();

    // Điều hướng đến trang tìm kiếm với query string
    navigate(`/rooms/${locationSlug}?${queryParams}`);
  };

  const handleQuickDateSelect = (range) => {
    form.setFieldsValue({ dates: range });
    if (rangePickerRef.current && rangePickerRef.current.blur) {
      rangePickerRef.current.blur();
    }
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        locationAreaRef.current &&
        !locationAreaRef.current.contains(event.target) &&
        (!dateAreaRef.current || !dateAreaRef.current.contains(event.target)) && // Kiểm tra thêm cho các panel khác
        (!guestAreaRef.current || !guestAreaRef.current.contains(event.target))
      ) {
        setIsLocationPanelOpen(false);
        setIsDatePickerOpen(false);
        setIsGuestsPopoverVisible(false);
      }
    }
    // Chỉ lắng nghe khi có ít nhất một panel/popover đang mở
    if (isLocationPanelOpen || isDatePickerOpen || isGuestsPopoverVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationPanelOpen, isDatePickerOpen, isGuestsPopoverVisible]);

  const searchBarHeight = "h-[68px] sm:h-[72px]";
  const labelFontSize = "text-[10px] sm:text-xs font-bold"; // Điều chỉnh lại font size
  const valueTextFontSize = "text-xs sm:text-sm"; // Cho text đã chọn / placeholder

  const selectedLocationForDisplay = Form.useWatch("location_object", form);
  const selectedDatesForDisplay = Form.useWatch("dates", form);
  const currentGuests = Form.useWatch("guests", form) || guests;

  return (
    <div className="w-full">
      <Form
        form={form}
        onFinish={onFinish}
        className={`flex items-stretch bg-white rounded-full shadow-lg border border-gray-200 ${searchBarHeight} text-sm relative`}
        initialValues={{ guests: 1 }}
      >
        {/* Phần Địa điểm */}
        <div
          ref={locationAreaRef}
          className="flex-auto min-w-0 flex items-center relative group hover:bg-gray-50 rounded-l-full focus-within:bg-gray-50 cursor-pointer"
          onClick={() => {
            setIsLocationPanelOpen(true); // Luôn mở, không toggle
            setIsDatePickerOpen(false);
            setIsGuestsPopoverVisible(false);
          }}
        >
          <div className="pl-4 sm:pl-6 pr-1 sm:pr-2 py-2.5 w-full h-full flex flex-col justify-center text-center">
            <label className={`${labelFontSize} text-gray-800 mb-0.5`}>
              Địa điểm
            </label>
            <span
              className={`block truncate ${
                selectedLocationForDisplay?.tenViTri
                  ? `${valueTextFontSize} text-gray-800 font-medium`
                  : `${valueTextFontSize} text-gray-400`
              }`}
            >
              {selectedLocationForDisplay?.tenViTri
                ? `${selectedLocationForDisplay.tenViTri}${
                    selectedLocationForDisplay.tinhThanh
                      ? `, ${selectedLocationForDisplay.tinhThanh}`
                      : ""
                  }`
                : "Bạn sắp đi đâu?"}
            </span>
            <Form.Item
              name="location_object"
              noStyle
              rules={[{ required: true, message: " " }]}
            >
              <input type="hidden" />
            </Form.Item>
          </div>
          {/* Panel sẽ được định vị tương đối với Form lớn */}
          {isLocationPanelOpen && (
            <LocationSelectionPanel
              isVisible={isLocationPanelOpen}
              onLocationSelect={(location) => {
                form.setFieldsValue({ location_object: location });
                setIsLocationPanelOpen(false);
              }}
              onClosePanel={() => setIsLocationPanelOpen(false)}
            />
          )}
        </div>

        <div className="border-r border-gray-300 self-stretch my-3"></div>

        {/* Phần Ngày */}
        <div
          ref={dateAreaRef}
          className="flex-auto min-w-0 flex items-center relative group hover:bg-gray-50 focus-within:bg-gray-50 cursor-pointer"
          onClick={() => {
            setIsDatePickerOpen(true); // Luôn mở, không toggle
            setIsLocationPanelOpen(false);
            setIsGuestsPopoverVisible(false);
          }}
        >
          <div className="px-2 sm:px-4 py-2.5 w-full h-full flex flex-col justify-center text-center">
            <label className={`${labelFontSize} text-gray-800 mb-0.5`}>
              Nhận phòng - Trả phòng
            </label>
            <Form.Item
              name="dates"
              noStyle
              rules={[{ required: true, message: " " }]}
            >
              <RangePicker
                ref={rangePickerRef}
                variant="borderless"
                className={`custom-rangepicker-center !p-0 w-full h-auto group-hover:text-gray-700 ${
                  selectedDatesForDisplay
                    ? `${valueTextFontSize} text-gray-800 font-medium`
                    : `${valueTextFontSize} text-gray-400`
                }`}
                placeholder={["Thêm ngày", "Thêm ngày"]}
                suffixIcon={null}
                separator=" – "
                format="DD/MM/YYYY"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                open={isDatePickerOpen}
                onOpenChange={(open) => setIsDatePickerOpen(open)}
                panelRender={(originalPanel) => (
                  <div className="flex shadow-lg rounded-md border border-gray-100 bg-white">
                    <DateQuickOptions
                      onSelectRange={handleQuickDateSelect}
                      closePicker={() => setIsDatePickerOpen(false)}
                    />
                    <div className="border-l border-gray-100">
                      {originalPanel}
                    </div>
                  </div>
                )}
              />
            </Form.Item>
          </div>
        </div>

        <div className="border-r border-gray-300 self-stretch my-3"></div>

        {/* Phần Khách và Nút Tìm kiếm */}
        <div
          ref={guestAreaRef}
          className="flex-auto min-w-0 flex items-center justify-between pl-4 pr-1.5 sm:pr-2 group hover:bg-gray-50 rounded-r-full focus-within:bg-gray-50"
        >
          <Popover
            content={guestsPopoverContent}
            title={
              <span className="font-semibold text-gray-800">
                Số lượng khách
              </span>
            }
            trigger="click"
            open={isGuestsPopoverVisible}
            onOpenChange={(visible) => {
              setIsGuestsPopoverVisible(visible);
              if (visible) {
                setIsLocationPanelOpen(false);
                setIsDatePickerOpen(false);
              }
            }}
            placement="bottomRight"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          >
            <div className="cursor-pointer py-2.5 flex-grow text-left sm:text-center">
              <label className={`${labelFontSize} text-gray-800 mb-0.5`}>
                Khách
              </label>
              <span
                className={`block group-hover:text-gray-700 ${
                  currentGuests > 0
                    ? `${valueTextFontSize} text-gray-800 font-medium`
                    : `${valueTextFontSize} text-gray-400`
                }`}
              >
                {currentGuests > 0 ? `${currentGuests} khách` : "Thêm khách"}
              </span>
            </div>
          </Popover>
          <Form.Item name="guests" noStyle>
            <InputNumber className="!hidden" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={
              <SearchOutlined style={{ fontSize: "16px", color: "white" }} />
            } // Giảm size icon một chút
            className="!bg-red-500 hover:!bg-red-600 !border-red-500 hover:!border-red-600 rounded-full w-10 h-10 flex items-center justify-center" // Giảm size nút một chút
            shape="circle"
          />
        </div>
      </Form>
    </div>
  );
}

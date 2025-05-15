import { Button } from "antd";
import React from "react";

// Danh sách các nút lọc
const filterButtonLabels = [
  "Loại nơi ở",
  "Giá",
  "Đặt ngay",
  "Phòng và phòng ngủ",
  "Bộ lọc khác",
];

export default function FilterButtons() {
  const handleFilterButtonClick = (label) => {
    // Hiện tại không làm gì cả, chỉ console.log
    console.log("Clicked filter button:", label);
    // Sau này bạn có thể mở Modal, Popover hoặc thực hiện hành động lọc ở đây
  };
  return (
    <div className="py-3 md:py-4 overflow-x-auto whitespace-nowrap">
      {" "}
      {/* Cho phép cuộn ngang trên mobile nếu không đủ chỗ */}
      <div className="flex space-x-2 sm:space-x-3 justify-start sm:justify-center">
        {filterButtonLabels.map((label) => (
          <Button
            key={label}
            onClick={() => handleFilterButtonClick(label)}
            // Sử dụng class của Antd Button và Tailwind để tùy chỉnh thêm
            className="!px-3 sm:!px-4 !py-1.5 sm:!py-2 !text-xs sm:!text-sm !font-medium !text-gray-700 !bg-white !border-gray-300 hover:!border-gray-400 hover:!shadow-sm focus:!outline-none focus:!ring-2 focus:!ring-offset-2 focus:!ring-indigo-500 !rounded-full"
            // Nếu không dùng Antd Button, bạn có thể dùng thẻ <button> thường:
            // className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:border-gray-400 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}

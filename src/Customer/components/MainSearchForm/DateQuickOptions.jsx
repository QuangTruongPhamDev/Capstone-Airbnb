import { Button } from "antd";
import dayjs from "dayjs";
import React from "react";

export default function DateQuickOptions({ onSelectRange, closePicker }) {
  const quickOptions = [
    { label: "Hôm nay", range: () => [dayjs(), dayjs()] },
    {
      label: "Ngày mai",
      range: () => [dayjs().add(1, "day"), dayjs().add(1, "day")],
    },
    {
      label: "Cuối tuần này",
      range: () => [
        dayjs().endOf("week").subtract(1, "day"),
        dayjs().endOf("week"),
      ],
    }, // T7, CN
    {
      label: "Tuần tới",
      range: () => [
        dayjs().add(1, "week").startOf("week"),
        dayjs().add(1, "week").endOf("week"),
      ],
    },
    {
      label: "Tháng này",
      range: () => [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
      label: "Tháng tới",
      range: () => [
        dayjs().add(1, "month").startOf("month"),
        dayjs().add(1, "month").endOf("month"),
      ],
    },
  ];

  const handleSelect = (rangeFunc) => {
    onSelectRange(rangeFunc());
    if (closePicker) closePicker(); // Gọi hàm đóng picker
  };
  return (
    <div className="p-3 border-r border-gray-200 w-48 flex flex-col space-y-1">
      {quickOptions.map((opt) => (
        <Button
          key={opt.label}
          type="text"
          size="small"
          className="text-left w-full hover:bg-gray-100 !px-2 !py-1 text-xs"
          onClick={() => handleSelect(opt.range)}
        >
          {opt.label}
        </Button>
      ))}
      <div className="pt-2 mt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400">Chọn ngày tùy chỉnh trên lịch.</p>
      </div>
    </div>
  );
}

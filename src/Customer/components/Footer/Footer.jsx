import React from "react";

// Dữ liệu cho các section của footer
const footerSections = [
  {
    title: "GIỚI THIỆU",
    items: [
      {
        label: "Phương thức hoạt động của Airbnb",
        href: "/phuong-thuc-hoat-dong",
      },
      { label: "Trang tin tức", href: "/tin-tuc" },
      { label: "Nhà đầu tư", href: "/nha-dau-tu" },
      { label: "Airbnb Plus", href: "/airbnb-plus" },
      { label: "Airbnb Luxe", href: "/airbnb-luxe" },
      { label: "HotelTonight", href: "/hoteltonight" },
      { label: "Airbnb for Work", href: "/airbnb-for-work" },
      { label: "Nhờ có Host, mọi điều đều có thể", href: "/nho-co-host" },
      { label: "Cơ hội nghề nghiệp", href: "/co-hoi-nghe-nghiep" },
    ],
  },
  {
    title: "CỘNG ĐỒNG",
    items: [
      { label: "Sự đa dạng và Cảm giác thân thuộc", href: "/su-da-dang" },
      {
        label: "Tiện nghi phù hợp cho người khuyết tật",
        href: "/tien-nghi-khuyet-tat",
      },
      { label: "Đối tác liên kết Airbnb", href: "/doi-tac-lien-ket" },
      {
        label: "Chỗ ở cho tuyến đầu",
        action: () => alert("Chức năng Chỗ ở cho tuyến đầu"),
      },
      { label: "Lượt giới thiệu của khách", href: "/luot-gioi-thieu" },
      {
        label: "Airbnb.org",
        href: "https://www.airbnb.org",
        external: true,
        noRouter: true,
      },
    ],
  },
  {
    title: "ĐÓN TIẾP KHÁCH",
    items: [
      { label: "Cho thuê nhà", href: "/cho-thue-nha" },
      {
        label: "Tổ chức Trải nghiệm trực tuyến",
        href: "/to-chuc-trai-nghiem-truc-tuyen",
      },
      { label: "Tổ chức Trải nghiệm", href: "/to-chuc-trai-nghiem" },
      {
        label: "Đón tiếp khách có trách nhiệm",
        href: "/don-tiep-khach-co-trach-nhiem",
      },
      { label: "Trung tâm tài nguyên", href: "/trung-tam-tai-nguyen" },
      { label: "Trung tâm cộng đồng", href: "/trung-tam-cong-dong" },
    ],
  },
  {
    title: "HỖ TRỢ",
    items: [
      { label: "Biện pháp ứng phó đại dịch COVID-19", href: "/covid-19" },
      { label: "Trung tâm trợ giúp", href: "/tro-giup" },
      { label: "Các tùy chọn hủy", href: "/tuy-chon-huy" },
      { label: "Hỗ trợ khu dân cư", href: "/ho-tro-khu-dan-cu" },
      { label: "Tin cậy và an toàn", href: "/tin-cay-an-toan" },
    ],
  },
];
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 text-gray-700">
      {/* Phần các cột link */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    {item.action ? (
                      <button
                        onClick={item.action}
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline text-left"
                      >
                        {item.label}
                      </button>
                    ) : item.noRouter ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : "_self"}
                        rel={item.external ? "noopener noreferrer" : ""}
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <a
                        href={item.href || "#"}
                        className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Phần chân trang dưới cùng */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:flex md:items-center md:justify-between">
          <div className="text-sm text-gray-500 md:order-1">
            &copy; {currentYear} Airbnb, Inc. &middot;
            <a href="/quyen-rieng-tu" className="ml-1 hover:underline">
              Quyền riêng tư
            </a>{" "}
            &middot;
            <a href="/dieu-khoan" className="ml-1 hover:underline">
              Điều khoản
            </a>{" "}
            &middot;
            <a href="/so-do-trang-web" className="ml-1 hover:underline">
              Sơ đồ trang web
            </a>
          </div>
          <div className="mt-4 md:mt-0 md:order-2 flex items-center justify-center md:justify-end space-x-4">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <span className="mr-1">🌍</span> {/* Icon địa cầu đơn giản */}
              Tiếng Việt (VN)
            </button>
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <span className="font-semibold">USD</span>
            </button>
            <button
              onClick={handleScrollToTop}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              aria-label="Cuộn lên đầu trang"
            >
              Hỗ trợ và tài nguyên
              {/* Icon mũi tên đã được xóa */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

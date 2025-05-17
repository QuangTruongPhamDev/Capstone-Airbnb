import { slugify } from "../utils/slugify";

export const accommodationTypesData = [
  {
    typeId: 1, // ID của loại hình (ví dụ: Toàn bộ nhà)
    name: "Toàn bộ nhà",
    image: "/images/toanbo.jpg", // THAY THẾ ĐƯỜNG DẪN ẢNH
    // Thông tin vị trí cụ thể cho loại hình này
    targetLocation: {
      id: 1, // ID của Quận 1 (ví dụ)
      tenViTri: "Quận 1", // Tên để tạo slug
      // Các thông tin khác nếu cần
    },
  },
  {
    typeId: 2,
    name: "Chỗ ở độc đáo",
    image: "/images/choodocdao.jpg", // THAY THẾ ĐƯỜNG DẪN ẢNH
    targetLocation: {
      id: 3, // ID của Hòn Rùa (ví dụ)
      tenViTri: "Hòn Rùa",
    },
  },
  {
    typeId: 3,
    name: "Trang trại và thiên nhiên",
    image: "/images/thiennhien.jpg", // THAY THẾ ĐƯỜNG DẪN ẢNH
    targetLocation: {
      id: 7, // ID của Langbiang (ví dụ)
      tenViTri: "Langbiang",
    },
  },
  {
    typeId: 4,
    name: "Cho phép mang theo thú cưng",
    image: "/images/thucung.jpg", // THAY THẾ ĐƯỜNG DẪN ẢNH
    targetLocation: {
      id: 6, // ID của Hải Châu, Đà Nẵng (ví dụ)
      tenViTri: "Hải Châu", // API của bạn có thể trả về "Hải Châu", "Đà Nẵng"
    },
  },
];

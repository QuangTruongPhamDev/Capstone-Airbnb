export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Tách dấu và chữ cái (ví dụ: "ố" -> "o" + "´")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu thanh, dấu huyền, v.v.
    .replace(/\s+/g, "-") // Thay thế một hoặc nhiều khoảng trắng bằng dấu gạch nối
    .replace(/[đĐ]/g, "d") // Chuyển đ, Đ thành d
    .replace(/[^\w-]+/g, "") // Loại bỏ tất cả các ký tự không phải chữ, số, gạch nối, hoặc gạch dưới
    .replace(/--+/g, "-") // Thay thế nhiều dấu gạch nối liên tiếp bằng một dấu
    .replace(/^-+/, "") // Loại bỏ dấu gạch nối ở đầu chuỗi
    .replace(/-+$/, ""); // Loại bỏ dấu gạch nối ở cuối chuỗi
}

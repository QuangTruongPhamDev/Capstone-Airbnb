import { https } from "./config";

export const bookingService = {
  createBooking: (bookingData) => {
    // bookingData: { maPhong, ngayDen, ngayDi, soLuongKhach, maNguoiDung }
    return https.post(`/api/dat-phong`, bookingData);
  },
};

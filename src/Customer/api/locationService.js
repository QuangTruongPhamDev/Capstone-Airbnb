import { https } from "./config";

export const locationService = {
  getLocationsByKeyword: (keyword) => {
    return https.get(`/api/vi-tri`, {
      params: {
        keyword: keyword || "", // Gửi keyword rỗng nếu không có từ khóa (để lấy ds nổi bật)
        // pageIndex: 1,
        // pageSize: 100, // Lấy nhiều để làm danh sách nổi bật ban đầu nếu cần
      },
    });
  },

  // Endpoint này có thể giống hoặc khác với endpoint tìm kiếm theo keyword.
  // Dựa trên hình, endpoint là /api/vi-tri/phan-trang-tim-kiem
  getNearbyOrFeaturedLocations: (pageIndex = 1, pageSize = 8) => {
    // Ví dụ lấy 8 địa điểm
    return https.get(`/api/vi-tri/phan-trang-tim-kiem`, {
      params: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        // keyword: '' // Có thể cần gửi keyword rỗng nếu API yêu cầu
      },
    });
  },

  getLocationDetails: (locationId) => {
    return https.get(`/api/vi-tri/${locationId}`);
  },

  // Hàm lấy danh sách phòng theo mã vị trí
  getRoomsByLocationId: (locationId, otherParams = {}) => {
    // và nhận maViTri làm query parameter
    return https.get(`/api/phong-thue/lay-phong-theo-vi-tri`, {
      params: {
        maViTri: locationId,
        // Truyền thêm các tham số khác nếu API backend hỗ trợ
        // checkIn: otherParams.checkIn,
        // checkOut: otherParams.checkOut,
        // soLuongKhach: otherParams.guests,
        ...otherParams,
      },
    });
  },
};

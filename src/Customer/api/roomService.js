import { https } from "./config";

export const roomService = {
  getRoomDetails: (roomId) => https.get(`/api/phong-thue/${roomId}`),

  getAllBookings: () => https.get(`/api/dat-phong`),
};

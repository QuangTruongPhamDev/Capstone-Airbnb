import { https } from "./config";

export const roomService = {
  getRoomDetails: (roomId) => {
    return https.get(`/api/phong-thue/${roomId}`);
  },

  getBookedDatesByRoomId: (roomId) => {
    return https.get(`/api/dat-phong/lay-theo-ma-phong/${roomId}`);
  },
};

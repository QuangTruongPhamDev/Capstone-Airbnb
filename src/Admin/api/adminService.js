import { https } from "./config"



export const getAdminService = () => {
    return https.get("/api/phong-thue");
}

// export const addroomService = (data) => {
//     const url = `/api/phong-thue`;
//     return https.post(url,data);
// }
export const addroomService = (data) => {
    const url = `/api/phong-thue`;
    return https.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

export const updateRoomService = (id, data) => {
    const url = `/api/phong-thue/${id}`;
    return https.put(url, data);
}

export const deleteRoomService = (id) => {
    const url = `/api/phong-thue/${id}`;
    return https.delete(url);
}
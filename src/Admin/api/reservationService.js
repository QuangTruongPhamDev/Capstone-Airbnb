import { https } from "./config"


export const getReservationService = () => {
    return https.get("https://airbnbnew.cybersoft.edu.vn/api/dat-phong");
}

export const addReservationService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/1?=${id}`;
    return https.post(url);
}

export const updateReservationService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/1?=${id}`;
    return https.put(url);
}

export const deleteReservationService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/dat-phong/1?=${id}`;
    return https.delete(url);
}
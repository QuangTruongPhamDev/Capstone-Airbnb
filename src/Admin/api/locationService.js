import { https } from "./config"



export const getLocationService = () => {
    return https.get("https://airbnbnew.cybersoft.edu.vn/api/vi-tri");
}

export const addLocationService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/vi-tri/1?=${id}`;
    return https.post(url);
}

export const updateLocationService = (id, data) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/vi-tri/${id}`;
    return https.put(url, data);
}

export const deleteLocationService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/vi-tri/1?=${id}`;
    return https.delete(url);
}
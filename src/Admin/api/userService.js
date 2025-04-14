import { https } from "./config"



export const getUserService = () => {
    return https.get("https://airbnbnew.cybersoft.edu.vn/api/users");
}

export const addUserService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/users/1?=${id}`;
    return https.post(url);
}

export const updateUserService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/users/1?=${id}`;
    return https.put(url);
}

export const deleteUserService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/users?id=${id}`;
    return https.delete(url);
}
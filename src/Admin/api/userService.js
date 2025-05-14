import {https, CYBER_TOKERN} from './config';



export const getUserService = () => {
    return https.get("https://airbnbnew.cybersoft.edu.vn/api/users");
}

export const addUserService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/users/${id}`;
    return https.post(url);
}

// export const updateUserService = (id) => {
//     const url = `https://airbnbnew.cybersoft.edu.vn/api/users/${id}`;
//     return https.put(url);
// }
export const updateUserService = (id, adminForm) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/users/${id}`;
    return https.put(url, adminForm, {
      headers: {
        tokenCybersoft: CYBER_TOKERN,
      },
    });
  };

export const deleteUserService = (id) => {
    const url = `https://airbnbnew.cybersoft.edu.vn/api/users?id=${id}`;
    return https.delete(url);
}
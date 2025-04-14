import React, { useEffect, useState } from "react";
import "./index.css"
import { getUserService } from "../../../api/userService";


export default function UserList() {
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        getUserService()
        .then((res) => {
            console.log("Cập nhật được người dùng:", res);
            setUserList(res.data.content);
        })
        .catch((err) => {
            console.log("Lỗi khi không cập nhật được người dùng:", err);
        });
    }, []);

  return (
    <div className="userlist-body">
      <div className="userlist-main">
        <div className="userlist-header">
          <h1 className="userlist-h1">Quản lý Người dùng</h1>
          <div className="userlist-user-section">
            <div className="userlist-avatar">A</div>
            <a href="#">Đăng xuất</a>
          </div>
        </div>
        <button className="userlist-btn-add">Thêm người dùng</button>
        <div className="userlist-search-box">
          <input
            className="userlist-input"
            type="text"
            placeholder="Tìm kiếm người dùng..."
          />
          <button className="userlist-button">
            <i className="fas fa-search" />
          </button>
        </div>
        <table className="userlist-table">
          <thead>
            <tr>
              <th>Mã người dùng</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((userlist) => (
            <tr key={userlist.id}>
              <td>{userlist.id}</td>
              <td>{userlist.name}</td>
              <td>{userlist.email}</td>
              <td>{userlist.role}</td>
              <td>
                <a className="userlist-a-edit" href="#">
                  <i className="userlist-i fas fa-edit" />
                </a>
                <a className="userlist-a-delete" href="#">
                  <i className="userlist-i fas fa-trash-alt" />
                </a>
              </td>
            </tr>
            ))}
            {/* Thêm nhiều dòng nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

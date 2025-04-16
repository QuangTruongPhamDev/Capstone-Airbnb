import React, { useEffect, useState } from "react";
import "./index.css"
import { getUserService } from "../../../api/userService";
import axios from "axios";
import { toast } from "react-toastify";
import {CYBER_TOKERN} from '../../../api/config';
import { Link } from "react-router-dom";



export default function UserList() {
    const [userList, setUserList] = useState([]);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [adminForm, setAdminForm] = useState({
      name: "",
      email: "",
      username: "",
      phone: "",
      password: "",
    });
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = () => {
      getUserService()
        .then((res) => {
          setUserList(res.data.content);
        })
        .catch((err) => {
          console.log("Lỗi khi không cập nhật được người dùng:", err);
        });
    };
  
    const handleAddAdmin = async (e) => {
      e.preventDefault();
      const newAdmin = {
        ...adminForm,
        role: "ADMIN",
      };
  
      try {
        const res = await axios.post(
          "https://airbnbnew.cybersoft.edu.vn/api/users",
          newAdmin,
          {
            headers: {
                tokenCybersoft: CYBER_TOKERN,
                //Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        toast.success("Thêm quản trị viên thành công!");
        fetchUsers();
        setShowAddAdminModal(false);
      } catch (error) {
        toast.error("Thêm quản trị viên thất bại!");
        console.error(error.response?.data || error.message);
      }
    };
  
    return (
      <div className="userlist-body">
        <div className="userlist-main">
          <div className="userlist-header">
            <h1 className="userlist-h1">Quản lý Người dùng</h1>
            <div className="userlist-user-section">
              <div className="userlist-avatar">A</div>
              <Link to="/">
              <span href="#">Đăng xuất</span>
              </Link>
            </div>
          </div>
  
          <button className="userlist-btn-add" onClick={() => setShowAddAdminModal(true)}>
            Thêm quản trị viên
          </button>
  
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
                <th>Quyền</th>
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
            </tbody>
          </table>
        </div>
  
        {showAddAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">THÊM QUẢN TRỊ VIÊN</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Tên"
                  className="w-full p-2 border rounded"
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  value={adminForm.email}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, email: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Tài khoản"
                  className="w-full p-2 border rounded"
                  value={adminForm.username}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, username: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  className="w-full p-2 border rounded"
                  value={adminForm.phone}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, phone: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full p-2 border rounded"
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm({ ...adminForm, password: e.target.value })
                  }
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Thêm
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setShowAddAdminModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

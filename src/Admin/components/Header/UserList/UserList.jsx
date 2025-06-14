import React, { useEffect, useState } from "react";
import "./index.css";
import { deleteUserService, getUserService } from "../../../api/userService";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CYBER_TOKERN } from "../../../api/config";
import { Link } from "react-router-dom";

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const itemsPerPage = 100;

  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    role: "ADMIN",
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage]);

  const fetchUsers = () => {
    getUserService(currentPage, itemsPerPage, searchTerm)
      .then((res) => {
        const data = res.data.content;
        setUserList(data.data);
        setTotalPages(Math.ceil(data.totalRow / itemsPerPage));
      })
      .catch((err) => {
        toast.error("Không thể tải danh sách người dùng!");
        console.error("Lỗi khi tải danh sách người dùng:", err);
      });
  };

  const handleChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  // New function to handle avatar file selection and preview
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    const userPayload = {
      ...adminForm,
      role: adminForm.role || "ADMIN",
    };
    delete userPayload.avatar;

    try {
      const token = localStorage.getItem("token");

      // 1. Tạo tài khoản admin mới
      const addRes = await axios.post(
        "https://airbnbnew.cybersoft.edu.vn/api/users",
        userPayload,
        {
          headers: {
            tokenCybersoft: CYBER_TOKERN,
            token: token,
          },
        }
      );

      let newUser = addRes.data?.content || addRes.data;

      // 3. Cập nhật UI
      setUserList((prev) => [newUser, ...prev]);
      toast.success("Thêm admin thành công!");

      // 4. Reset form
      setShowAddAdminModal(false);
      setAdminForm({
        name: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        role: "ADMIN",
        avatar: "",
      });
      setEditingUser(null);
    } catch (error) {
      toast.error(error.response?.data?.content || "Thêm admin thất bại!");
      console.error("Lỗi thêm admin:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await deleteUserService(id);
        toast.success("Xóa người dùng thành công!");
        fetchUsers();
      } catch (error) {
        toast.error("Xóa người dùng thất bại!");
        console.error(error.response?.data || error);
      }
    }
  };

  const handleEdit = (user) => {
    setAdminForm({
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      phone: user.phone || "",
      password: "", // Mật khẩu thường không được điền vào form edit vì lý do bảo mật
      role: user.role || "USER", // Mặc định là USER nếu không có
    });
    setEditingUser(user);
    setShowAddAdminModal(true);
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="userlist-body">
      <div className="userlist-main">
        <div className="userlist-header">
          <h1 className="userlist-h1">Quản lý Người dùng</h1>
          <div className="userlist-user-section">
            {/* Hiển thị avatar của người dùng hiện tại nếu có */}
            {adminForm.avatar ? (
              <img
                src={adminForm.avatar}
                alt="Avatar"
                className="userlist-avatar-img" // Thêm class CSS nếu cần
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/40";
                }} // Fallback image
              />
            ) : (
              []
            )}
            <Link to="/">
              <span>
                <i className="userlist-home fa fa-home"></i>
              </span>
            </Link>
          </div>
        </div>

        <button
          className="userlist-btn-add"
          onClick={() => {
            setEditingUser(null);
            setAdminForm({
              name: "",
              email: "",
              username: "",
              phone: "",
              password: "",
              role: "ADMIN",
              avatar: "", // Reset avatar field
            });
            setSelectedAvatarFile(null); // Reset file state
            setAvatarPreview(null); // Reset preview state
            setShowAddAdminModal(true);
          }}
        >
          Thêm quản trị viên
        </button>

        <div className="userlist-search-box">
          <input
            className="userlist-input"
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
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
            {userList.length > 0 ? (
              userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="userlist-a-edit"
                      onClick={() => handleEdit(user)}
                      href="#"
                    >
                      <i className="userlist-i fas fa-edit" />
                    </button>
                    <button
                      className="userlist-a-delete"
                      onClick={() => handleDelete(user.id)}
                      href="#"
                    >
                      <i className="userlist-i fas fa-trash-alt" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Không tìm thấy người dùng phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="userlist-pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="userlist-button"
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`userlist-button ${
                currentPage === i + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            className="userlist-button"
          >
            »
          </button>
        </div>
      </div>

      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "CẬP NHẬT NGƯỜI DÙNG" : "THÊM QUẢN TRỊ VIÊN"}
            </h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <input
                type="text"
                placeholder="Tên"
                className="w-full p-2 border rounded"
                name="name"
                value={adminForm.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                name="email"
                value={adminForm.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Tài khoản"
                className="w-full p-2 border rounded"
                name="username"
                value={adminForm.username}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full p-2 border rounded"
                name="phone"
                value={adminForm.phone}
                onChange={handleChange}
                required
              />
              {/* Mật khẩu chỉ bắt buộc khi thêm mới, không bắt buộc khi cập nhật */}
              <input
                type="password"
                placeholder="Mật khẩu"
                className="w-full p-2 border rounded"
                name="password"
                value={adminForm.password}
                onChange={handleChange}
                required={!editingUser} // Mật khẩu bắt buộc khi thêm mới, không khi cập nhật
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingUser ? "Cập nhật" : "Thêm"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => {
                    setShowAddAdminModal(false);
                    setEditingUser(null);
                    setSelectedAvatarFile(null); // Reset file state
                    setAvatarPreview(null); // Reset preview state
                    setAdminForm({
                      // Reset form to initial state on cancel
                      name: "",
                      email: "",
                      username: "",
                      phone: "",
                      password: "",
                      role: "ADMIN",
                      avatar: "",
                    });
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

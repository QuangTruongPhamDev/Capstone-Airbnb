import React, { useEffect, useState } from "react";
import "./index.css"
import { deleteUserService, getUserService, updateUserService } from "../../../api/userService";
import axios from "axios";
import { toast } from "react-toastify";
import { CYBER_TOKERN } from '../../../api/config';
import { Link } from "react-router-dom";



export default function UserList() {
    const [userList, setUserList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
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
    }, []);

    useEffect(() => {
        const filtered = userList.filter(
            (user) =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    }, [searchTerm, userList]);

    const fetchUsers = () => {
        getUserService()
            .then((res) => {
                setUserList(res.data.content);
            })
            .catch((err) => {
                console.log("Lỗi khi không cập nhật được người dùng:", err);
            });
    };

    const handleChange = (e) => {
        setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        const newAdmin = {
            ...adminForm,
            role: "ADMIN",
        };

        try {
            if (editingUser) {
                await updateUserService(editingUser.id, newAdmin);
                toast.success("Cập nhật người dùng thành công!");
            } else {
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
            }
            fetchUsers();
            setShowAddAdminModal(false);
            setAdminForm({
                name: "",
                email: "",
                username: "",
                phone: "",
                password: "",
                role: "ADMIN",
            });
            setEditingUser(null);
        } catch (error) {
            toast.error("Thêm quản trị viên thất bại!");
            console.error(error.response?.data || error.message);
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
            }
        }
    };

    const handleEdit = (userlist) => {
        setAdminForm({
            name: userlist.name,
            email: userlist.email,
            username: userlist.username,
            phone: userlist.phone,
            password: "", // không lấy mật khẩu cũ
            role: userlist.role,
        });
        setEditingUser(userlist);
        setShowAddAdminModal(true);
    };

    const filteredUserList = userList.filter((userlist) => 
        userlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUserList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredUserList.slice(startIndex, startIndex + itemsPerPage);

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
                        <div className="userlist-avatar">A</div>
                        <Link to="/">
                            <span href="#">Đăng xuất</span>
                        </Link>
                    </div>
                </div>

                <button className="userlist-btn-add"
                    onClick={() => {
                        setEditingUser(null);
                        setAdminForm({
                            name: "",
                            email: "",
                            username: "",
                            phone: "",
                            password: "",
                            role: "ADMIN",
                        });
                        setShowAddAdminModal(true)
                    }}>
                    Thêm quản trị viên
                </button>

                <div className="userlist-search-box">
                    <input
                        className="userlist-input"
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        {currentData.map((userlist) => (
                            <tr key={userlist.id}>
                                <td>{userlist.id}</td>
                                <td>{userlist.name}</td>
                                <td>{userlist.email}</td>
                                <td>{userlist.role}</td>
                                <td>
                                    <a className="userlist-a-edit" onClick={() => handleEdit(userlist)} href="#">
                                        <i className="userlist-i fas fa-edit" />
                                    </a>
                                    <a className="userlist-a-delete" onClick={() => handleDelete(userlist.id)} href="#">
                                        <i className="userlist-i fas fa-trash-alt" />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Phân trang */}

                {filteredUserList.length === 0 && <p>Không tìm thấy người dùng phù hợp.</p>}

                <div className="userlist-pagination">
                    <button onClick={() => changePage(currentPage - 1)} className="userlist-button" disabled={currentPage === 1}>«</button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`userlist-button ${currentPage === i + 1 ? "active" : ""
                                }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => changePage(currentPage + 1)} className="userlist-button" disabled={currentPage === totalPages}>»</button>
                </div>
            </div>

            {showAddAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">{editingUser ? "CẬP NHẬT NGƯỜI DÙNG" : "THÊM QUẢN TRỊ VIÊN"}</h2>
                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Tên"
                                className="w-full p-2 border rounded"
                                name="name"
                                value={adminForm.name}
                                onChange={
                                    handleChange
                                }
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                                name="email"
                                value={adminForm.email}
                                onChange={
                                    handleChange
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Tài khoản"
                                className="w-full p-2 border rounded"
                                name="username"
                                value={adminForm.username}
                                onChange={
                                    handleChange
                                }
                                required
                            />
                            <input
                                type="text"
                                placeholder="Số điện thoại"
                                className="w-full p-2 border rounded"
                                name="phone"
                                value={adminForm.phone}
                                onChange={
                                    handleChange
                                }
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu"
                                className="w-full p-2 border rounded"
                                name="password"
                                value={adminForm.password}
                                onChange={
                                    handleChange
                                }
                                required
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

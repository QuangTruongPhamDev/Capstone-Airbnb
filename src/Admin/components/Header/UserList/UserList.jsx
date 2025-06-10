import React, { useEffect, useState } from "react";
import "./index.css";
import {
    deleteUserService,
    getUserService,
    updateUserService,
} from "../../../api/userService";
import { UploadAvatarUserService } from "../../../api/userService"; // Import service mới
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
    const [editingUser, setEditingUser] = useState(null);
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null); // New state for selected avatar file
    const [avatarPreview, setAvatarPreview] = useState(null); // New state for avatar preview

    const itemsPerPage = 100;

    const [adminForm, setAdminForm] = useState({
        name: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        role: "ADMIN",
        avatar: "", // Add avatar field to form state to store current avatar URL
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
    const handleUploadAvatar = async (file, userId) => {
        if (!file) {
            toast.warning("Vui lòng chọn file hình ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append("formFile", file);

        try {
            const res = await axios.post(
                "https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar",
                formData,
                {
                    headers: {
                        token: localStorage.getItem("token"), // hoặc truyền props.token nếu cần
                        tokenCybersoft: CYBER_TOKERN,
                    },
                }
            );

            const avatarUrl = res.data.content.avatar;

            // Cập nhật avatar mới cho người dùng
            toast.success("Upload avatar thành công!");
            // Sau đây là option: reload lại danh sách người dùng nếu cần
            fetchUsers(); // gọi lại API lấy danh sách người dùng
        } catch (error) {
            console.error(error);
            toast.error("Upload avatar thất bại!");
        }
    };
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        const userPayload = {
            ...adminForm,
            role: adminForm.role, // Giữ nguyên role từ form, có thể là ADMIN hoặc USER
        };
        // Remove avatar field from the payload if it's just the URL, as we handle file separately
        delete userPayload.avatar;

        try {
            let updatedUserData; // Variable to store the updated/added user data

            if (editingUser) {
                // Update user information (excluding avatar)
                const updateRes = await updateUserService(editingUser.id, userPayload);
                updatedUserData = updateRes.data?.content || updateRes.data || { ...userPayload, id: editingUser.id };

                // If a new avatar file is selected, upload it
                if (selectedAvatarFile) {
                    try {
                        // The UploadAvatarUserService function already handles FormData
                        const uploadRes = await UploadAvatarUserService(selectedAvatarFile);
                        // Assuming the upload service returns the updated user object with new avatar URL
                        const newAvatarUrl = uploadRes.data?.content?.avatar || uploadRes.data?.avatar || uploadRes.data; // Adjust based on your API response

                        if (newAvatarUrl) {
                            updatedUserData = { ...updatedUserData, avatar: newAvatarUrl };
                            toast.success("Cập nhật avatar thành công!");
                        } else {
                            console.warn("Upload avatar success, but no new avatar URL found in response:", uploadRes);
                        }
                    } catch (uploadError) {
                        toast.error("Tải avatar thất bại!");
                        console.error("Lỗi khi tải avatar:", uploadError.response?.data || uploadError.message);
                    }
                }
                toast.success("Cập nhật người dùng thành công!");
            } else {
                const token = localStorage.getItem("token");
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
                updatedUserData = addRes.data?.content || addRes.data;

                // 2. Nếu có avatar, upload ngay sau khi tạo xong user
                if (selectedAvatarFile) {
                    try {
                        const uploadRes = await UploadAvatarUserService(selectedAvatarFile);
                        const newAvatarUrl = uploadRes.data?.content?.avatar || uploadRes.data?.avatar || uploadRes.data;
                
                        if (newAvatarUrl) {
                            updatedUserData = { ...updatedUserData, avatar: newAvatarUrl };
                            toast.success("Cập nhật avatar thành công!");
                
                            // Cập nhật avatar mới trong form để UI hiển thị ngay
                            setAdminForm(prev => ({ ...prev, avatar: newAvatarUrl }));
                
                            // Cập nhật userList luôn cho chắc
                            setUserList(prevList =>
                                prevList.map(u =>
                                    u.id === updatedUserData.id ? { ...u, avatar: newAvatarUrl } : u
                                )
                            );
                        }
                    } catch (uploadError) {
                        toast.error("Tải avatar thất bại!");
                    }
                }
                toast.success("Thêm người dùng thành công!");
            }

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
            setSelectedAvatarFile(null); // Reset file state
            setAvatarPreview(null); // Reset preview state
        } catch (error) {
            toast.error(error.response?.data?.content || error.message || "Thêm/cập nhật người dùng thất bại!");
            console.error("Lỗi khi thêm/cập nhật người dùng:", error.response?.data || error.message);
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
            avatar: user.avatar || "", // Set current avatar URL for display
        });
        setEditingUser(user);
        setShowAddAdminModal(true);
        setSelectedAvatarFile(null); // Clear selected file when opening edit modal
        setAvatarPreview(user.avatar || null); // Show current avatar as preview
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
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/40"; }} // Fallback image
                            />
                        ) : ([])}
                        <Link to="/">
                            <span><i className="userlist-home fa fa-home"></i></span>
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
                            <th>Avatar</th>
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
                                    <td>
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="Avatar"
                                                width="50"
                                                height="50"
                                                style={{ borderRadius: "50%", objectFit: "cover" }}
                                                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50"; }}
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
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
                            className={`userlist-button ${currentPage === i + 1 ? "active" : ""
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

                            {/* Input file cho avatar */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="avatarFile" className="font-semibold">
                                    Ảnh đại diện:
                                </label>
                                <input
                                    type="file"
                                    id="avatarFile"
                                    className="w-full p-2 border rounded"
                                    accept="image/png, image/jpeg, image/jpg"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setSelectedAvatarFile(file);
                                            setAvatarPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                                {avatarPreview && (
                                    <div className="mt-2">
                                        <img src={avatarPreview} alt="Preview Avatar" className="w-24 h-24 object-cover rounded-full mx-auto" />
                                    </div>
                                )}
                                {adminForm.avatar && !selectedAvatarFile && (
                                    <div className="mt-2 text-center text-gray-500 text-sm">
                                        Ảnh đại diện hiện tại:
                                        <img src={adminForm.avatar} alt="Current Avatar" className="w-20 h-20 object-cover rounded-full mx-auto" />
                                    </div>
                                )}
                            </div>

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
                                        setAdminForm({ // Reset form to initial state on cancel
                                            name: "", email: "", username: "", phone: "", password: "", role: "ADMIN", avatar: ""
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
import React, { useEffect, useState } from "react";
import "./index.css";
import {
    addReservationService,
    deleteReservationService,
    getReservationService,
    updateReservationService,
} from "../../../api/reservationService";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1300;

    const [form, setForm] = useState({
        maPhong: "",
        ngayDen: "",
        ngayDi: "",
        soLuongKhach: "",
        maNguoiDung: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = () => {
        getReservationService()
            .then((res) => {
                const data = res?.data?.content || [];
                setReservations(data);
            })
            .catch((err) => {
                toast.error("Lỗi khi tải danh sách đặt phòng");
                console.error("Lỗi khi tải danh sách đặt phòng:", err);
            });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateReservationService(editingId, form);
                setReservations((prev) =>
                    prev.map((item) =>
                        item?.id === editingId ? { ...form, id: editingId } : item
                    )
                );
                toast.success("Cập nhật đặt phòng thành công");
            } else {
                const res = await addReservationService(form);
                setReservations((prev) => [...prev, res?.data?.content]);
                toast.success("Thêm đặt phòng thành công");
            }
            resetForm();
        } catch (err) {
            toast.error("Lỗi thao tác: " + (err?.response?.data?.content || err.message));
        }
    };

    const handleEdit = (rsv) => {
        setForm({
            maPhong: rsv.maPhong,
            ngayDen: rsv.ngayDen.slice(0, 10),
            ngayDi: rsv.ngayDi.slice(0, 10),
            soLuongKhach: rsv.soLuongKhach,
            maNguoiDung: rsv.maNguoiDung,
        });
        setIsEditing(true);
        setEditingId(rsv.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa?")) {
            try {
                await deleteReservationService(id);
                setReservations(reservations.filter((item) => item.id !== id));
                toast.success("Xóa đặt phòng thành công");
            } catch {
                toast.error("Lỗi khi xóa đặt phòng");
            }
        }
    };

    const resetForm = () => {
        setForm({
            maPhong: "",
            ngayDen: "",
            ngayDi: "",
            soLuongKhach: "",
            maNguoiDung: "",
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const filteredReservations = reservations?.filter((rsv) =>
        rsv?.maNguoiDung?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredReservations.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleChangePage = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="reservation-body">
            <div className="reservation-main-content">
                <div className="reservation-header">
                    <h1 className="reservation-title">Quản Lý Đặt Phòng</h1>
                    <div className="reservation-user-section">
                        <Link to="/">
                            <span><i className="reservation-home fa fa-home"></i></span>
                        </Link>
                    </div>
                </div>

                <div className="reservation-header">
                    <button
                        className="reservation-btn-add"
                        onClick={() => {
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm ? "Đóng form" : "Thêm đặt phòng"}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="reservation-form">
                        <input
                            className="reservation-input"
                            name="maPhong"
                            value={form.maPhong}
                            onChange={handleChange}
                            placeholder="Mã phòng"
                            required
                        />
                        <input
                            className="reservation-input"
                            name="ngayDen"
                            type="date"
                            value={form.ngayDen}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="reservation-input"
                            name="ngayDi"
                            type="date"
                            value={form.ngayDi}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="reservation-input"
                            name="soLuongKhach"
                            value={form.soLuongKhach}
                            onChange={handleChange}
                            placeholder="Số lượng khách"
                            required
                        />
                        <input
                            className="reservation-input"
                            name="maNguoiDung"
                            value={form.maNguoiDung}
                            onChange={handleChange}
                            placeholder="Mã người dùng"
                            required
                        />
                        <button className="reservation-btn" type="submit">
                            {isEditing ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </form>
                )}

                <input
                    type="text"
                    placeholder="Tìm kiếm theo người đặt..."
                    className="reservation-search-box"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>Mã đặt</th>
                            <th>Mã phòng</th>
                            <th>Mã người dùng</th>
                            <th>Ngày nhận</th>
                            <th>Ngày trả</th>
                            <th>Số khách</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData?.map((rsv, index) => (
                            <tr key={rsv?.id || index}>
                                <td>{rsv.id}</td>
                                <td>{rsv.maPhong}</td>
                                <td>{rsv.maNguoiDung}</td>
                                <td>{rsv.ngayDen?.slice(0, 10)}</td>
                                <td>{rsv.ngayDi?.slice(0, 10)}</td>
                                <td>{rsv.soLuongKhach}</td>
                                <td>
                                    <button
                                        className="reservation-btn-edit"
                                        onClick={() => handleEdit(rsv)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="reservation-btn-delete"
                                        onClick={() => handleDelete(rsv.id)}
                                    >
                                        🗑
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredReservations.length === 0 && (
                    <p className="no-results">Không tìm thấy đặt phòng phù hợp.</p>
                )}

                <div className="reservation-pagination">
                    <button
                        onClick={() => handleChangePage(currentPage - 1)}
                        className="reservation-button"
                    >
                        «
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`reservation-button ${currentPage === i + 1 ? "active" : ""}`}
                            onClick={() => handleChangePage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handleChangePage(currentPage + 1)}

                        className="reservation-button"
                    >
                        »
                    </button>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
}

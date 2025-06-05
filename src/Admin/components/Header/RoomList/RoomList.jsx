import React, { useEffect, useState } from "react";
import "./index.css";
import {
  addroomService,
  deleteRoomService,
  getAdminService,
  updateRoomService,
} from "../../../api/adminService";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [searchRoom, setSearchRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [form, setForm] = useState({
    tenPhong: "",
    khach: 1,
    maViTri: "",
    hinhAnh: null,
  });
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    getAdminService()
      .then((res) => {
        setRooms(res.data.content);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Lỗi khi tải danh sách phòng");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "hinhAnh") {
      setForm({ ...form, hinhAnh: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("tenPhong", form.tenPhong);
    formData.append("khach", form.khach);
    formData.append("maViTri", form.maViTri);
    if (form.hinhAnh instanceof formFile) {
      formData.append("hinhAnh", form.hinhAnh);
    }

    if (isEditing) {
      updateRoomService(editingRoomId, formData)
        .then(() => {
          toast.success("Cập nhật phòng thành công");
          setRooms((prev) =>
            prev.map((room) =>
              room.id === editingRoomId
                ? { ...room, ...form, hinhAnh: form.hinhAnh instanceof formFile ? URL.createObjectURL(form.hinhAnh) : room.hinhAnh }
                : room
            )
          );
          resetForm();
        })
        .catch(() => toast.error("Lỗi khi cập nhật phòng"))
        .finally(() => setLoading(false));
    } else {
      addroomService(formData)
        .then((res) => {
          console.log("Phòng mới:", res.data);
          toast.success("Thêm phòng thành công");
          setRooms((prev) => [...prev, res.data.content]);
          resetForm();
        })
        .catch(() => toast.error("Lỗi khi thêm phòng"))
        .finally(() => setLoading(false));
    }
  };

  const resetForm = () => {
    setForm({ tenPhong: "", khach: 1, maViTri: "", hinhAnh: null });
    setIsEditing(false);
    setEditingRoomId(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng này không?")) {
      deleteRoomService(id)
        .then(() => {
          toast.success("Xóa phòng thành công");
          setRooms(rooms.filter((room) => room.id !== id));
        })
        .catch(() => toast.error("Lỗi khi xóa phòng"));
    }
  };

  const handleEdit = (room) => {
    setForm({
      tenPhong: room.tenPhong,
      khach: room.khach,
      maViTri: room.maViTri,
      hinhAnh: room.hinhAnh,
    });
    setIsEditing(true);
    setEditingRoomId(room.id);
    setShowForm(true);
  };

  const filteredRoom = rooms.filter((room) =>
    room.tenPhong?.toLowerCase().includes(searchRoom.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoom.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRooms = filteredRoom.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="roomlist-body">
      <div className="roomlist-main">
        <div className="roomlist-header">
          <h1 className="roomlist-h1">Quản lý Phòng</h1>
          <div className="roomlist-logout">
            <span className="roomlist-avatar">A</span>
            <Link to="/">
              <span>Đăng xuất</span>
            </Link>
          </div>
        </div>

        <div className="roomlist-header">
          <button
            className="roomlist-btn-add"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Đóng" : "Thêm phòng"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="roomlist-form">
            <input
              className="roomlist-input"
              name="tenPhong"
              value={form.tenPhong}
              onChange={handleChange}
              placeholder="Tên phòng"
              required
            />
            <input
              className="roomlist-input"
              name="khach"
              type="number"
              value={form.khach}
              onChange={handleChange}
              placeholder="Số khách"
              required
            />
            <input
              className="roomlist-input"
              name="maViTri"
              value={form.maViTri}
              onChange={handleChange}
              placeholder="Mã vị trí"
              required
            />
            <input
              className="roomlist-input"
              name="hinhAnh"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required={!isEditing}
            />
            {form.hinhAnh && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={
                    form.hinhAnh instanceof File
                      ? URL.createObjectURL(form.hinhAnh)
                      : form.hinhAnh
                  }
                  alt="Preview"
                  width="100"
                />
              </div>
            )}
            <button className="roomlist-btn" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </form>
        )}

        <input
          type="text"
          placeholder="Tìm kiếm phòng..."
          className="roomlist-search-box"
          value={searchRoom}
          onChange={(e) => {
            setSearchRoom(e.target.value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="roomlist-room-table">
            <thead>
              <tr>
                <th className="roomlist-th">Mã phòng</th>
                <th className="roomlist-th">Tên phòng</th>
                <th className="roomlist-th">Hình ảnh</th>
                <th className="roomlist-th">Vị trí</th>
                <th className="roomlist-th">Khách</th>
                <th className="roomlist-th">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.map((room) => (
                <tr key={room.id}>
                  <td className="roomlist-td">{room.id}</td>
                  <td className="roomlist-td">{room.tenPhong}</td>
                  <td className="roomlist-td">
                    <img src={room.hinhAnh} alt={room.tenPhong} width="80" />
                  </td>
                  <td className="roomlist-td">{room.maViTri}</td>
                  <td className="roomlist-td">{room.khach}</td>
                  <td className="roomlist-td">
                    <button
                      className="roomlist-btn-edit"
                      onClick={() => handleEdit(room)}
                    >
                      <i className="roomlist-i fas fa-edit" />
                    </button>
                    <button
                      className="roomlist-btn-delete"
                      onClick={() => handleDelete(room.id)}
                    >
                      <i className="roomlist-i fas fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredRoom.length === 0 && <p>Không tìm thấy phòng phù hợp.</p>}

        <div className="roomlist-pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="roomlist-button"
            disabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`roomlist-button ${currentPage === i + 1 ? "active" : ""
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            className="roomlist-button"
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

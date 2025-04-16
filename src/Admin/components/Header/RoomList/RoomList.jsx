import React, { useEffect, useState } from "react";
import "./index.css"
import { addroomService, deleteRoomService, getAdminService, updateRoomService } from "../../../api/adminService";
import { Link } from "react-router-dom";

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
      hinhAnh: "",
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
        .catch((err) => {
          console.log("Lỗi khi tải danh sách phòng:", err);
          setLoading(false);
        });
    }, []);
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setLoading(true);
  
      if (isEditing) {
        updateRoomService(editingRoomId, form)
          .then(() => {
            alert("Cập nhật thành công");
            setRooms((prev) =>
              prev.map((room) =>
                room.id === editingRoomId ? { ...form, id: editingRoomId } : room
              )
            );
            resetForm();
          })
          .catch(() => alert("Lỗi khi cập nhật phòng"))
          .finally(() => setLoading(false));
      } else {
        addroomService(form)
          .then((newRoom) => {
            alert("Thêm thành công");
            setRooms((prev) => [...prev,newRoom]);
            resetForm();
          })
          .catch(() => alert("Lỗi khi thêm phòng"))
          .finally(() => setLoading(false));
      }
    };
  
    const resetForm = () => {
      setForm({ tenPhong: "", khach: 1, maViTri: "", hinhAnh: "" });
      setIsEditing(false);
      setEditingRoomId(null);
      setShowForm(false);
    };
  
    const handleDelete = (id) => {
      if (window.confirm("Bạn có chắc muốn xóa phòng này không?")) {
        deleteRoomService(id)
          .then(() => {
            alert("Xóa thành công");
            setRooms(rooms.filter(room => room.id !== id));
          })
          .catch(() => alert("Lỗi khi xóa phòng"));
      }
    };
  
    const handleEdit = (room) => {
      setForm(room);
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
              <span href="#">Đăng xuất</span>
              </Link>
            </div>
          </div>
  
          <div className="roomlist-header">
            <button className="roomlist-btn-add" onClick={() => setShowForm(!showForm)}>
              {showForm ? "Đóng" : "Thêm phòng"}
            </button>
          </div>
  
          {showForm && (
            <form onSubmit={handleSubmit} className="roomlist-form">
              <input className="roomlist-input" name="tenPhong" value={form.tenPhong} onChange={handleChange} placeholder="Tên phòng" required />
              <input className="roomlist-input" name="khach" type="number" value={form.khach} onChange={handleChange} placeholder="Số khách" required />
              <input className="roomlist-input" name="maViTri" value={form.maViTri} onChange={handleChange} placeholder="Mã vị trí" required />
              <input className="roomlist-input" name="hinhAnh" value={form.hinhAnh} onChange={handleChange} placeholder="Hình ảnh" required />
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
                    <td className="roomlist-td"><img src={room.hinhAnh} alt={room.tenPhong} width="80" /></td>
                    <td className="roomlist-td">{room.maViTri}</td>
                    <td className="roomlist-td">{room.khach}</td>
                    <td className="roomlist-td">
                      <button className="roomlist-btn-edit" onClick={() => handleEdit(room)}><i className="roomlist-i fas fa-edit" /></button>
                      <button className="roomlist-btn-delete" onClick={() => handleDelete(room.id)}><i className="roomlist-i fas fa-trash" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
  
          {filteredRoom.length === 0 && <p>Không tìm thấy phòng phù hợp.</p>}
  
          <div className="roomlist-pagination">
            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>«</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>»</button>
          </div>
        </div>
      </div>
    );
  }

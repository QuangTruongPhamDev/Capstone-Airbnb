import React, { useEffect, useState } from "react";
import "./index.css";


export default function RoomModal({ isOpen, onClose, onSubmit, initialData = {} }) {
  const [roomData, setRoomData] = useState({
    tenPhong: "",
    maViTri: "",
    khach: 0,
    hinhAnh: null,
  });

  useEffect(() => {
    if (initialData) {
      setRoomData({
        tenPhong: initialData.tenPhong || "",
        maViTri: initialData.maViTri || "",
        khach: initialData.khach || 0,
        hinhAnh: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setRoomData((prev) => ({ ...prev, hinhAnh: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(roomData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <h2>{initialData?.id ? "Sửa phòng" : "Thêm phòng"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Tên phòng:</label>
          <input type="text" name="tenPhong" value={roomData.tenPhong} onChange={handleChange} required />

          <label>Mã vị trí:</label>
          <input type="text" name="maViTri" value={roomData.maViTri} onChange={handleChange} required />

          <label>Số khách:</label>
          <input type="number" name="khach" value={roomData.khach} onChange={handleChange} required />

          <label>Hình ảnh:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <div className="modal-buttons">
            <button type="submit">Lưu</button>
            <button type="button" onClick={onClose} className="cancel">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
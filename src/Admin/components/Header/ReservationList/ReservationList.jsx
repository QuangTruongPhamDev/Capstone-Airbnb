import React, { useEffect, useState } from "react";
import "./index.css";
import { getReservationService } from "../../../api/reservationService";
import { Link } from "react-router-dom";
export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1300;

  useEffect(() => {
    getReservationService()
      .then((res) => {
        setReservations(res.data.content);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách đặt phòng:", err);
      });
  }, []);

  const filteredReservations = reservations.filter((rsv) =>
    rsv.maNguoiDung?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính vị trí dữ liệu theo trang
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
            <div className="reservation-avatar">A</div>
            <Link to="/">
            <span href="#">Đăng xuất</span>
            </Link>
          </div>
        </div>

        <div className="reservation-header">
            <button className="reservation-btn-add">Thêm đặt phòng</button>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm theo người đặt..."
          className="reservation-search-box"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
          }}
        />

        <table className="reservation-table">
          <thead>
            <tr>
              <th>Mã đặt</th>
              <th>Người đặt</th>
              <th>Mã người dùng</th>
              <th>Ngày nhận</th>
              <th>Ngày trả</th>
              <th>Số khách</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((rsv) => (
              <tr key={rsv.id}>
                <td>{rsv.id}</td>
                <td>{rsv.maPhong}</td>
                <td>{rsv.maNguoiDung}</td>
                <td>{rsv.ngayDen}</td>
                <td>{rsv.ngayDi}</td>
                <td>{rsv.soLuongKhach}</td>
                <td>
                  <button className="reservation-btn-edit">
                    <i className="fas fa-edit" />
                  </button>
                  <button className="reservation-btn-delete">
                    <i className="fas fa-trash" />
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
            disabled={currentPage === 1}
            className="reservation-button"
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`reservation-button ${
                currentPage === i + 1 ? "active" : ""
              }`}
              onClick={() => handleChangePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handleChangePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="reservation-button"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

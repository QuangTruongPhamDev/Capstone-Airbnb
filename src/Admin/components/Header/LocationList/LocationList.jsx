import React, { useEffect, useState } from "react";
import "./index.css";
import {
  addLocationService,
  deleteLocationService,
  getLocationService,
  updateLocationService,
} from "../../../api/locationService";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [form, setForm] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getLocationService()
      .then((res) => {
        setLocations(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Lỗi khi tải vị trí");
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
      updateLocationService(editingLocationId, form)
        .then(() => {
          toast.info("Cập nhật thành công");
          setLocations((prev) =>
            prev.map((loc) =>
              loc.id === editingLocationId ? { ...form, id: editingLocationId } : loc
            )
          );
          resetForm();
        })
        .catch(() => toast.error("Lỗi khi cập nhật vị trí"))
        .finally(() => setLoading(false));
    } else {
      addLocationService(form)
        .then((newLocation) => {
          toast.success("Thêm thành công");
          setLocations((prev) => [...prev, newLocation]);
          resetForm();
        })
        .catch(() => toast.error("Lỗi khi thêm vị trí"))
        .finally(() => setLoading(false));
    }
  };

  const resetForm = () => {
    setForm({ tenViTri: "", tinhThanh: "", quocGia: "" });
    setIsEditing(false);
    setEditingLocationId(null);
    setSearchTerm("");
    setCurrentPage(1);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa vị trí này không?")) {
      deleteLocationService(id)
        .then(() => {
          toast.warn("Xóa thành công");
          setLocations(locations.filter((loc) => loc.id !== id));
        })
        .catch(() => toast.error("Lỗi khi xóa vị trí"));
    }
  };

  const handleEdit = (loc) => {
    setForm(loc);
    setIsEditing(true);
    setEditingLocationId(loc.id);
    setShowForm(true);
  };

  const filteredLocations = locations.filter((loc) =>
    loc.tenViTri.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLocations = filteredLocations.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="locationlist-body">
      <div className="locationlist-main-content">
        <div className="locationlist-header">
          <h1 className="locationlist-h1">Quản Lý Vị Trí</h1>
          <div className="locationlist-section">
            <div className="locationlist-avatar">A</div>
            <Link to="/">
              <span>Đăng xuất</span>
            </Link>
          </div>
        </div>

        <div className="locationlist-header">
          <button
            onClick={() => setShowForm(!showForm)}
            className="locationlist-btn-add"
          >
            {showForm ? "Đóng" : "Thêm vị trí"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="locationlist-form">
            <input
              className="locationlist-input"
              name="tenViTri"
              value={form.tenViTri}
              onChange={handleChange}
              placeholder="Tên vị trí"
              required
            />
            <input
              className="locationlist-input"
              name="tinhThanh"
              value={form.tinhThanh}
              onChange={handleChange}
              placeholder="Tỉnh/Thành"
              required
            />
            <input
              className="locationlist-input"
              name="quocGia"
              value={form.quocGia}
              onChange={handleChange}
              placeholder="Quốc gia"
              required
            />
            <button
              className="locationlist-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm mới"}
            </button>
          </form>
        )}

        <input
          type="text"
          placeholder="Tìm kiếm vị trí..."
          className="locationlist-search-box"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table className="locationlist-table">
            <thead>
              <tr>
                <th>Mã vị trí</th>
                <th>Tên vị trí</th>
                <th>Tỉnh/Thành</th>
                <th>Quốc gia</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentLocations.map((loc) => (
                <tr key={loc.id}>
                  <td className="locationlist-td">{loc.id}</td>
                  <td className="locationlist-td">{loc.tenViTri}</td>
                  <td className="locationlist-td">{loc.tinhThanh}</td>
                  <td className="locationlist-td">{loc.quocGia}</td>
                  <td className="locationlist-td">
                    <button
                      className="locationlist-btn-edit"
                      onClick={() => handleEdit(loc)}
                    >
                      <i className="locationlist-i fas fa-edit" />
                    </button>
                    <button
                      className="locationlist-btn-delete"
                      onClick={() => handleDelete(loc.id)}
                    >
                      <i className="locationlist-i fas fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredLocations.length === 0 && (
          <p>Không tìm thấy vị trí phù hợp.</p>
        )}

        <div className="locationlist-pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="locationlist-button"
            enabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`locationlist-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => changePage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            className="locationlist-button"
            enabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

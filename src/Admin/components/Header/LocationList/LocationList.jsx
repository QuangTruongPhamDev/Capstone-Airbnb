import React, { useEffect, useState } from "react";
import "./index.css";
import {
  addLocationService,
  deleteLocationService,
  updateLocationService,
  getLocationService,
  uploadLocationImageService,
} from "../../../api/locationService";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LocationList() {
  const [locations, setLocations] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [form, setForm] = useState({
    tenViTri: "",
    tinhThanh: "",
    quocGia: "",
  });

  const fetchLocations = () => {
    setLoading(true);
    getLocationService(currentPage, pageSize, keyword)
      .then((res) => {
        setLocations(res.data.content.data);
        setTotalCount(res.data.content.totalRow);
      })
      .catch(() => toast.error("Lỗi khi tải danh sách vị trí"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, [currentPage, keyword]);

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
          resetForm();
          fetchLocations();
        })
        .catch(() => toast.error("Lỗi khi cập nhật vị trí"))
        .finally(() => setLoading(false));
    } else {
      addLocationService(form)
        .then(() => {
          toast.success("Thêm thành công");
          resetForm();
          fetchLocations();
        })
        .catch(() => toast.error("Lỗi khi thêm vị trí"))
        .finally(() => setLoading(false));
    }
  };

  const resetForm = () => {
    setForm({ tenViTri: "", tinhThanh: "", quocGia: "" });
    setIsEditing(false);
    setEditingLocationId(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa vị trí này không?")) {
      deleteLocationService(id)
        .then(() => {
          toast.warn("Xóa thành công");
          fetchLocations();
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

  const handleUploadImage = (file, locationId) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("formFile", file);

    uploadLocationImageService(locationId, formData)
      .then(() => {
        toast.success("Upload hình thành công");
        fetchLocations();
      })
      .catch(() => toast.error("Lỗi khi upload hình"));
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
            <Link to="/"><span><i className="locationlist-home fa fa-home"></i></span></Link>
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
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : locations.length === 0 ? (
          <p>Không tìm thấy vị trí phù hợp.</p>
        ) : (
          <table className="locationlist-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Mã vị trí</th>
                <th>Tên vị trí</th>
                <th>Tỉnh/Thành</th>
                <th>Quốc gia</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td className="locationlist-td">
                    <img
                      src={loc.hinhAnh}
                      alt={loc.tenViTri}
                      style={{ width: 80, borderRadius: 8 }}
                    />
                  </td>
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
                    <label className="locationlist-btn-upload">
                      <i className="locationlist-i fas fa-upload" />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleUploadImage(e.target.files[0], loc.id)}
                      />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="locationlist-pagination">
          <button
            onClick={() => changePage(currentPage - 1)}
            className="locationlist-button"
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
          >
            »
          </button>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

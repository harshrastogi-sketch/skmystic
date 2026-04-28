import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });
  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${BASE_URL}categories/view/${id}`);
      const result = await res.json();

      if (result.status && result.data) {
        setFormData({
          name: result.data.name || "",
          status: String(result.data.status ?? "1"),
        });
        setOldImage(result.data.image || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: result.message || "Category not found",
        }).then(() => navigate("/admin/category"));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching category",
      });
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("status", formData.status);
    if (image) data.append("image", image);

    try {
      setLoading(true);

      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}categories/update/${id}`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      Swal.close();

      if (result.status) {
        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: result.message || "Category updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admin/category");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: result.message || "Update failed",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating category",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Edit Category</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/category")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-control"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {oldImage && (
          <div className="mb-3">
            <label className="form-label d-block">Current Image</label>
            <img
              src={`${BASE_URL}${oldImage}`}
              alt="category"
              width="100"
              height="80"
              style={{ objectFit: "cover", borderRadius: "4px" }}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Change Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AddCategory() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ validation state
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // ✅ validation function
  const validate = () => {
    let tempErrors = {};

    if (!formData.name.trim()) {
      tempErrors.name = "Category name is required";
    }

    if (!image) {
      tempErrors.image = "Category image is required";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ stop if invalid
    if (!validate()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("status", formData.status);
    data.append("image", image);

    try {
      setLoading(true);

      Swal.fire({
        title: "Saving category...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}categories/store`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      Swal.close();

      if (result.status === true) {
        Swal.fire({
          icon: "success",
          title: result.message || "Category added successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/category");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: result.message || "Failed to add category",
        });
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Error adding category",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Add Category</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/category")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        {/* CATEGORY NAME */}
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        {/* STATUS */}
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

        {/* IMAGE */}
        <div className="mb-3">
          <label className="form-label">Category Image</label>
          <input
            type="file"
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && (
            <div className="invalid-feedback d-block">{errors.image}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

export default AddCategory;
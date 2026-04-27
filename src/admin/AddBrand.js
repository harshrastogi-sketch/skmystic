import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddBrand() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  
  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("status", formData.status);

    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}brands/store`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      console.log("Add brand response:", result);

      if (result.status === true) {
        alert(result.message || "Brand added successfully");
        navigate("/admin/brand");
      } else {
        alert(result.message || "Failed to add brand");
      }
    } catch (error) {
      console.log("Add brand error:", error);
      alert("Error adding brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Add Brand</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/brand")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Brand Name</label>
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

        <div className="mb-3">
          <label className="form-label">Brand Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Brand"}
        </button>
      </form>
    </div>
  );
}

export default AddBrand;
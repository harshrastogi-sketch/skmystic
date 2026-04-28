import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditBrand() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });

  const [image, setImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBrand = async () => {
    try {
      const res = await fetch(`${BASE_URL}brands/view/${id}`);
      const result = await res.json();

      if (result.status === true && result.data) {
        setFormData({
          name: result.data.name || "",
          status: String(result.data.status ?? "1"),
        });
        setOldImage(result.data.image || "");
      } else {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: result.message || "Brand not found",
        });
        navigate("/admin/brand");
      }
    } catch (error) {
      console.log("Fetch brand error:", error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error fetching brand",
      });
    }
  };

  useEffect(() => {
    fetchBrand();
  }, [id]);

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

    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation",
        text: "Brand name is required",
      });
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("status", formData.status);

      if (image) {
        data.append("image", image);
      }

      Swal.fire({
        title: "Updating brand...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}brands/update/${id}`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      Swal.close();

      if (result.status === true) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: result.message || "Brand updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admin/brand");
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: result.message || "Failed to update brand",
        });
      }
    } catch (error) {
      console.log("Update brand error:", error);
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Error updating brand",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Edit Brand</h2>
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

        {oldImage && (
          <div className="mb-3">
            <label className="form-label d-block">Current Image</label>
            <img
              src={`${BASE_URL}${oldImage}`}
              alt="brand"
              width="100"
              height="80"
              style={{ objectFit: "contain", borderRadius: "4px" }}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Change Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Brand"}
        </button>
      </form>
    </div>
  );
}

export default EditBrand;
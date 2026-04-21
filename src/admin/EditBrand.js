import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditBrand() {
  const navigate = useNavigate();
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
      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter//brands/view/${id}`
      );
      const result = await res.json();
      console.log("View brand response:", result);

      if (result.status === true && result.data) {
        setFormData({
          name: result.data.name || "",
          status: String(result.data.status ?? "1"),
        });
        setOldImage(result.data.image || "");
      } else {
        alert(result.message || "Brand not found");
        navigate("/admin/brand");
      }
    } catch (error) {
      console.log("Fetch brand error:", error);
      alert("Error fetching brand");
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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("status", formData.status);

    if (image) {
      data.append("image", image);
    }

    try {
      setLoading(true);

      const res = await fetch(
        `https://harsh.skmysticastrologer.in/CodeIgniter//brands/update/${id}`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      console.log("Update brand response:", result);

      if (result.status === true) {
        alert(result.message || "Brand updated successfully");
        navigate("/admin/brand");
      } else {
        alert(result.message || "Failed to update brand");
      }
    } catch (error) {
      console.log("Update brand error:", error);
      alert("Error updating brand");
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
              src={`https://harsh.skmysticastrologer.in/CodeIgniter//${oldImage}`}
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
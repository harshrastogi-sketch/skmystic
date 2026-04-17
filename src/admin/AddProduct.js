import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import './EditProduct.css'

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    status: "1",
  });

  const fetchCategories = async () => {
    try {
      const res = await apiRequest("https://harsh.skmysticastrologer.in/CodeIgniter/categories");

      const activeCategories = (res.data || []).filter(
        (item) => String(item.status) === "1"
      );

      setCategories(activeCategories);
    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category_id", form.category_id);
      formData.append("price", form.price);
      formData.append("discount", form.discount);
      formData.append("status", form.status);

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);

      const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/products/store", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === true) {
        alert(data.message || "Product added successfully");
        navigate("/admin/products");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.log("Add product error:", err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h5 className="mb-0">Add Product</h5>
          <div></div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Product Name</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Category</label>
              <div className="col-sm-9">
                <select
                  name="category_id"
                  className="form-control"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Description</label>
              <div className="col-sm-9">
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Price */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Price</label>
              <div className="col-sm-9">
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Discount */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Discount (%)</label>
              <div className="col-sm-9">
                <input
                  type="number"
                  name="discount"
                  className="form-control"
                  value={form.discount}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Image 1 */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Image 1</label>
              <div className="col-sm-9">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setImage1(e.target.files[0])}
                  required
                />
                {image1 && (
                  <img
                    src={URL.createObjectURL(image1)}
                    alt="Preview 1"
                    className="product-img mt-2"
                  />
                )}
              </div>
            </div>

            {/* Image 2 */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Image 2</label>
              <div className="col-sm-9">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setImage2(e.target.files[0])}
                />
                {image2 && (
                  <img
                    src={URL.createObjectURL(image2)}
                    alt="Preview 2"
                    className="product-img mt-2"
                  />
                )}
              </div>
            </div>

            {/* Status */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Status</label>
              <div className="col-sm-9">
                <select
                  name="status"
                  className="form-control"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="text-end">
              <button className="btn btn-success px-4" disabled={loading}>
                {loading ? "Saving..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
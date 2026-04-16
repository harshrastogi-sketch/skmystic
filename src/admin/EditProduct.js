import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    image1: "",
    image2: "",
  });

  // 🔥 Fetch product
  useEffect(() => {
    fetch(`http://localhost/CodeIgniter/products/view/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setForm(data.data);
        }
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost/CodeIgniter/products/update/${id}`,
        {
          method: "POST",
          body: new URLSearchParams(form),
        }
      );

      const data = await res.json();

      if (data.status === 200) {
        alert("✅ Product updated");
        navigate("/admin/products");
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.log(err);
      alert("❌ Error updating product");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">

        {/* 🔥 Header */}
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h5 className="mb-0">Edit Product</h5>
          <div></div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="row mb-3 align-items-center">
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

            {/* Category Dropdown */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Category</label>
              <div className="col-sm-9">
                <select
                  name="category"
                  className="form-control"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="ISHT DEV">ISHT DEV</option>
                  <option value="GEMS AND RINGS">GEMS AND RINGS</option>
                  <option value="RUDRAKSH">RUDRAKSH</option>
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
            <div className="row mb-3 align-items-center">
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
            <div className="row mb-3 align-items-center">
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

            {/* Image1 */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Image 1 URL</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  name="image1"
                  className="form-control"
                  value={form.image1}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Image2 */}
            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Image 2 URL</label>
              <div className="col-sm-9">
                <input
                  type="text"
                  name="image2"
                  className="form-control"
                  value={form.image2}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="row">
              <div className="col-sm-9 offset-sm-3 text-end">
                <button className="btn btn-success px-4">
                  Update Product
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
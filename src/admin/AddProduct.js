import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    discount: "",
    image1: "",
    image2: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await apiRequest("https://harsh.skmysticastrologer.in/CodeIgniter/categories");
      console.log("Category API response:", res);
      setCategories(res.data || []);
    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/products/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Add product response:", data);

      if (data.status === true) {
        alert(data.message || "Product Added Successfully");
        navigate("/admin/products");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.log(err);
      alert("Error adding product");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <button
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
            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Product Name</label>
              <div className="col-sm-9">
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Category</label>
              <div className="col-sm-9">
                <select name="category" className="form-control" value={form.category} onChange={handleChange} required >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Description</label>
              <div className="col-sm-9">
                <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Price</label>
              <div className="col-sm-9">
                <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Discount (%)</label>
              <div className="col-sm-9">
                <input type="number" name="discount" className="form-control" value={form.discount} onChange={handleChange}/>
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Image 1 URL</label>
              <div className="col-sm-9">
                <input type="text" name="image1" className="form-control" value={form.image1} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <label className="col-sm-3 col-form-label">Image 2 URL</label>
              <div className="col-sm-9">
                <input type="text" name="image2" className="form-control" value={form.image2} onChange={handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-9 offset-sm-3 text-end">
                <button className="btn btn-success px-4">
                  Save Product
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
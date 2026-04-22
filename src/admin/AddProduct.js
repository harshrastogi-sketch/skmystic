import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import "./EditProduct.css";

function AddProduct() {
  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
  // const BASE_URL = "http://localhost/CodeIgniter/";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  //   MULTIPLE IMAGES
  const [images, setImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    status: "1",
  });

  //  FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest(`${BASE_URL}/categories`);

        const active = (res.data || []).filter(
          (item) => String(item.status) === "1"
        );

        setCategories(active);
      } catch (err) {
        console.log("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  //  FORM CHANGE
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //   ADD IMAGES (APPEND)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  //   REMOVE IMAGE
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  //   CLEANUP MEMORY
  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [images]);

  //   SUBMIT
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

      images.forEach((img) => {
        formData.append("images[]", img);
      });

      const res = await fetch(`${BASE_URL}/products/store`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        alert("Product added successfully");
        navigate("/admin/products");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.log(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">

        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <button type="button" className="btn btn-light btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <h5 className="mb-0">Add Product</h5>
          <div></div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Product Name</label>
              <div className="col-sm-9">
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required/>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Category</label>
              <div className="col-sm-9">
                <select name="category_id" className="form-control" value={form.category_id} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Description</label>
              <div className="col-sm-9">
                <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange}/>
              </div>
            </div>

            {/* PRICE */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Price</label>
              <div className="col-sm-9">
                <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required/>
              </div>
            </div>

            {/* DISCOUNT */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Discount (%)</label>
              <div className="col-sm-9">
                <input type="number" name="discount" className="form-control" value={form.discount} onChange={handleChange}/>
              </div>
            </div>

            {/*   IMAGE UPLOAD */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Product Images</label>
              <div className="col-sm-9">
                <input type="file" multiple className="form-control" onChange={handleImageChange} required/>

                {/*   GRID PREVIEW */}
                {images.length > 0 && (
                  <div className="image-grid">
                    {images.map((file, i) => {
                      const preview = URL.createObjectURL(file);

                      return (
                        <div key={i} className="image-card">
                          <img src={preview} alt="preview" />
                          <button type="button" className="delete-btn" onClick={() => handleRemoveImage(i)}>×</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Status</label>
              <div className="col-sm-9">
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>

            {/* SUBMIT */}
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
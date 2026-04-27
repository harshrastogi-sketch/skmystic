import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import "./EditProduct.css";

function AddProduct() {
 // const BASE_URL = "http://localhost/CodeIgniter/";
   const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // IMAGES WITH ORDER
  const [images, setImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    status: "1",
    stock_status: "in_stock",
  });

  // FETCH CATEGORIES
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

  // FORM CHANGE
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ADD IMAGES WITH ORDER
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newImages = files.map((file, index) => ({
      file,
      id: `${Date.now()}-${index}`,
      preview: URL.createObjectURL(file),
      order: images.length + index,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // REMOVE IMAGE
  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // DRAG START
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  // DRAG OVER
  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (dragIndex === null || dragIndex === index) return;

    const updated = [...images];

    const draggedItem = updated[dragIndex];
    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    // update order
    const reordered = updated.map((img, i) => ({
      ...img,
      order: i,
    }));

    setImages(reordered);
    setDragIndex(index);
  };

  // DRAG END
  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // CLEANUP MEMORY
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  // SUBMIT
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
      formData.append("stock_status", form.stock_status);

      // send images in order
      images.forEach((img) => {
        formData.append("images[]", img.file);
        formData.append("image_order[]", img.order);
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
                <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
            </div>

            {/* CATEGORY */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Category</label>
              <div className="col-sm-9">
                <select name="category_id" className="form-control" value={form.category_id} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Description</label>
              <div className="col-sm-9">
                <textarea name="description" className="form-control" rows="3" value={form.description} onChange={handleChange} />
              </div>
            </div>

            {/* PRICE */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Price</label>
              <div className="col-sm-9">
                <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required />
              </div>
            </div>

            {/* DISCOUNT */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Discount (%)</label>
              <div className="col-sm-9">
                <input type="number" name="discount" className="form-control" value={form.discount} onChange={handleChange} />
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Availability</label>
              <div className="col-sm-9">
                <select name="stock_status"  className="form-control" value={form.stock_status} onChange={handleChange} >
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>


            {/* IMAGE UPLOAD + DRAG DROP */}
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Product Images</label>
              <div className="col-sm-9">
                <input type="file" multiple className="form-control" onChange={handleImageChange} required />

                {images.length > 0 && (
                  <div className="image-grid">
                    {images
                      .sort((a, b) => a.order - b.order)
                      .map((img, index) => (
                        <div
                          key={img.id}
                          className="image-card"
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <img src={img.preview} alt="preview" />
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => handleRemoveImage(img.id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
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
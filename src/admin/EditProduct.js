import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
  // const BASE_URL = "http://localhost/CodeIgniter/";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState([]); // new images
  const [oldImages, setOldImages] = useState([]); // existing images
  const [deletedImages, setDeletedImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    status: "1",
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // ✅ FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      const res = await fetch(`${BASE_URL}products/view/${id}`);
      const data = await res.json();

      if (data.status && data.data) {
        const product = data.data;

        setForm({
          name: product.name || "",
          description: product.description || "",
          category_id: String(product.category_id || ""),
          price: product.price || "",
          discount: product.discount || "",
          status: String(product.status ?? "1"),
        });

        setOldImages(product.images || []);
      } else {
        alert("Product not found");
        navigate("/admin/products");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}categories`);
      const data = await res.json();

      const active = (data.data || []).filter(
        (item) => String(item.status) === "1"
      );

      setCategories(active);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FORM CHANGE
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ ADD NEW IMAGES (append)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // ✅ REMOVE NEW IMAGE
  const handleRemoveNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ REMOVE OLD IMAGE
  const handleRemoveOldImage = (index) => {
    const img = oldImages[index];

    setDeletedImages((prev) => [...prev, img.id]);

    const updated = [...oldImages];
    updated.splice(index, 1);
    setOldImages(updated);
  };

  // ✅ CLEANUP (memory safe)
  useEffect(() => {
    return () => {
      images.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [images]);

  // ✅ SUBMIT
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

      // keep old images
      oldImages.forEach((img, i) => {
        formData.append(`old_images[${i}]`, img.id);
      });

      // delete images
      deletedImages.forEach((id, i) => {
        formData.append(`delete_images[${i}]`, id);
      });

      // new images
      images.forEach((img) => {
        formData.append("images[]", img);
      });

      const res = await fetch(`${BASE_URL}products/update/${id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        alert("Product updated successfully");
        navigate("/admin/products");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">

        <div className="card-header bg-dark text-white d-flex justify-content-between">
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h5>Edit Product</h5>
          <div></div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="mb-3">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* CATEGORY */}
            <div className="mb-3">
              <label>Category</label>
              <select
                name="category_id"
                className="form-control"
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* PRICE */}
            <div className="mb-3">
              <label>Price</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* DISCOUNT */}
            <div className="mb-3">
              <label>Discount</label>
              <input
                type="number"
                name="discount"
                className="form-control"
                value={form.discount}
                onChange={handleChange}
              />
            </div>

            {/* EXISTING IMAGES */}
            <div className="mb-3">
              <label>Existing Images</label>

              <div className="image-grid">
                {oldImages.map((img, i) => (
                  <div key={i} className="image-card">
                    <img src={`${BASE_URL}${img.image}`} alt="product" />

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleRemoveOldImage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW IMAGES */}
            <div className="mb-3">
              <label>Add New Images</label>

              <input
                type="file"
                multiple
                className="form-control"
                onChange={handleImageChange}
              />

              {images.length > 0 && (
                <div className="image-grid">
                  {images.map((file, i) => {
                    const previewUrl = URL.createObjectURL(file);

                    return (
                      <div key={i} className="image-card">
                        <img src={previewUrl} alt="preview" />

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleRemoveNewImage(i)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STATUS */}
            <div className="mb-3">
              <label>Status</label>
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

            {/* SUBMIT */}
            <div className="text-end">
              <button className="btn btn-success" disabled={loading}>
                {loading ? "Updating..." : "Update Product"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
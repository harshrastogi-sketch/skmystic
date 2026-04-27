import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = "https://harsh.skmysticastrologer.in/CodeIgniter/";
   //const BASE_URL = "http://localhost/CodeIgniter/";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ unified images
  const [items, setItems] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    status: "1",
    stock_status: "in_stock",
  });

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // ================= FETCH PRODUCT =================
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
          stock_status: product.stock_status || "in_stock",
        });

        const oldImgs = (product.images || []).map((img, index) => ({
          id: `old-${img.id}`,
          dbId: img.id,
          url: `${BASE_URL}${img.image}`,
          type: "old",
          order: index,
        }));

        setItems(oldImgs);
      } else {
        alert("Product not found");
        navigate("/admin/products");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH CATEGORIES =================
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

  // ================= FORM =================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= ADD NEW IMAGES =================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newItems = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      type: "new",
      order: items.length + index,
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  // ================= REMOVE IMAGE =================
  const handleRemove = (item) => {
    if (item.type === "old") {
      setDeletedImages((prev) => [...prev, item.dbId]);
    }

    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  // ================= DRAG =================
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (dragIndex === null || dragIndex === index) return;

    const updated = [...items];

    const draggedItem = updated[dragIndex];
    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    const reordered = updated.map((item, i) => ({
      ...item,
      order: i,
    }));

    setItems(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.type === "new") {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [items]);

  // ================= SUBMIT =================
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

      // keep old images
      items
        .filter((i) => i.type === "old")
        .forEach((img, i) => {
          formData.append(`old_images[${i}]`, img.dbId);
        });

      // deleted images
      deletedImages.forEach((id, i) => {
        formData.append(`delete_images[${i}]`, id);
      });

      // new images
      items
        .filter((i) => i.type === "new")
        .forEach((img) => {
          formData.append("images[]", img.file);
        });

      // image order
      formData.append(
        "image_order",
        JSON.stringify(
          items.map((i) => ({
            id: i.dbId || null,
            type: i.type,
            order: i.order,
          }))
        )
      );

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

  // ================= SORTED =================
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  // ================= UI =================
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
            {/* AVAILABILITY */}
            <div className="mb-3">
              <label>Availability</label>
              <select
                name="stock_status"
                className="form-control"
                value={form.stock_status}
                onChange={handleChange}
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* IMAGES (UNIFIED + DRAG) */}
            <div className="mb-3">
              <label>Images (Drag to reorder)</label>

              <input
                type="file"
                multiple
                className="form-control"
                onChange={handleImageChange}
              />

              <div className="image-grid mt-3">
                {sortedItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="image-card"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <img src={item.url} alt="" />

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleRemove(item)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
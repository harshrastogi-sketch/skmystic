import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";
import "./EditProduct.css";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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
        Swal.fire({
          icon: "error",
          title: "Product not found",
        }).then(() => navigate("/admin/products"));
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load product",
      });
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ================= IMAGES =================
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

  const handleRemove = (item) => {
    if (item.type === "old") {
      setDeletedImages((prev) => [...prev, item.dbId]);
    }
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  // ================= DRAG =================
  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...items];
    const dragged = updated[dragIndex];

    updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);

    setItems(updated.map((i, idx) => ({ ...i, order: idx })));
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      Swal.fire({
        title: "Updating product...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const formData = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        formData.append(k, v);
      });

      items
        .filter((i) => i.type === "old")
        .forEach((img, i) => {
          formData.append(`old_images[${i}]`, img.dbId);
        });

      deletedImages.forEach((id, i) => {
        formData.append(`delete_images[${i}]`, id);
      });

      items
        .filter((i) => i.type === "new")
        .forEach((img) => {
          formData.append("images[]", img.file);
        });

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
      Swal.close();

      if (data.status) {
        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Product updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/admin/products");
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Update failed",
        });
      }
    } catch (err) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div />
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>

            <input
              className="form-control mb-2"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
            />

            <select
              className="form-control mb-2"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <CKEditor
              editor={ClassicEditor}
              data={form.description}
              onChange={(e, editor) =>
                setForm((p) => ({ ...p, description: editor.getData() }))
              }
            />

            <input className="form-control mb-2" name="price" value={form.price} onChange={handleChange} />
            <input className="form-control mb-2" name="discount" value={form.discount} onChange={handleChange} />

            <input type="file" multiple className="form-control mb-3" onChange={handleImageChange} />

            <div className="image-grid">
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
                  <button type="button" onClick={() => handleRemove(item)}>×</button>
                </div>
              ))}
            </div>

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
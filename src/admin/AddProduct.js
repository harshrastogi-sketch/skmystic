import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import Swal from "sweetalert2";
import "./EditProduct.css";

function AddProduct() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: [],
    price: "",
    rating: "5",
    product_cut_price: "",
    discount: "",
    product_hurry_up: "",
    product_short_description: "",
    hsn_code: "",
    product_sku: "",
    status: "1",
    stock_status: "in_stock",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiRequest(`${BASE_URL}/categories`);

        const active = (res.data || []).filter(
          (item) => String(item.status) === "1"
        );

        setCategories(active);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load categories",
        });
      }
    };

    fetchCategories();
  }, [BASE_URL]);

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024;

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          images: "Only JPG, PNG and WEBP images are allowed",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          images: "Each image must be less than 2MB",
        }));
        return;
      }
    }

    const newImages = files.map((file, index) => ({
      file,
      id: `${Date.now()}-${index}`,
      preview: URL.createObjectURL(file),
      order: images.length + index,
    }));

    setImages((prev) => [...prev, ...newImages]);

    setErrors((prev) => ({
      ...prev,
      images: "",
    }));
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();

    if (dragIndex === null || dragIndex === index) return;

    const updated = [...images];
    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    const reordered = updated.map((img, i) => ({
      ...img,
      order: i,
    }));

    setImages(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const validate = () => {
    let tempErrors = {};

    if (!form.name.trim()) {
      tempErrors.name = "Product name is required";
    }

   if (
  !form.category_id ||
  form.category_id.length === 0
) {
  tempErrors.category_id =
    "Category is required";
}

    if (!stripHtml(form.description).trim()) {
      tempErrors.description = "Description is required";
    }

    if (!form.price) {
      tempErrors.price = "Price is required";
    } else if (Number(form.price) <= 0) {
      tempErrors.price = "Price must be greater than 0";
    }

    if (!form.product_cut_price) {
      tempErrors.product_cut_price = "Product cut price is required";
    } else if (Number(form.product_cut_price) <= 0) {
      tempErrors.product_cut_price = "Product cut price must be greater than 0";
    } else if (Number(form.product_cut_price) <= Number(form.price)) {
      tempErrors.product_cut_price =
        "Cut price must be greater than selling price";
    }

    if (!form.discount) {
      tempErrors.discount = "Discount is required";
    } else if (Number(form.discount) < 0) {
      tempErrors.discount = "Discount cannot be negative";
    } else if (Number(form.discount) > 100) {
      tempErrors.discount = "Discount cannot exceed 100%";
    }

    if (!form.rating) {
      tempErrors.rating = "Rating is required";
    } else if (Number(form.rating) < 0) {
      tempErrors.rating = "Rating cannot be negative";
    } else if (Number(form.rating) > 5) {
      tempErrors.rating = "Rating cannot exceed 5";
    }

    if (!form.product_hurry_up.trim()) {
      tempErrors.product_hurry_up = "Product hurry up text is required";
    }

    if (!stripHtml(form.product_short_description).trim()) {
      tempErrors.product_short_description =
        "Product short description is required";
    }

    if (!form.hsn_code) {
      tempErrors.hsn_code = "HSN code is required";
    } else if (Number(form.hsn_code) < 0) {
      tempErrors.hsn_code = "HSN code cannot be negative";
    }

    if (!form.product_sku.trim()) {
      tempErrors.product_sku = "Product SKU is required";
    }

    if (!form.stock_status) {
      tempErrors.stock_status = "Stock status is required";
    }

    if (!form.status) {
      tempErrors.status = "Status is required";
    }

    if (images.length === 0) {
      tempErrors.images = "At least one image is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill all required fields correctly",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      form.category_id.forEach((catId) => {
  formData.append("category_id[]", catId);
});
      formData.append("price", form.price);
      formData.append("product_cut_price", form.product_cut_price);
      formData.append("discount", form.discount);
      formData.append("product_hurry_up", form.product_hurry_up);
      formData.append(
        "product_short_description",
        form.product_short_description
      );
      formData.append("hsn_code", form.hsn_code);
      formData.append("rating", form.rating);
      formData.append("product_sku", form.product_sku);
      formData.append("status", form.status);
      formData.append("stock_status", form.stock_status);

      images.forEach((img) => {
        formData.append("images[]", img.file);
        formData.append("image_order[]", img.order);
      });

      Swal.fire({
        title: "Saving product...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}/products/store`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      Swal.close();

      if (data.status) {
        Swal.fire({
          icon: "success",
          title: "Product added successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: data.message || "Failed to add product",
        });
      }
    } catch (err) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Error adding product",
      });
    } finally {
      setLoading(false);
    }
  };

  function MyUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return createUploadAdapter(loader);
    };
  }

  function createUploadAdapter(loader) {
    return {
      upload: () => {
        return loader.file.then((file) => {
          const imageFormData = new FormData();
          imageFormData.append("image", file);

          return fetch(`${BASE_URL}api/editor-image`, {
            method: "POST",
            body: imageFormData,
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.status) {
                throw new Error(res.message || "Image upload failed");
              }

              return {
                default: res.url,
              };
            });
        });
      },

      abort: () => {},
    };
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <button className="btn btn-light btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <h5 className="mb-0">Add Product</h5>

          <div></div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Product Name</label>

              <div className="col-sm-9">
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  value={form.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
            </div>

        {/* CATEGORY */}
<div className="row mb-3">
  <label className="col-sm-3 col-form-label">
    Category
  </label>

  <div className="col-sm-9">

    <Select
  isMulti
  name="category_id"
  options={categories.map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }))}
  value={categories
    .filter((cat) => form.category_id.includes(String(cat.id)))
    .map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    }))}
  onChange={(selectedOptions) => {
    const values = selectedOptions
      ? selectedOptions.map((item) => item.value)
      : [];

    setForm((prev) => ({
      ...prev,
      category_id: values,
    }));

    setErrors((prev) => ({
      ...prev,
      category_id: "",
    }));
  }}
  placeholder="Select Categories"
  classNamePrefix="react-select"
  menuPortalTarget={document.body}
  styles={{
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  }}
/>

    {errors.category_id && (
      <div className="text-danger mt-1">
        {errors.category_id}
      </div>
    )}

  </div>
</div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Description</label>

              <div className="col-sm-9">
                <div className={errors.description ? "border border-danger" : ""}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={form.description}
                    config={{
                      extraPlugins: [MyUploadAdapterPlugin],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();

                      setForm((prev) => ({
                        ...prev,
                        description: data,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        description: "",
                      }));
                    }}
                  />
                </div>

                {errors.description && (
                  <div className="text-danger mt-1">{errors.description}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Price</label>

              <div className="col-sm-9">
                <input
                  type="number"
                  name="price"
                  className={`form-control ${
                    errors.price ? "is-invalid" : ""
                  }`}
                  value={form.price}
                  onChange={handleChange}
                />

                {errors.price && (
                  <div className="invalid-feedback">{errors.price}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">
                Product Cut Price
              </label>

              <div className="col-sm-9">
                <input
                  type="number"
                  name="product_cut_price"
                  className={`form-control ${
                    errors.product_cut_price ? "is-invalid" : ""
                  }`}
                  value={form.product_cut_price}
                  onChange={handleChange}
                />

                {errors.product_cut_price && (
                  <div className="invalid-feedback">
                    {errors.product_cut_price}
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Discount (%)</label>

              <div className="col-sm-9">
                <input
                  type="number"
                  name="discount"
                  className={`form-control ${
                    errors.discount ? "is-invalid" : ""
                  }`}
                  value={form.discount}
                  onChange={handleChange}
                />

                {errors.discount && (
                  <div className="invalid-feedback">{errors.discount}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Product Rating</label>

              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  name="rating"
                  className={`form-control ${
                    errors.rating ? "is-invalid" : ""
                  }`}
                  value={form.rating}
                  onChange={handleChange}
                  placeholder="Example: 4.5"
                />

                {errors.rating && (
                  <div className="invalid-feedback">{errors.rating}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">
                Product Hurry Up
              </label>

              <div className="col-sm-9">
                <input
                  type="text"
                  name="product_hurry_up"
                  className={`form-control ${
                    errors.product_hurry_up ? "is-invalid" : ""
                  }`}
                  value={form.product_hurry_up}
                  onChange={handleChange}
                  placeholder="Hurry up! only 7 products left in stock!"
                />

                {errors.product_hurry_up && (
                  <div className="invalid-feedback">
                    {errors.product_hurry_up}
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">
                Product Short Description
              </label>

              <div className="col-sm-9">
                <div
                  className={
                    errors.product_short_description
                      ? "border border-danger"
                      : ""
                  }
                >
                  <CKEditor
                    editor={ClassicEditor}
                    data={form.product_short_description}
                    config={{
                      extraPlugins: [MyUploadAdapterPlugin],
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();

                      setForm((prev) => ({
                        ...prev,
                        product_short_description: data,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        product_short_description: "",
                      }));
                    }}
                  />
                </div>

                {errors.product_short_description && (
                  <div className="text-danger mt-1">
                    {errors.product_short_description}
                  </div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">HSN Code</label>

              <div className="col-sm-9">
                <input
                  type="number"
                  name="hsn_code"
                  className={`form-control ${
                    errors.hsn_code ? "is-invalid" : ""
                  }`}
                  value={form.hsn_code}
                  onChange={handleChange}
                />

                {errors.hsn_code && (
                  <div className="invalid-feedback">{errors.hsn_code}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">
                Product SKU Number
              </label>

              <div className="col-sm-9">
                <input
                  type="text"
                  name="product_sku"
                  className={`form-control ${
                    errors.product_sku ? "is-invalid" : ""
                  }`}
                  value={form.product_sku}
                  onChange={handleChange}
                  placeholder="Example: RUBY-001"
                />

                {errors.product_sku && (
                  <div className="invalid-feedback">{errors.product_sku}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Stock Status</label>

              <div className="col-sm-9">
                <select
                  name="stock_status"
                  className={`form-control ${
                    errors.stock_status ? "is-invalid" : ""
                  }`}
                  value={form.stock_status}
                  onChange={handleChange}
                >
                  <option value="">Select Stock Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>

                {errors.stock_status && (
                  <div className="invalid-feedback">{errors.stock_status}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Status</label>

              <div className="col-sm-9">
                <select
                  name="status"
                  className={`form-control ${
                    errors.status ? "is-invalid" : ""
                  }`}
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>

                {errors.status && (
                  <div className="invalid-feedback">{errors.status}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <label className="col-sm-3 col-form-label">Images</label>

              <div className="col-sm-9">
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className={`form-control ${
                    errors.images ? "is-invalid" : ""
                  }`}
                  onChange={handleImageChange}
                />

                {errors.images && (
                  <div className="invalid-feedback d-block">
                    {errors.images}
                  </div>
                )}

                {images.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {images.map((img, index) => (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{
                          width: "90px",
                          height: "90px",
                          position: "relative",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          overflow: "hidden",
                          cursor: "move",
                        }}
                      >
                        <img
                          src={img.preview}
                          alt="preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            border: "none",
                            background: "red",
                            color: "#fff",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            lineHeight: "18px",
                            fontSize: "12px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-end">
              <button className="btn btn-success" disabled={loading}>
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
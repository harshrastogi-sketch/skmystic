import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Swal from "sweetalert2";

function AddBlog() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    content: "",
    date: "",
    status: "1",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ validation state
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);

    setErrors((prev) => ({
      ...prev,
      image: "",
    }));
  };

  // ✅ validation function
  const validate = () => {
    let tempErrors = {};

    if (!formData.title.trim()) {
      tempErrors.title = "Title is required";
    }

    if (!formData.author.trim()) {
      tempErrors.author = "Author is required";
    }

    if (!formData.description || formData.description === "<p><br></p>") {
      tempErrors.description = "Description is required";
    }

    if (!formData.content.trim()) {
      tempErrors.content = "Content is required";
    }

    if (!formData.date) {
      tempErrors.date = "Date is required";
    }

    if (!image) {
      tempErrors.image = "Blog image is required";
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("description", formData.description);
    data.append("content", formData.content);
    data.append("date", formData.date);
    data.append("status", formData.status);
    data.append("image", image);

    try {
      setLoading(true);

      Swal.fire({
        title: "Saving blog...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(`${BASE_URL}blogs/store`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      Swal.close();

      if (result.status === true) {
        Swal.fire({
          icon: "success",
          title: result.message || "Blog added successfully",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/admin/blog");
        }, 1500);
      } else {
        Swal.fire({
          icon: "error",
          title: result.message || "Failed to add blog",
        });
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Error adding blog",
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

      abort: () => { },
    };
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Add Blog</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/blog")}
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

        {/* TITLE */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <div className="invalid-feedback">{errors.title}</div>
          )}
        </div>

        {/* AUTHOR */}
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            name="author"
            className={`form-control ${errors.author ? "is-invalid" : ""}`}
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && (
            <div className="invalid-feedback">{errors.author}</div>
          )}
        </div>

        {/* DESCRIPTION (CKEditor) */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <div className={errors.description ? "border border-danger rounded" : ""}>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description || ""}
              config={{
                    extraPlugins: [MyUploadAdapterPlugin],
                  }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setFormData((prev) => ({
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

        {/* CONTENT */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            className={`form-control ${errors.content ? "is-invalid" : ""}`}
            rows="6"
            value={formData.content}
            onChange={handleChange}
          />
          {errors.content && (
            <div className="invalid-feedback">{errors.content}</div>
          )}
        </div>

        {/* DATE */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className={`form-control ${errors.date ? "is-invalid" : ""}`}
            value={formData.date}
            onChange={handleChange}
          />
          {errors.date && (
            <div className="invalid-feedback">{errors.date}</div>
          )}
        </div>

        {/* STATUS */}
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

        {/* IMAGE */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && (
            <div className="invalid-feedback d-block">{errors.image}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
}

export default AddBlog;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddFaq() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ CKEDITOR CHANGE
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();

    setFormData({
      ...formData,
      description: data,
    });

    setErrors({ ...errors, description: "" });
  };

  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}faq/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status) {
        Swal.fire("Success", "FAQ added successfully", "success");
        navigate("/admin/faq");
      } else {
        Swal.fire("Error", data.message || "Failed to add FAQ", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }

    setLoading(false);
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
          const formData = new FormData();
          formData.append("image", file);

          return fetch(`${BASE_URL}api/editor-image`, {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((res) => {
              if (!res.status) {
                throw new Error(res.message || "Image upload failed");
              }

              return {
                default: res.url, // ✅ same as before
              };
            });
        });
      },

      abort: () => {
        // optional: handle cancel upload
      },
    };
  }
  return (
    <div className="container mt-4">
      <style>
        {`
        .ck-content img {
          max-width: 100%;
          height: auto;
        }

        .ck-content figure.image {
          max-width: 100%;
        }
      `}
      </style>
      <h2>Add FAQ</h2>

      <form onSubmit={handleSubmit} className="card p-4">
        {/* Heading */}
        <div className="mb-3">
          <label className="form-label">Heading</label>
          <input
            type="text"
            name="heading"
            className={`form-control ${errors.heading ? "is-invalid" : ""}`}
            value={formData.heading}
            onChange={handleChange}
            placeholder="Enter FAQ heading"
          />
          {errors.heading && (
            <div className="text-danger">{errors.heading}</div>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>

          <div className={errors.description ? "border border-danger p-1" : ""}>
            <CKEditor
              editor={ClassicEditor}
              data={formData.description}
              config={{
                extraPlugins: [MyUploadAdapterPlugin],
              }}
              onChange={handleEditorChange}
            />
          </div>

          {errors.description && (
            <div className="text-danger mt-1">
              {errors.description}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save FAQ"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/faq")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFaq;
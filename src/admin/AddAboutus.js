import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function AddAboutUs() {
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();

    setFormData((prev) => ({
      ...prev,
      description: data,
    }));

    setErrors((prev) => ({
      ...prev,
      description: "",
    }));
  };

  const isEmptyHTML = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent.trim() === "" && div.querySelector("img") === null;
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    }

    if (!formData.description || isEmptyHTML(formData.description)) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}aboutus/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status) {
        Swal.fire("Success", "About Us added successfully", "success");
        navigate("/admin/about-us");
      } else {
        Swal.fire("Error", data.message || "Failed to add About Us", "error");
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

      <h2>Add About Us</h2>

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Heading</label>
          <input
            type="text"
            name="heading"
            className={`form-control ${errors.heading ? "is-invalid" : ""}`}
            value={formData.heading}
            onChange={handleChange}
            placeholder="Enter About Us heading"
          />
          {errors.heading && (
            <div className="text-danger">{errors.heading}</div>
          )}
        </div>

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
            <div className="text-danger mt-1">{errors.description}</div>
          )}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Saving..." : "Save About Us"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/about-us")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAboutUs;
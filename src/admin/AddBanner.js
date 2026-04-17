import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function AddBanner() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user || user.role !== "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file || null);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!bannerImage) {
      alert("Banner image is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("image", bannerImage);

      const res = await fetch("https://harsh.skmysticastrologer.in/CodeIgniter/api/add-banner", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        alert("Banner added successfully");
        navigate("/admin/banner");
      } else {
        alert(data.message || "Add banner failed");
      }
    } catch (error) {
      console.log("Add banner error:", error);
      alert("Something went wrong while adding banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h3 className="mb-0 text-info fw-bold">Add Banner</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 row align-items-center">
              <label className="col-sm-2 col-form-label">Title</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter banner title"
                />
              </div>
            </div>

            <div className="mb-3 row align-items-center">
              <label className="col-sm-2 col-form-label">Banner</label>
              <div className="col-sm-10">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {preview && (
              <div className="mb-3 row">
                <label className="col-sm-2 col-form-label">Preview</label>
                <div className="col-sm-10">
                  <img
                    src={preview}
                    alt="Banner Preview"
                    style={{
                      width: "220px",
                      height: "110px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-sm-10 offset-sm-2 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-info text-white px-4"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => navigate("/admin/banner")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBanner;
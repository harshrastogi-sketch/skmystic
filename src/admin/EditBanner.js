import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function EditBanner() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [banner, setBanner] = useState(null);
  const [title, setTitle] = useState(""); // ✅ NEW
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!token || !user || user.role !== "admin") {
      navigate("/admin");
      return;
    }

    fetchBanner(token);
  }, [id, navigate]);

  const fetchBanner = async (token) => {
    try {
      const res = await fetch(`https://harsh.skmysticastrologer.in/CodeIgniter/api/banner/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status && data.data) {
        const bannerData = data.data;
        setBanner(bannerData);

        setTitle(bannerData.title || ""); // ✅ SET TITLE

        setPreview(
          bannerData.image
            ? `https://harsh.skmysticastrologer.in/CodeIgniter/${bannerData.image}`
            : ""
        );
      } else {
        alert(data.message || "Banner not found");
        navigate("/admin/banner");
      }
    } catch (error) {
      console.log("Fetch banner error:", error);
      alert("Failed to load banner");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title); // ✅ SEND TITLE

      if (bannerImage) {
        formData.append("image", bannerImage);
      }
      console.log(bannerImage  );
      const res = await fetch(`https://harsh.skmysticastrologer.in/CodeIgniter/api/update-banner/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        alert("Banner updated successfully");
        navigate("/admin/banner");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.log("Update error:", error);
      alert("Something went wrong while updating banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h3 className="mb-0 text-info fw-bold">Edit Banner</h3>
        </div>

        <div className="card-body">
          <form onSubmit={handleUpdate}>

            {/* ✅ TITLE FIELD */}
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

            {/* IMAGE */}
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

            {/* PREVIEW */}
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

            {/* BUTTONS */}
            <div className="row">
              <div className="col-sm-10 offset-sm-2 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-info text-white px-4"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
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

export default EditBanner;
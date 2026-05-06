import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditCustomerreview() {
    const navigate = useNavigate();
    const { id } = useParams();

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        description: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    const fetchReview = async () => {
        try {
            const res = await fetch(`${BASE_URL}api/reviewByid/${id}`);

            const data = await res.json();

            if (data.status) {
                setFormData({
                    name: data.data.name || "",
                    title: data.data.title || "",
                    description: data.data.description || "",
                });

                if (data.data.image) {
                    setPreview(
                        data.data.image.startsWith("http")
                            ? data.data.image
                            : `${BASE_URL}${data.data.image}`
                    );
                }
            } else {
                Swal.fire("Error", "Customer Review not found", "error");
                navigate("/admin/customer-review");
            }
        } catch {
            Swal.fire("Error", "Failed to fetch customer review", "error");
        }
    };

    useEffect(() => {
        fetchReview();
    }, []);

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


    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }

        setErrors((prev) => ({
            ...prev,
            image: "",
        }));
    };


    const validate = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const data = new FormData();

        data.append("name", formData.name);
        data.append("title", formData.title);
        data.append("description", formData.description);

        if (image) {
            data.append("image", image);
        }

        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}api/review-update/${id}`, {
                method: "POST",
                body: data,
            });

            const result = await res.json();

            if (result.status) {
                Swal.fire(
                    "Success",
                    "Customer Review updated successfully",
                    "success"
                );

                navigate("/admin/customer-review");
            } else {
                Swal.fire(
                    "Error",
                    result.message || "Failed to update Customer Review",
                    "error"
                );
            }
        } catch {
            Swal.fire("Error", "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Edit Customer Review</h2>

            <form onSubmit={handleSubmit} className="card p-4">
                {/* IMAGE */}
                <div className="mb-3">
                    <label className="form-label">Customer Image</label>

                    <input
                        type="file"
                        className={`form-control ${errors.image ? "is-invalid" : ""}`}
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    {errors.image && (
                        <div className="text-danger">{errors.image}</div>
                    )}
                </div>

                {/* PREVIEW */}
                {preview && (
                    <div className="mb-3">
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </div>
                )}

                {/* NAME */}
                <div className="mb-3">
                    <label className="form-label">Customer Name</label>

                    <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter customer name"
                    />

                    {errors.name && (
                        <div className="text-danger">{errors.name}</div>
                    )}
                </div>

                {/* TITLE */}
                <div className="mb-3">
                    <label className="form-label">Review Title</label>

                    <input
                        type="text"
                        name="title"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter review title"
                    />

                    {errors.title && (
                        <div className="text-danger">{errors.title}</div>
                    )}
                </div>

                {/* DESCRIPTION */}
                <div className="mb-3">
                    <label className="form-label">Description</label>

                    <textarea
                        name="description"
                        className={`form-control ${errors.description ? "is-invalid" : ""
                            }`}
                        rows="5"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter customer review"
                    />

                    {errors.description && (
                        <div className="text-danger">{errors.description}</div>
                    )}
                </div>

                {/* BUTTONS */}
                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Customer Review"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/admin/customer-review")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditCustomerreview;